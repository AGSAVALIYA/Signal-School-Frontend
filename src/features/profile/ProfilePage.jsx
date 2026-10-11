import { Link as RouterLink } from 'react-router';
import { Box, Button, Card, CardContent, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { api } from '../../api/client';
import LanguagePicker from '../../shared/components/LanguagePicker';
import PhotoPicker from '../../shared/components/PhotoPicker';
import ChangePasswordForm from '../auth/ChangePasswordForm';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import { IconTile, PageHeader } from '../../shared/components/ui';
import { can } from '../../shared/utils/permissions';
import { useQueueCount } from '../attendance/offlineQueue';
import useTextSize, { setTextSize, TEXT_SIZES } from '../../shared/hooks/useTextSize';
import { useIcons } from '../../theme/LookContext';

// A settings card with the look's icon beside its title.
function Setting({ icon, title, children }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', mb: 1.5 }}>
          <IconTile name={icon} size={36} />
          <Typography variant="h3" component="h2">
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const I = useIcons();
  const { me, school, logout, switchSchool, applyMe } = useAuth();
  const pending = useQueueCount();
  const textSize = useTextSize();
  const run = useAction();
  const confirm = useConfirm();
  const upload = (file) => {
    const fd = new FormData();
    fd.append('photo', file, 'photo.jpg');
    return run(async () => applyMe((await api.post('/me/photo', fd)).data), t('common.saved'));
  };
  return (
    <Box sx={{ maxWidth: 680, mx: 'auto' }}>
      <PageHeader title={t('nav.me')} icon="me" />
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
        <Setting icon="language" title={t('profile.language')}>
          <LanguagePicker />
        </Setting>
        <Setting icon="textSize" title={t('profile.textSize')}>
          <ToggleButtonGroup exclusive fullWidth value={textSize} onChange={(_, v) => v && setTextSize(v)} aria-label={t('profile.textSize')}>
            {Object.keys(TEXT_SIZES).map((k) => (
              <ToggleButton key={k} value={k} sx={{ flexDirection: 'column', gap: 0.5, textTransform: 'none', py: 1 }}>
                {/* A sample letter at that size (scaled from 1rem, so it previews the choice) */}
                <Box component="span" aria-hidden sx={{ fontSize: `${(TEXT_SIZES[k] / 100) * 1.25}rem`, lineHeight: 1, fontWeight: 700 }}>
                  {t('profile.textSample')}
                </Box>
                <Box component="span" sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                  {t(`profile.textSizes.${k}`)}
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Setting>
        {can(school?.role, 'school.manage') && (
          <Setting icon="look" title={t('school.tabs.look')}>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{t('look.profileHint')}</Typography>
            <Button variant="outlined" component={RouterLink} to="/school?tab=look">
              {t('look.choose')}
            </Button>
          </Setting>
        )}
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
        <Setting icon="lock" title={t('auth.changePassword')}>
          <ChangePasswordForm />
        </Setting>
        <Setting icon="help" title={t('profile.help')}>
          <Typography sx={{ color: 'text.secondary' }}>{t('profile.helpText')}</Typography>
        </Setting>
        <Button
          color="error"
          variant="outlined"
          size="large"
          startIcon={<I.logout />}
          onClick={async () =>
            (await confirm({
              title: t('auth.logoutConfirm'),
              text: pending ? t('auth.logoutPending', { count: pending }) : null,
              danger: Boolean(pending),
              confirmLabel: t('auth.logout'),
            })) && logout()
          }
        >
          {t('auth.logout')}
        </Button>
      </Stack>
    </Box>
  );
}
