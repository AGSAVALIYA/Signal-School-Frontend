import { Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { api } from '../../api/client';
import LanguagePicker from '../../shared/components/LanguagePicker';
import PhotoPicker from '../../shared/components/PhotoPicker';
import ChangePasswordForm from '../auth/ChangePasswordForm';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import { PageHeader } from '../../shared/components/ui';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { me, school, logout, switchSchool, applyMe } = useAuth();
  const run = useAction();
  const confirm = useConfirm();
  const upload = (file) => {
    const fd = new FormData();
    fd.append('photo', file, 'photo.jpg');
    return run(async () => applyMe((await api.post('/me/photo', fd)).data), t('common.saved'));
  };
  return (
    <Box sx={{ maxWidth: 640 }}>
      <PageHeader title={t('nav.me')} />
      <Stack sx={{ gap: 2 }}>
        <Card>
          <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <PhotoPicker url={me.photoUrl} name={me.name} onUpload={upload} />
            <Box>
              <Typography variant="h2">{me.name}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{[me.phone, me.email].filter(Boolean).join(' · ')}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {school?.name} · {t(`staff.roles.${school?.role}`)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              {t('profile.language')}
            </Typography>
            <LanguagePicker />
          </CardContent>
        </Card>
        {me.schools.length > 1 && (
          <Card>
            <CardContent>
              <TextField select label={t('profile.school')} value={school?.id ?? ''} onChange={(e) => switchSchool(Number(e.target.value))}>
                {me.schools.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              {t('auth.changePassword')}
            </Typography>
            <ChangePasswordForm />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              {t('profile.help')}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{t('profile.helpText')}</Typography>
          </CardContent>
        </Card>
        <Button
          color="error"
          variant="outlined"
          size="large"
          startIcon={<LogoutIcon />}
          onClick={async () => (await confirm({ title: t('auth.logoutConfirm'), confirmLabel: t('auth.logout') })) && logout()}
        >
          {t('auth.logout')}
        </Button>
      </Stack>
    </Box>
  );
}
