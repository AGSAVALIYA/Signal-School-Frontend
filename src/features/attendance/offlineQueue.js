import { get, set } from 'idb-keyval';
import { useSyncExternalStore } from 'react';
import { api } from '../../api/client';

// Attendance saved without network waits here (IndexedDB) and uploads when the phone is online again.
const KEY = 'attendance-queue';
const listeners = new Set();
let count = 0;
let failed = [];

const notify = () => listeners.forEach((l) => l());
const load = async () => (await get(KEY).catch(() => [])) || [];
const save = async (items) => {
  await set(KEY, items).catch(() => {});
  count = items.length;
  notify();
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
        if (err.code === 'NETWORK') break;
        failed = [...failed, { ...items[0], code: err.code }];
      }
      items = items.slice(1);
      await save(items);
    }
  } finally {
    running = false;
  }
}

export function startQueue() {
  load().then((items) => {
    count = items.length;
    notify();
  });
  window.addEventListener('online', flush);
  setInterval(flush, 60000);
  flush();
}

export const useQueueCount = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => count,
  );

export const takeFailures = () => {
  const f = failed;
  failed = [];
  return f;
};
