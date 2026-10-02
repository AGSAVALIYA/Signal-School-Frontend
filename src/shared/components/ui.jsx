import { Alert, Box, Button, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon, HelpOutlineOutlined as HelpOutlineIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useYear } from '../../app/YearContext';

export function PageHeader({ title, subtitle, back, actions, help }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
      {back && (
        <IconButton aria-label={t('common.back')} onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))} edge="start">
          <ArrowBackIcon />
        </IconButton>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h1" component="h1" sx={{ textWrap: 'balance' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {help && <HelpTip text={help} />}
      {actions && (
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}

export function HelpTip({ text }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip title={t('common.help')}>
        <IconButton aria-label={t('common.help')} onClick={() => setOpen((o) => !o)} color={open ? 'primary' : 'default'}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
      {open && (
        <Alert severity="info" onClose={() => setOpen(false)} sx={{ width: '100%', order: 10 }}>
          {text}
        </Alert>
      )}
    </>
  );
}

export const Loading = () => (
  <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
    <CircularProgress />
  </Box>
);

export function ErrorState({ error, onRetry }) {
  const { t } = useTranslation();
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" onClick={onRetry}>
            {t('common.retry')}
          </Button>
        )
      }
    >
      {t(`errors.${error?.code || 'INTERNAL'}`, { ...error?.params, defaultValue: t('errors.INTERNAL') })}
    </Alert>
  );
}

// Renders loading / error / content for a react-query result.
export function Query({ q, children }) {
  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState error={q.error} onRetry={q.refetch} />;
  return children(q.data);
}

export function EmptyState({ title, text, action }) {
  return (
    <Box sx={{ textAlign: 'center', py: 5, px: 2, color: 'text.secondary' }}>
      <Typography variant="h3" gutterBottom sx={{ color: 'text.primary' }}>
        {title}
      </Typography>
      {text && <Typography sx={{ mb: 2 }}>{text}</Typography>}
      {action}
    </Box>
  );
}

const STATUS_COLOR = { P: 'success', A: 'error', L: 'warning', LATE: 'info' };

// Status shown with colour AND a letter, so it never relies on colour alone.
export function StatusChip({ status, size = 'small' }) {
  const { t } = useTranslation();
  if (!status) return <Chip size={size} variant="outlined" label={t('attendance.notMarked')} />;
  return <Chip size={size} color={STATUS_COLOR[status]} label={`${t(`attendance.short.${status}`)} · ${t(`attendance.status.${status}`)}`} />;
}

export function YearBanner() {
  const { t } = useTranslation();
  const { isPast, selected, current, setYear } = useYear() || {};
  if (!isPast || !selected) return null;
  return (
    <Alert
      severity="warning"
      sx={{ mb: 2, position: 'sticky', top: 64, zIndex: 5 }}
      action={
        current && (
          <Button color="inherit" onClick={() => setYear(null)}>
            {t('year.backToCurrent', { name: current.name })}
          </Button>
        )
      }
    >
      {t('year.viewing', { name: selected.name })}
    </Alert>
  );
}

export function Stat({ label, value, tone }) {
  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="h2" component="p" sx={{ color: tone ? `${tone}.main` : 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
        {value ?? '–'}
      </Typography>
    </Box>
  );
}

export function ProgressBar({ percent }) {
  return (
    <Box
      sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover', overflow: 'hidden' }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <Box sx={{ width: `${percent}%`, height: '100%', bgcolor: percent >= 75 ? 'success.main' : 'primary.main' }} />
    </Box>
  );
}
