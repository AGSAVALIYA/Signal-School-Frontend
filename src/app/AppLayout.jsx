import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import {
  Alert,
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  ButtonBase,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { useYear } from './YearContext';
import { can, isStaff } from '../shared/utils/permissions';
import { YearBanner } from '../shared/components/ui';
import { dismissFailures, useQueue } from '../features/attendance/offlineQueue';
import { fmtDate, initials } from '../shared/utils/format';
import useOnline from '../shared/hooks/useOnline';
import { useIcons } from '../theme/LookContext';

const DRAWER = 264;
const BAR = { xs: 56, sm: 64 };

// Navigation is data, filtered by permission: add a page by adding one entry. `group` orders the side menu.
const NAV = [
  { to: '/', key: 'today', icon: 'today', group: 'daily', show: (r) => !isStaff(r) && r !== 'clerk' },
  { to: '/dashboard', key: 'dashboard', icon: 'dashboard', group: 'daily', show: (r) => can(r, 'reports.view') && r !== 'teacher' },
  { to: '/attendance', key: 'attendance', icon: 'attendance', group: 'daily', show: () => true },
  { to: '/students', key: 'students', icon: 'students', group: 'daily', show: () => true },
  { to: '/syllabus', key: 'syllabus', icon: 'syllabus', group: 'daily', show: () => true },
  { to: '/marks', key: 'marks', icon: 'marks', group: 'daily', show: (r) => can(r, 'marks.write') },
  { to: '/classes', key: 'classesSubjects', icon: 'classes', group: 'setup', show: (r) => can(r, 'structure.manage') },
  { to: '/staff', key: 'staff', icon: 'staff', group: 'setup', show: (r) => can(r, 'users.manage') },
  { to: '/years', key: 'years', icon: 'years', group: 'setup', show: (r) => can(r, 'years.manage') },
  { to: '/holidays', key: 'holidays', icon: 'holidays', group: 'setup', show: (r) => can(r, 'structure.manage') },
  { to: '/school', key: 'school', icon: 'school', group: 'setup', show: (r) => can(r, 'school.manage') },
  { to: '/audit', key: 'audit', icon: 'audit', group: 'other', show: (r) => can(r, 'audit.view') },
  { to: '/me', key: 'me', icon: 'me', group: 'other', show: () => true },
];
const GROUPS = ['daily', 'setup', 'other'];
// Phones: the four things done every day sit in the bottom bar for every role; everything else is under "More".
const TABS = 4;

const isActive = (pathname, to) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`));

function YearSwitcher() {
  const { t } = useTranslation();
  const { years, selected, setYear } = useYear();
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  if (!years.length) return null;
  return (
    <TextField
      select
      size="small"
      fullWidth={false}
      label={phone ? undefined : t('year.label')}
      slotProps={{ htmlInput: { 'aria-label': t('year.label') }, inputLabel: { sx: { bgcolor: 'background.paper', px: 0.5, borderRadius: 1 } } }}
      value={selected?.id ?? ''}
      onChange={(e) => setYear(Number(e.target.value))}
      sx={{ minWidth: phone ? 0 : 150, flexShrink: 0, '& .MuiInputBase-root': { bgcolor: 'background.paper', color: 'text.primary' } }}
    >
      {years.map((y) => (
        <MenuItem key={y.id} value={y.id}>
          {phone ? y.name : `${y.name} · ${t(`year.status.${y.status}`)}`}
        </MenuItem>
      ))}
    </TextField>
  );
}

// Side-menu item styled by the look: a filled pill, a bar on the left, or a solid tab.
function navItemSx(theme) {
  const { nav } = theme.look;
  const p = theme.palette.primary;
  const base = { minHeight: 48, mx: 1, my: 0.25, borderRadius: nav === 'pill' ? 999 : `${Math.min(theme.look.radius, 8)}px` };
  const selected = {
    pill: { bgcolor: p.light, color: p.dark, '& .MuiListItemIcon-root': { color: p.main } },
    bar: {
      bgcolor: alpha(p.main, 0.08),
      color: p.dark,
      boxShadow: `inset 4px 0 0 ${theme.look.focus ? '#000' : p.main}`,
      '& .MuiListItemIcon-root': { color: p.main },
    },
    tab: { bgcolor: p.main, color: p.contrastText, '& .MuiListItemIcon-root': { color: p.contrastText } },
  }[nav];
  return { ...base, '&.Mui-selected, &.Mui-selected:hover': selected, '& .MuiListItemText-primary': { fontWeight: 600 } };
}

function SideMenu({ items, pathname, onPick }) {
  const { t } = useTranslation();
  const I = useIcons();
  const theme = useTheme();
  const sx = navItemSx(theme);
  return (
    <Box component="nav" aria-label={t('common.menu')} sx={{ py: 1 }}>
      {GROUPS.map((g) => {
        const list = items.filter((n) => n.group === g);
        if (!list.length) return null;
        return (
          <List
            key={g}
            component="div"
            dense
            subheader={
              <ListSubheader
                component="div"
                disableSticky
                sx={{
                  bgcolor: 'transparent',
                  lineHeight: '32px',
                  mt: 1,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontSize: '0.72rem',
                }}
              >
                {t(`nav.groups.${g}`)}
              </ListSubheader>
            }
          >
            {list.map((n) => {
              const Icon = I[n.icon];
              return (
                <ListItemButton key={n.to} component={Link} to={n.to} selected={isActive(pathname, n.to)} onClick={onPick} sx={sx}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={t(`nav.${n.key}`)} />
                </ListItemButton>
              );
            })}
          </List>
        );
      })}
    </Box>
  );
}

// "More" on phones: big tiles, two taps at most to any screen.
function MoreSheet({ open, onClose, items, pathname }) {
  const { t } = useTranslation();
  const I = useIcons();
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { borderTopLeftRadius: 20, borderTopRightRadius: 20, pb: 'calc(16px + env(safe-area-inset-bottom, 0px))' } } }}
    >
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', mt: 1.5, mb: 1 }} />
      <Typography variant="h3" component="h2" sx={{ px: 2.5, pb: 1 }}>
        {t('nav.more')}
      </Typography>
      <Box component="nav" aria-label={t('nav.more')} sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, px: 1.5 }}>
        {items.map((n) => {
          const Icon = I[n.icon];
          const on = isActive(pathname, n.to);
          return (
            <ButtonBase
              key={n.to}
              component={Link}
              to={n.to}
              onClick={onClose}
              aria-current={on ? 'page' : undefined}
              sx={{
                flexDirection: 'column',
                gap: 0.75,
                py: 1.5,
                px: 0.5,
                minHeight: 88,
                borderRadius: 3,
                textAlign: 'center',
                bgcolor: on ? 'primary.light' : 'transparent',
                color: on ? 'primary.dark' : 'text.primary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: on ? 'background.paper' : 'primary.light',
                  color: 'primary.main',
                }}
              >
                <Icon />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
                {t(`nav.${n.key}`)}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Drawer>
  );
}

export default function AppLayout() {
  const { t } = useTranslation();
  const theme = useTheme();
  const I = useIcons();
  const { look } = theme;
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const { role, school, me } = useAuth();
  const [more, setMore] = useState(false);
  const { pathname } = useLocation();
  const { count: pending, failed } = useQueue();
  const online = useOnline();
  const items = NAV.filter((n) => n.show(role));
  const tabs = items.filter((n) => n.group === 'daily').slice(0, TABS);
  const rest = items.filter((n) => !tabs.includes(n));
  const tabValue = tabs.find((n) => isActive(pathname, n.to))?.key || (rest.some((n) => isActive(pathname, n.to)) ? 'more' : false);
  const stripe = look.bar.stripe ? 4 : 0;
  const onBar = look.bar.fg;

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: look.bar.bg,
          color: onBar,
          borderBottom: look.bar.stripe ? 0 : 1,
          borderColor: 'divider',
          zIndex: (th) => th.zIndex.drawer + 1,
          '&::after': look.bar.stripe ? { content: '""', display: 'block', height: stripe, background: look.bar.stripe } : undefined,
        }}
      >
        <Toolbar sx={{ gap: 1.25, minHeight: BAR, px: { xs: 1.5, sm: 2 } }}>
          <Box
            component="img"
            src="/sslogo.png"
            alt=""
            sx={{ height: { xs: 36, sm: 44 }, width: { xs: 36, sm: 44 }, borderRadius: '50%', bgcolor: '#fff', p: '2px', flexShrink: 0, objectFit: 'contain' }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="div"
              noWrap
              sx={{ fontFamily: look.headingFont, fontWeight: 700, fontSize: { xs: '1.02rem', sm: '1.15rem' }, lineHeight: 1.2 }}
            >
              {school?.name}
            </Typography>
            <Typography component="div" noWrap variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.8 }}>
              {t('common.appName')}
            </Typography>
          </Box>
          {(!online || pending > 0) && (
            <I.offline sx={{ color: look.bar.bg === '#FFFFFF' ? 'warning.main' : 'inherit' }} titleAccess={t('attendance.pendingSync', { count: pending })} />
          )}
          <YearSwitcher />
          <IconButton component={Link} to="/me" aria-label={t('nav.me')} sx={{ p: 0.5, display: { xs: 'none', md: 'inline-flex' } }}>
            <Avatar src={me?.thumbUrl || undefined} alt="" sx={{ width: 36, height: 36, fontSize: '0.95rem', border: `2px solid ${alpha(onBar, 0.35)}` }}>
              {initials(me?.name || '')}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {desktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' },
          }}
        >
          <Toolbar sx={{ minHeight: BAR }} />
          <Box sx={{ height: stripe }} />
          <SideMenu items={items} pathname={pathname} />
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          px: { xs: 2, md: 4 },
          pt: { xs: `${BAR.xs + stripe + 16}px`, sm: `${BAR.sm + stripe + 24}px` },
          pb: desktop ? 5 : 'calc(96px + env(safe-area-inset-bottom, 0px))',
          maxWidth: 1240,
          mx: 'auto',
          width: '100%',
        }}
      >
        {pending > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('attendance.pendingSync', { count: pending })}
          </Alert>
        )}
        {failed.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={dismissFailures}>
            {t('attendance.syncFailed', { count: failed.length })}
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {failed.map((f) => (
                <li key={`${f.sectionId}-${f.date}`}>
                  {f.sectionName ? `${f.sectionName}, ` : ''}
                  {fmtDate(f.date)}: {t(`errors.${f.code}`, { defaultValue: t('errors.INTERNAL') })}
                </li>
              ))}
            </Box>
          </Alert>
        )}
        <YearBanner />
        <Outlet />
      </Box>

      {!desktop && (
        <>
          <BottomNavigation
            component="nav"
            aria-label={t('common.menu')}
            showLabels
            value={tabValue}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: 'calc(68px + env(safe-area-inset-bottom, 0px))',
              pb: 'env(safe-area-inset-bottom, 0px)',
              borderTop: look.surface === 'bold' ? '2px solid #000' : 1,
              borderColor: 'divider',
              boxShadow: look.surface === 'soft' ? `0 -4px 20px ${alpha(theme.palette.text.primary, 0.06)}` : 'none',
              zIndex: 10,
              '& .pill': { px: 2, py: 0.25, borderRadius: 999, display: 'grid', placeItems: 'center', transition: 'background-color .2s' },
              '& .Mui-selected .pill': { bgcolor: 'primary.light' },
            }}
          >
            {tabs.map((n) => {
              const Icon = I[n.icon];
              return (
                <BottomNavigationAction
                  key={n.key}
                  value={n.key}
                  label={t(`nav.${n.key}`)}
                  icon={
                    <span className="pill">
                      <Icon />
                    </span>
                  }
                  component={Link}
                  to={n.to}
                />
              );
            })}
            {rest.length > 0 && (
              <BottomNavigationAction
                value="more"
                label={t('nav.more')}
                aria-haspopup="dialog"
                icon={
                  <span className="pill">
                    <I.more />
                  </span>
                }
                onClick={() => setMore(true)}
              />
            )}
          </BottomNavigation>
          <MoreSheet open={more} onClose={() => setMore(false)} items={rest} pathname={pathname} />
        </>
      )}
    </Box>
  );
}
