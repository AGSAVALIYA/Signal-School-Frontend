import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import { LOOKS, lookOf } from './looks';
import { buildTheme } from './build';

// The school's look (colours, fonts, shapes, icons). Remembered on this device so the next visit (and the login
// screen) opens in it straight away; the school's saved choice from /me wins after login.
const KEY = 'ss.look';
const icons = {};
// If an icon set cannot load (first visit offline), icons render as blank space instead of breaking the page.
const Blank = () => <span style={{ display: 'inline-block', width: '1em', height: '1em' }} />;
const FALLBACK = new Proxy({}, { get: () => Blank });

const stored = () => {
  try {
    return lookOf(localStorage.getItem(KEY));
  } catch {
    return lookOf(null);
  }
};

// Loads a look's icon set (its own chunk). Resolves with the id to use.
export async function loadLook(id) {
  const look = lookOf(id);
  if (!icons[look]) icons[look] = (await LOOKS[look].icons()).default;
  return look;
}

// Started before the first render, like the language.
export const lookReady = loadLook(stored()).catch(() => {});

const LookContext = createContext({ look: lookOf(null), setLook: () => {} });

export function LookProvider({ children }) {
  const [look, setState] = useState(stored);
  // persist=false previews a look without remembering it (School settings).
  const setLook = useCallback(async (id, { persist = true } = {}) => {
    const next = await loadLook(id);
    if (persist) {
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage blocked: keep for this visit */
      }
    }
    setState(next);
  }, []);
  const theme = useMemo(() => buildTheme(look, icons[look] || FALLBACK), [look]);
  const value = useMemo(() => ({ look, setLook }), [look, setLook]);
  return (
    <LookContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LookContext.Provider>
  );
}

export const useLook = () => useContext(LookContext);

// The current look's icons by meaning: const I = useIcons(); <I.attendance />
export const useIcons = () => useTheme().look?.icons || FALLBACK;

// Icon sets of other looks (for the look picker).
export const loadIcons = async (id) => icons[await loadLook(id)];
