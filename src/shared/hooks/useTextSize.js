import { useSyncExternalStore } from 'react';

// Device setting (not personal data): survives logout. Scales every rem-based size in the app.
const KEY = 'ss.textSize';
export const TEXT_SIZES = { normal: 100, large: 115, xlarge: 130 };
const listeners = new Set();

const read = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v in TEXT_SIZES ? v : 'normal';
  } catch {
    return 'normal';
  }
};

let current = read();
const apply = () => {
  document.documentElement.style.fontSize = `${TEXT_SIZES[current]}%`;
};

export const applyTextSize = apply;

export function setTextSize(size) {
  if (!(size in TEXT_SIZES)) return;
  current = size;
  try {
    localStorage.setItem(KEY, size);
  } catch {
    /* storage blocked: keep for this visit */
  }
  apply();
  listeners.forEach((l) => l());
}

export default function useTextSize() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
}
