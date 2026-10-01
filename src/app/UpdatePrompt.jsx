import { Alert, Button, Snackbar } from '@mui/material';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTranslation } from 'react-i18next';

// New version available → ask before reloading (never lose a half-filled form).
export default function UpdatePrompt() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  return (
    <Snackbar open={needRefresh} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert
        severity="info"
        action={
          <>
            <Button color="inherit" onClick={() => setNeedRefresh(false)}>
              {t('common.later')}
            </Button>
            <Button color="inherit" onClick={() => updateServiceWorker(true)}>
              {t('common.update')}
            </Button>
          </>
        }
      >
        {t('common.newVersion')}
      </Alert>
    </Snackbar>
  );
}
