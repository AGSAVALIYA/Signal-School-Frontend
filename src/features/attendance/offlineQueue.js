import { del, get, set } from 'idb-keyval';
import { useSyncExternalStore } from 'react';
import { api } from '../../api/client';

// Attendance saved without network waits here (IndexedDB) and uploads when the phone is online again.
// Items stay queued while the problem is temporary (no network, server down, logged out); only a definite
// refusal (e.g. the date is locked) moves an item to `failed`, which the app shows to the teacher.
const KEY = 'attendance-queue';
const FAILED_KEY = 'attendance-failed';
const TEMPORARY = new Set(['NETWORK', 'INTERNAL', 'RATE_LIMITED', 'UNAUTHENTICATED', 'SESSION_EXPIRED']);
const listeners = new Set();
let snapshot = { count: 0, failed: [] };

const notify = () => listeners.forEach((l) => l());
const load = async (key = KEY) => (await get(key).catch(() => [])) || [];
const publish = async () => {
  snapshot = { count: (await load()).length, failed: await load(FAILED_KEY) };
  notify();
};
const save = async (items) => {
  await set(KEY, items).catch(() => {});
  await publish();
};

const put = (item) =>
  api.put(
    `/attendance/sections/${item.sectionId}/${item.date}`,
    { rows: item.rows, clientMarkedAt: item.clientMarkedAt },
    { headers: item.schoolId ? { 'X-School-Id': item.schoolId } : {} },
  );

export async function enqueue(item) {
  const items = (await load()).filter((i) => !(i.sectionId === item.sectionId && i.date === item.date));
  await save([...items, item]);
}

let running = false;
export async function flush() {
  if (running || !navigator.onLine) return;
  running = true;
  try {
    let items = await load();
    while (items.length) {
      try {
        await put(items[0]);
      } catch (err) {
        if (TEMPORARY.has(err.code) || err.status >= 500) break;
        const failed = await load(FAILED_KEY);
        await set(FAILED_KEY, [...failed, { ...items[0], code: err.code }]).catch(() => {});
      }
      items = items.slice(1);
      await save(items);
    }
  } finally {
    running = false;
  }
}

export function startQueue() {
  publish();
  window.addEventListener('online', flush);
  setInterval(flush, 60000);
  flush();
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useQueue = () => useSyncExternalStore(subscribe, () => snapshot);
export const useQueueCount = () => useQueue().count;

export async function dismissFailures() {
  await del(FAILED_KEY).catch(() => {});
  await publish();
}

// Logout on a shared phone: forget queued and failed items of this user.
export async function clearQueue() {
  await Promise.all([del(KEY).catch(() => {}), del(FAILED_KEY).catch(() => {})]);
  await publish();
}
