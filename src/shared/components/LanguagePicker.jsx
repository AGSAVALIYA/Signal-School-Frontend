import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n';
import { api } from '../../api/client';
import { session } from '../../api/session';

// Big native-script buttons; saves to the profile when logged in.
export default function LanguagePicker({ size = 'medium' }) {
  const { i18n } = useTranslation();
  const change = (code) => {
    i18n.changeLanguage(code);
    if (session.get().accessToken) api.patch('/me', { preferredLanguage: code }).catch(() => {});
  };
  return (
    <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
      {LANGUAGES.map((l) => (
        <Button key={l.code} size={size} variant={i18n.language === l.code ? 'contained' : 'outlined'} onClick={() => change(l.code)} lang={l.code}>
          {l.native}
        </Button>
      ))}
    </Stack>
  );
}
