import { useEffect, useState } from 'react';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { Call as CallIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import i18n, { loadLanguage } from '../../i18n';

// WhatsApp needs the country code; Indian 10-digit mobile numbers get +91.
export const waNumber = (phone = '') => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
};

// Big call / WhatsApp buttons. `message` is a translation key, written in the guardian's language when known.
export default function ContactButtons({ phone, language, message, params }) {
  const { t } = useTranslation();
  const lng = language || i18n.language;
  // The guardian's language may not be the one on screen: load its texts first (English until then).
  const [, setLoaded] = useState(null);
  useEffect(() => {
    if (message && phone)
      loadLanguage(lng).then(
        () => setLoaded(lng),
        () => {},
      );
  }, [lng, message, phone]);
  if (!phone) return null;
  const text = message ? i18n.getFixedT(lng)(message, params) : '';
  return (
    <Stack direction="row" sx={{ gap: 0.5 }}>
      <Tooltip title={t('contact.call')}>
        <IconButton component="a" href={`tel:${phone}`} aria-label={`${t('contact.call')} ${phone}`} color="primary">
          <CallIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('contact.whatsapp')}>
        <IconButton
          component="a"
          href={`https://wa.me/${waNumber(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t('contact.whatsapp')} ${phone}`}
          sx={{ color: '#1a7f4b' }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
