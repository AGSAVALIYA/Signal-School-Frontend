import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/client';
import { session } from '../../api/session';
import { Field, applyServerErrors } from '../../shared/components/fields';
import { useNotify } from '../../shared/hooks/useNotify';
import { useAuth } from '../../app/AuthContext';

const schema = z
  .object({ currentPassword: z.string().min(1, 'REQUIRED'), newPassword: z.string().min(8, 'MIN_8'), confirm: z.string() })
  .refine((v) => v.newPassword === v.confirm, { path: ['confirm'], message: 'PASSWORD_MISMATCH' });

export default function ChangePasswordForm({ onDone }) {
  const { t } = useTranslation();
  const notify = useNotify();
  const { refreshMe } = useAuth();
  const { control, handleSubmit, setError, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
  });
  const submit = handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      const { data } = await api.post('/me/password', { currentPassword, newPassword });
      session.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      await refreshMe();
      notify.success(t('auth.passwordChanged'));
      onDone?.();
    } catch (err) {
      applyServerErrors(err, setError);
      notify.error(err);
    }
  });
  return (
    <Stack component="form" onSubmit={submit} sx={{ gap: 2 }}>
      <Field control={control} name="currentPassword" type="password" label={t('auth.currentPassword')} autoComplete="current-password" />
      <Field
        control={control}
        name="newPassword"
        type="password"
        label={t('auth.newPassword')}
        helperText={t('auth.newPasswordHelp')}
        autoComplete="new-password"
      />
      <Field control={control} name="confirm" type="password" label={t('auth.confirmPassword')} autoComplete="new-password" />
      <Button type="submit" variant="contained" size="large" disabled={formState.isSubmitting}>
        {t('auth.changePassword')}
      </Button>
    </Stack>
  );
}
