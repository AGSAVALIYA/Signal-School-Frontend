import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Alert,
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Badge as BadgeIcon,
  CalendarMonth as CalendarMonthIcon,
  Class as ClassIcon,
  CloudOff as CloudOffIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  FactCheck as FactCheckIcon,
  Grading as GradingIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { useYear } from './YearContext';
import { can, isStaff } from '../shared/utils/permissions';
import { YearBanner } from '../shared/components/ui';
import { useQueueCount } from '../features/attendance/offlineQueue';
import useOnline from '../shared/hooks/useOnline';

const DRAWER = 248;

// Navigation is data, filtered by permission: add a page by adding one entry.
const NAV = [
  { to: '/', key: 'today', icon: HomeIcon, show: (r) => !isStaff(r) },
  { to: '/dashboard', key: 'dashboard', icon: DashboardIcon, show: (r) => can(r, 'reports.view') && r !== 'teacher' },
  { to: '/attendance', key: 'attendance', icon: FactCheckIcon, show: () => true },
  { to: '/students', key: 'students', icon: PeopleIcon, show: () => true },
  { to: '/syllabus', key: 'syllabus', icon: MenuBookIcon, show: () => true },
  { to: '/marks', key: 'marks', icon: GradingIcon, show: (r) => can(r, 'marks.write') },
  { to: '/classes', key: 'classesSubjects', icon: ClassIcon, show: (r) => can(r, 'structure.manage') },
  { to: '/staff', key: 'staff', icon: BadgeIcon, show: (r) => can(r, 'users.manage') },
  { to: '/years', key: 'years', icon: CalendarMonthIcon, show: (r) => can(r, 'years.manage') },
  { to: '/holidays', key: 'holidays', icon: EventIcon, show: (r) => can(r, 'structure.manage') },
  { to: '/school', key: 'school', icon: SettingsIcon, show: (r) => can(r, 'school.manage') },
  { to: '/audit', key: 'audit', icon: HistoryIcon, show: (r) => can(r, 'audit.view') },
  { to: '/me', key: 'me', icon: PersonIcon, show: () => true },
];
const TEACHER_TABS = ['today', 'attendance', 'syllabus', 'me'];

function YearSwitcher() {
  const { t } = useTranslation();
  const { years, selected, setYear } = useYear();
  if (!years.length) return null;
  return (
    <TextField
      select
      size="small"
      fullWidth={false}
      label={t('year.label')}
      value={selected?.id ?? ''}
      onChange={(e) => setYear(Number(e.target.value))}
      sx={{ minWidth: 150, '& .MuiInputBase-root': { bgcolor: 'background.paper' } }}
    >
      {years.map((y) => (
        <MenuItem key={y.id} value={y.id}>
          {y.name} · {t(`year.status.${y.status}`)}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default function AppLayout() {
  const { t } = useTranslation();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const { role, school } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const pending = useQueueCount();
  const online = useOnline();
  const items = NAV.filter((n) => n.show(role));
  const active = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));
  const teacherMobile = !desktop && role === 'teacher';

  const menu = (
    <List sx={{ py: 1 }}>
      {items.map((n) => (
        <ListItemButton
          key={n.to}
          component={Link}
          to={n.to}
          selected={active(n.to)}
          onClick={() => setOpen(false)}
          sx={{ minHeight: 48, mx: 1, borderRadius: 2 }}
        >
          <ListItemIcon>
            <n.icon />
          </ListItemIcon>
          <ListItemText primary={t(`nav.${n.key}`)} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', zIndex: (th) => th.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          {!desktop && !teacherMobile && (
            <IconButton edge="start" aria-label={t('common.menu')} onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Box component="img" src="/sslogo.png" alt="" sx={{ height: 32, display: { xs: 'none', sm: 'block' } }} />
          <Typography variant="h3" component="div" noWrap sx={{ flex: 1, minWidth: 0 }}>
            {school?.name}
          </Typography>
          {(!online || pending > 0) && <CloudOffIcon color="warning" titleAccess={t('attendance.pendingSync', { count: pending })} />}
          <YearSwitcher />
        </Toolbar>
      </AppBar>

      {!teacherMobile && (
        <Drawer
          variant={desktop ? 'permanent' : 'temporary'}
          open={desktop || open}
          onClose={() => setOpen(false)}
          sx={{ width: desktop ? DRAWER : 0, '& .MuiDrawer-paper': { width: DRAWER, boxSizing: 'border-box' } }}
        >
          <Toolbar />
          <Divider />
          {menu}
        </Drawer>
      )}

      <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, md: 3 }, pt: 10, pb: teacherMobile ? 11 : 4, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {pending > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('attendance.pendingSync', { count: pending })}
          </Alert>
        )}
        <YearBanner />
        <Outlet />
      </Box>

      {teacherMobile && (
        <BottomNavigation
          showLabels
          value={TEACHER_TABS.find((k) => active(NAV.find((n) => n.key === k).to)) || false}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            pb: 'env(safe-area-inset-bottom, 0px)',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 10,
          }}
        >
          {TEACHER_TABS.map((k) => {
            const n = NAV.find((x) => x.key === k);
            return <BottomNavigationAction key={k} value={k} label={t(`nav.${k}`)} icon={<n.icon />} component={Link} to={n.to} />;
          })}
        </BottomNavigation>
      )}
    </Box>
  );
}
