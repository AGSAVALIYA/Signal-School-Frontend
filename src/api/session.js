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

const emit = () => listeners.forEach((l) => l(state));

// Another tab logged in, refreshed tokens or logged out: follow it, so tabs never fight over refresh tokens.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    state = read();
    emit();
  });
}

export const session = {
  get: () => state,
  set(patch) {
    state = { ...state, ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: keep in memory */
    }
    emit();
  },
  clear(reason) {
    const { language } = state;
    state = { language, logoutReason: reason || null };
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    emit();
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
