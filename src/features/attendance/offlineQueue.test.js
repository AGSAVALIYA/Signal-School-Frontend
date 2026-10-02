import { beforeEach, describe, expect, it, vi } from 'vitest';

// In-memory IndexedDB stand-in and a controllable API.
const store = new Map();
vi.mock('idb-keyval', () => ({
  get: async (k) => store.get(k),
  set: async (k, v) => void store.set(k, v),
  del: async (k) => void store.delete(k),
}));
const put = vi.fn();
vi.mock('../../api/client', () => ({ api: { put: (...a) => put(...a) } }));

const q = await import('./offlineQueue');
const item = (sectionId, date = '2026-10-01') => ({ sectionId, date, rows: [{ studentId: 1, status: 'P' }], clientMarkedAt: '2026-10-01T09:00:00Z' });
const err = (code, status = 400) => Object.assign(new Error(code), { code, status });

describe('offline attendance queue', () => {
  beforeEach(() => {
    store.clear();
    put.mockReset();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('keeps one entry per class and date (the newest)', async () => {
    await q.enqueue(item(1));
    await q.enqueue({ ...item(1), rows: [{ studentId: 1, status: 'A' }] });
    await q.enqueue(item(2));
    expect(store.get('attendance-queue').map((i) => i.sectionId)).toEqual([1, 2]);
    expect(store.get('attendance-queue')[0].rows[0].status).toBe('A');
  });

  it('uploads everything when the server accepts', async () => {
    put.mockResolvedValue({});
    await q.enqueue(item(1));
    await q.enqueue(item(2));
    await q.flush();
    expect(put).toHaveBeenCalledTimes(2);
    expect(store.get('attendance-queue')).toEqual([]);
  });

  it('keeps items while the problem is temporary (no network, logged out, server error)', async () => {
    for (const e of [err('NETWORK', 0), err('SESSION_EXPIRED', 401), err('INTERNAL', 500)]) {
      put.mockRejectedValueOnce(e);
      await q.enqueue(item(1));
      await q.flush();
      expect(store.get('attendance-queue')).toHaveLength(1);
    }
    expect(store.get('attendance-failed')).toBeUndefined();
  });

  it('moves a definite refusal to the failed list so the teacher is told', async () => {
    put.mockRejectedValueOnce(err('ATTENDANCE_LOCKED', 423)).mockResolvedValueOnce({});
    await q.enqueue(item(1));
    await q.enqueue(item(2));
    await q.flush();
    expect(store.get('attendance-queue')).toEqual([]);
    expect(store.get('attendance-failed')).toEqual([expect.objectContaining({ sectionId: 1, code: 'ATTENDANCE_LOCKED' })]);
    await q.dismissFailures();
    expect(store.get('attendance-failed')).toBeUndefined();
  });

  it('clearQueue forgets everything (logout on a shared phone)', async () => {
    await q.enqueue(item(1));
    await q.clearQueue();
    expect(store.get('attendance-queue')).toBeUndefined();
  });
});
