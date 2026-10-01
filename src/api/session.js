// Session state readable outside React (API client) with a tiny subscribe API for React.
const KEY = 'ss.session';
const listeners = new Set();

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

let state = read();

export const session = {
  get: () => state,
  set(patch) {
    state = { ...state, ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: keep in memory */
    }
    listeners.forEach((l) => l(state));
  },
  clear(reason) {
    const { language } = state;
    state = { language, logoutReason: reason || null };
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l(state));
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
