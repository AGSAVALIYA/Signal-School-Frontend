import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChangePasswordForm from './ChangePasswordForm';
import LanguagePicker from '../../shared/components/LanguagePicker';
import { useAuth } from '../../app/AuthContext';

// Shown until a user with a temporary password chooses their own.
export default function FirstLoginPage() {
  const { t } = useTranslation();
  const { me, logout } = useAuth();
  return (
    <Box sx={{ minHeight: '100%', display: 'grid', placeItems: 'center', px: 2, py: 4 }}>
      <Stack gap={3} sx={{ width: '100%', maxWidth: 440 }}>
        <LanguagePicker />
        <Card>
          <CardContent sx={{ display: 'grid', gap: 2, p: 3 }}>
            <Typography variant="h2">{t('auth.firstLoginTitle', { name: me.name })}</Typography>
            <Typography color="text.secondary">{t('auth.firstLoginText')}</Typography>
            <ChangePasswordForm />
            <Button onClick={logout}>{t('auth.logout')}</Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
