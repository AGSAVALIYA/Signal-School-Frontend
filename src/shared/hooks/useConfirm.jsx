import { createContext, useCallback, useContext, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ConfirmContext = createContext(null);

// confirm({ title, text, confirmLabel, danger }) → Promise<boolean>
export function ConfirmProvider({ children }) {
  const { t } = useTranslation();
  const [state, setState] = useState(null);
  const confirm = useCallback((opts) => new Promise((resolve) => setState({ ...opts, resolve })), []);
  const done = (value) => {
    state?.resolve(value);
    setState(null);
  };
  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={Boolean(state)} onClose={() => done(false)} maxWidth="xs">
        <DialogTitle>{state?.title}</DialogTitle>
        {state?.text && (
          <DialogContent>
            <DialogContentText>{state.text}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => done(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color={state?.danger ? 'error' : 'primary'} onClick={() => done(true)}>
            {state?.confirmLabel || t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
