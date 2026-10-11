import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { useSession } from '../../api/hooks';
import LanguagePicker from '../../shared/components/LanguagePicker';
import { useIcons } from '../../theme/LookContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const I = useIcons();
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
    <Box sx={{ minHeight: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Box
        sx={(th) => ({
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3,
          p: 6,
          color: th.look?.bar.fg === '#FFFFFF' ? '#fff' : th.palette.primary.contrastText,
          background: th.look?.bar.fg === '#FFFFFF' ? th.look.bar.bg : `linear-gradient(140deg, ${th.palette.primary.main}, ${th.palette.primary.dark})`,
          position: 'relative',
          overflow: 'hidden',
          '&::after': th.look?.bar.stripe
            ? { content: '""', position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: th.look.bar.stripe }
            : undefined,
        })}
      >
        <Box component="img" src="/sslogo.png" alt="" sx={{ width: 120, height: 120, borderRadius: '50%', bgcolor: '#fff', p: 1 }} />
        <Typography variant="h1" component="p" sx={{ fontSize: '2.4rem', color: 'inherit' }}>
          {t('common.appName')}
        </Typography>
        <Typography sx={{ fontSize: '1.2rem', maxWidth: 440, opacity: 0.92 }}>{t('auth.tagline')}</Typography>
      </Box>
      <Box sx={{ display: 'grid', placeItems: 'center', px: 2, py: 4 }}>
        <Stack sx={{ gap: 3, width: '100%', maxWidth: 420 }}>
          <Stack sx={{ gap: 1, alignItems: 'center', display: { md: 'none' } }}>
            <Box component="img" src="/sslogo.png" alt="" sx={{ height: 88, width: 88, borderRadius: '50%', bgcolor: '#fff', p: 0.5, boxShadow: 2 }} />
            <Typography variant="h1" sx={{ textAlign: 'center' }}>
              {t('common.appName')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>{t('auth.tagline')}</Typography>
          </Stack>
          <Box>
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}>{t('lang.choose')}</Typography>
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
                required
                autoFocus
                slotProps={{ htmlInput: { autoCapitalize: 'none' } }}
              />
              <TextField
                label={t('auth.password')}
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')} onClick={() => setShow((s) => !s)} edge="end">
                          {show ? <I.hide /> : <I.show />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button type="submit" size="large" variant="contained" disabled={busy}>
                {busy ? t('auth.loggingIn') : t('auth.login')}
              </Button>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {t('auth.forgot')}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
