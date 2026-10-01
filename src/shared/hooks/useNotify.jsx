import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NotifyContext = createContext(null);

// One app-wide snackbar. Errors stay until dismissed; success hides after 6 s.
export function NotifyProvider({ children }) {
  const { t } = useTranslation();
  const [msg, setMsg] = useState(null);
  const close = () => setMsg(null);
  const api = useMemo(
    () => ({
      success: (text) => setMsg({ text, severity: 'success' }),
      info: (text) => setMsg({ text, severity: 'info' }),
      error: (err) =>
        setMsg({
          text: typeof err === 'string' ? err : t(`errors.${err?.code || 'INTERNAL'}`, { ...err?.params, defaultValue: t('errors.INTERNAL') }),
          severity: 'error',
        }),
    }),
    [t],
  );
  return (
    <NotifyContext.Provider value={api}>
      {children}
      <Snackbar
        open={Boolean(msg)}
        onClose={(_, reason) => reason !== 'clickaway' && close()}
        autoHideDuration={msg?.severity === 'error' ? null : 6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {msg ? (
          <Alert severity={msg.severity} onClose={close} variant="filled" sx={{ fontSize: '1rem', alignItems: 'center' }}>
            {msg.text}
          </Alert>
        ) : (
          <span />
        )}
      </Snackbar>
    </NotifyContext.Provider>
  );
}

export const useNotify = () => useContext(NotifyContext);

// Wraps an async action: shows translated errors, returns undefined on failure.
export function useAction() {
  const notify = useNotify();
  return useCallback(
    async (fn, successText) => {
      try {
        const r = await fn();
        if (successText) notify.success(successText);
        return r ?? true;
      } catch (err) {
        notify.error(err);
        return undefined;
      }
    },
    [notify],
  );
}
