import { Alert, Avatar, Box, Button, Card, Chip, CircularProgress, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useYear } from '../../app/YearContext';
import { useIcons } from '../../theme/LookContext';
import { initials } from '../utils/format';

// A look's icon in a tinted tile: the visual anchor of headers, stats and empty states.
export function IconTile({ name, tone = 'primary', size = 40, sx }) {
  const I = useIcons();
  const theme = useTheme();
  const Icon = I[name];
  const c = theme.palette[tone] || theme.palette.primary;
  const bold = theme.look?.surface === 'bold';
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: theme.look?.buttonRadius === 999 ? '30%' : `${Math.min(theme.look?.radius ?? 10, 12)}px`,
        bgcolor: bold ? '#fff' : alpha(c.main, 0.12),
        color: c.main,
        border: bold ? '2px solid #000' : 0,
        '& svg': { fontSize: size * 0.55 },
        ...sx,
      }}
    >
      {Icon && <Icon />}
    </Box>
  );
}

export function PageHeader({ title, subtitle, back, actions, help, icon }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const I = useIcons();
  return (
    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mb: { xs: 2, sm: 3 } }}>
      {back && (
        <IconButton aria-label={t('common.back')} onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))} edge="start">
          <I.back />
        </IconButton>
      )}
      {icon && !back && <IconTile name={icon} size={44} sx={{ display: { xs: 'none', sm: 'grid' } }} />}
      {/* Title takes the row; actions wrap underneath on narrow phones instead of overlapping it. */}
      <Box sx={{ flex: '1 1 220px', minWidth: 0 }}>
        <Typography variant="h1" component="h1" sx={{ textWrap: 'balance', overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {help && <HelpTip text={help} />}
      {actions && (
        <Stack
          direction="row"
          sx={{ gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' }, '& > .MuiButton-root': { flex: { xs: '1 1 140px', sm: '0 0 auto' } } }}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  );
}

export function HelpTip({ text }) {
  const { t } = useTranslation();
  const I = useIcons();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip title={t('common.help')}>
        <IconButton aria-label={t('common.help')} aria-expanded={open} onClick={() => setOpen((o) => !o)} color={open ? 'primary' : 'default'}>
          <I.help />
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

// Section heading inside a page, with an optional action on the right.
export function SectionTitle({ children, action, icon }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1.5 }}>
      {icon && <IconTile name={icon} size={32} />}
      <Typography variant="h2" sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Typography>
      {action}
    </Stack>
  );
}

export const Loading = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
      <CircularProgress aria-label={t('common.loading')} />
    </Box>
  );
};

// Placeholder rows while a list loads (feels faster than a spinner on slow networks).
export const ListSkeleton = ({ rows = 5 }) => (
  <Card>
    {Array.from({ length: rows }, (_, i) => (
      <Stack key={i} direction="row" sx={{ gap: 2, alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="45%" />
          <Skeleton width="30%" />
        </Box>
      </Stack>
    ))}
  </Card>
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
export function Query({ q, children, loading }) {
  if (q.isLoading) return loading || <Loading />;
  if (q.isError) return <ErrorState error={q.error} onRetry={q.refetch} />;
  return children(q.data);
}

export function EmptyState({ title, text, action, icon = 'info' }) {
  return (
    <Stack sx={{ alignItems: 'center', textAlign: 'center', py: 5, px: 2, color: 'text.secondary', gap: 1 }}>
      <IconTile name={icon} size={64} sx={{ mb: 1 }} />
      <Typography variant="h3" component="p" sx={{ color: 'text.primary' }}>
        {title}
      </Typography>
      {text && <Typography sx={{ maxWidth: 420 }}>{text}</Typography>}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Stack>
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
      sx={{ mb: 2, position: 'sticky', top: { xs: 64, sm: 72 }, zIndex: 5 }}
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

// A number with its meaning. `tone` colours the value (with the label it never relies on colour alone).
export function Stat({ label, value, tone, icon, hint }) {
  return (
    <Card sx={{ p: 2, minWidth: 0, display: 'flex', gap: 1.5, alignItems: 'center' }}>
      {icon && <IconTile name={icon} tone={tone || 'primary'} size={42} />}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.3 }}>
          {label}
        </Typography>
        <Typography
          variant="h2"
          component="p"
          sx={{ color: tone ? `${tone}.main` : 'text.primary', fontVariantNumeric: 'tabular-nums', fontSize: '1.55rem', lineHeight: 1.2 }}
        >
          {value ?? '–'}
        </Typography>
        {hint && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {hint}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

// Grid of Stat cards that fits 2 per row on a 360 px phone.
export const StatGrid = ({ children }) => (
  <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(auto-fit, minmax(170px, 1fr))' } }}>
    {children}
  </Box>
);

// Traffic-light tone for a percentage: green ≥ 75, amber ≥ 50, red below.
export const percentTone = (p) => (p >= 75 ? 'success' : p >= 50 ? 'warning' : 'error');

export function ProgressBar({ percent, label, tone }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover', overflow: 'hidden' }}
      role="progressbar"
      aria-label={label || t('common.percentDone', { percent })}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <Box
        sx={{
          width: `${percent}%`,
          height: '100%',
          borderRadius: 5,
          bgcolor: `${tone || (percent >= 75 ? 'success' : 'primary')}.main`,
          transition: 'width .4s',
        }}
      />
    </Box>
  );
}

// One child (or person) in a list: picture or initials, name and details, actions kept on the same line.
export function PersonRow({ name, detail, photo, to, actions, badge }) {
  return (
    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', py: 1.25, borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } }}>
      <Avatar src={photo || undefined} alt="" slotProps={{ img: { loading: 'lazy' } }} sx={{ width: 40, height: 40, fontSize: '0.95rem' }}>
        {initials(name)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component={to ? RouterLink : 'p'}
          to={to}
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            textDecoration: 'none',
            display: 'block',
            overflowWrap: 'anywhere',
            '&:hover': { textDecoration: to ? 'underline' : 'none' },
          }}
        >
          {name}
        </Typography>
        {(detail || badge) && (
          <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center', flexWrap: 'wrap', mt: 0.25 }}>
            {badge}
            <Typography variant="body2" sx={{ color: 'text.secondary', overflowWrap: 'anywhere' }}>
              {detail}
            </Typography>
          </Stack>
        )}
      </Box>
      {actions && <Box sx={{ flexShrink: 0, display: 'flex' }}>{actions}</Box>}
    </Stack>
  );
}
