import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { useSession } from '../../api/hooks';
import LanguagePicker from '../../shared/components/LanguagePicker';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { logoutReason } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(identifier, password);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100%', display: 'grid', placeItems: 'center', px: 2, py: 4, bgcolor: 'background.default' }}>
      <Stack gap={3} sx={{ width: '100%', maxWidth: 420 }}>
        <Stack alignItems="center" gap={1}>
          <Box component="img" src="/sslogo.png" alt="" sx={{ height: 72 }} />
          <Typography variant="h1" textAlign="center">
            {t('common.appName')}
          </Typography>
        </Stack>
        <Box>
          <Typography textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
            {t('lang.choose')}
          </Typography>
          <LanguagePicker />
        </Box>
        <Card>
          <CardContent component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2, p: 3 }}>
            <Typography variant="h2">{t('auth.title')}</Typography>
            {logoutReason === 'SESSION_EXPIRED' && !error && <Alert severity="info">{t('auth.sessionEnded')}</Alert>}
            {error && <Alert severity="error">{t(`errors.${error.code}`, { defaultValue: t('errors.INTERNAL') })}</Alert>}
            <TextField
              label={t('auth.identifier')}
              helperText={t('auth.identifierHelp')}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              inputProps={{ autoCapitalize: 'none' }}
              required
              autoFocus
            />
            <TextField
              label={t('auth.password')}
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')} onClick={() => setShow((s) => !s)} edge="end">
                      {show ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" size="large" variant="contained" disabled={busy}>
              {busy ? t('auth.loggingIn') : t('auth.login')}
            </Button>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('auth.forgot')}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
