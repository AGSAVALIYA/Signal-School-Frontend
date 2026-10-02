import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotify } from '../../shared/hooks/useNotify';

// Shown once after creating a user or resetting a password. The message can be pasted into WhatsApp.
export default function TempPasswordDialog({ name, login, password, onClose }) {
  const { t } = useTranslation();
  const notify = useNotify();
  const message = t('staff.shareMessage', { name, login, password, url: window.location.origin });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      notify.success(t('staff.copied'));
    } catch {
      notify.info(message);
    }
  };
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{t('staff.tempPasswordTitle')}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2 }}>
          <Alert severity="warning">{t('staff.tempPasswordText')}</Alert>
          <Typography>
            {t('auth.identifier')}: <b style={{ userSelect: 'all' }}>{login}</b>
          </Typography>
          <Typography>
            {t('auth.password')}: <b style={{ userSelect: 'all', fontSize: '1.3rem', letterSpacing: 2 }}>{password}</b>
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button startIcon={<ContentCopyIcon />} onClick={copy}>
          {t('staff.copyMessage')}
        </Button>
        <Button variant="contained" onClick={onClose}>
          {t('common.done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
