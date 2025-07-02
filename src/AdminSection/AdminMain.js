import  React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/system';
import Box from '@mui/system/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AccountTreeOutlined, Dashboard, DashboardOutlined, EmojiPeopleOutlined, FactCheckOutlined, ImportContacts, ImportContactsOutlined, MenuBookOutlined, PeopleOutline, SchoolOutlined, SettingsOutlined } from '@mui/icons-material';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// Page component imports
import Home from './Pages/Home';
import StudentsList from './Pages/StudentsList';
import SchoolList from './Pages/SchoolList';
import StudentInfo from './Pages/StudentInfo';
import TeachersList from './Pages/TeachersList';
import SchoolInfo from './Pages/SchoolInfo';
import AccountMenu from './Components/AccountMenu';
import OrganizationForm from './Pages/OrganizationForm';
import PreLoad from './PreLoad';
import SchoolForm from './Pages/SchoolForm';
import Settings from './Pages/Settings';
import Attendance from './Pages/Attendance';
import SyllabusForm from './Pages/SyllabusForm';
import TeacherDetailPage from './Components/Teacher/TeacherDetails';

/**
 * AdminMain Component
 * 
 * This is the main layout component for the administrative interface of Signal School.
 * It provides a responsive sidebar navigation with drawer functionality and manages
 * routing for all admin-related pages.
 * 
 * Features:
 * - Collapsible sidebar navigation
 * - Route protection and redirection based on user setup status
 * - Responsive design with Material-UI drawer components
 * - Account menu integration
 * - Pre-loading functionality
 * 
 * The component handles the overall admin interface layout including:
 * - Organization creation flow
 * - School management
 * - Student and teacher management
 * - Settings and configuration
 * - Attendance tracking
 * - Syllabus management
 */

// Constants for drawer width
const drawerWidth = 200;

/**
 * Style mixins for drawer animations
 * These functions provide smooth transitions when opening/closing the sidebar
 */

// Styling for opened drawer state
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// Styling for closed drawer state
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function AdminMain() {
  const theme = useTheme();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const path = location.pathname;
 
  useEffect(() => {
    if (userInfo.OrganizationId === null) {
      navigate('/create-organization');
    }
    if (userInfo.OrganizationId !== null && userInfo.currentSchool === null) {
      navigate('/create-school');
    }
  }
    , [path])





  return (
    <Box sx={{ display: 'flex' }}>
      <PreLoad />
      <CssBaseline />
      <AppBar 
        open={open}
        elevation={0}
        sx={{
          backgroundColor: 'transparentBG.bgcolor',
          borderRadius: '20px',
          position: 'fixed',
          left: "5%",
          top: "5px",
          right: "50%",
          width: "90%",
          borderColor: 'colors.main',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <Toolbar sx={{color: 'colors.main'}}>
          {
            open ?
              <IconButton
                color="primary"
                aria-label="close drawer"
                onClick={handleDrawerClose}
                edge="start"
                sx={{ marginRight: 5, color: 'inherit' }}
              >
                <ChevronLeftIcon />
              </IconButton>
              :
              <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ marginRight: 5, color: 'inherit' }}
              >
                <MenuIcon />
              </IconButton>
          }
          
          <Typography variant="h6" noWrap component="div" color={'colors.main'} sx={{ flexGrow: 1, fontSize: "1.5rem" }}>
            {userInfo.Organization ? userInfo.Organization.name : "No Organization"} - {userInfo.currentSchool ? userInfo.currentSchool.name : "No School"}
          </Typography>
          <AccountMenu />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: 'transparentBG.bgcolor',
            borderRadius: '20px',
            position: "fixed",
            top: "100px",
            marginLeft: '10px',
            zIndex: '1000',
            height: 'max-content',
          },
        }}
      >
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/')}>
              <ListItemButton 
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/' && 'colors.main',  
                  color: location.pathname === '/' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  },
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/school')}>
              <ListItemButton 
                 sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/school' && 'colors.main',  
                  color: location.pathname === '/school' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  },
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <SchoolOutlined />
                </ListItemIcon>
                <ListItemText primary="School" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/school-list')}>
              <ListItemButton 
                 sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/school-list' && 'colors.main',  
                  color: location.pathname === '/school-list' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  },
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <AccountTreeOutlined />
                </ListItemIcon>
                <ListItemText primary="Switch School" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/settings')}>
              <ListItemButton 
                 sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/settings' && 'colors.main',  
                  color: location.pathname === '/settings' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  },
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <SettingsOutlined />
                </ListItemIcon>
                <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/syllabus')}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/syllabus' && 'colors.main',
                  color: location.pathname === '/syllabus' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <MenuBookOutlined />
                </ListItemIcon>
                <ListItemText primary="Syllabus" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

    
        </List>
        <Divider />
        <List>
        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/teachers')}>
              <ListItemButton 
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/teachers' && 'colors.main',  
                  color: location.pathname === '/teachers' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  },
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <EmojiPeopleOutlined />
                </ListItemIcon>
                <ListItemText primary="Teachers" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/students')}>
              <ListItemButton 
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/students' && 'colors.main',  
                  color: location.pathname === '/students' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  }
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <PeopleOutline />
                </ListItemIcon>
                <ListItemText primary="Students" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/attendence')}>
              <ListItemButton 
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: location.pathname === '/attendence' && 'colors.main',  
                  color: location.pathname === '/attendence' ? 'white' : 'colors.main',
                  '&:hover': {
                    backgroundColor: 'colors.main',
                    color: 'white',
                  }
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: "inherit",
                  }}
                >
                  <FactCheckOutlined />
                </ListItemIcon>
                <ListItemText primary="Attendence" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/school" element={<SchoolInfo/>} />
            <Route path="/school-list" element={<SchoolList/>} />
            <Route path="/students" element={<StudentsList/>} />
            <Route path="/students/:id" element={<StudentInfo/>} />
            <Route path="/teachers" element={<TeachersList/>} />
            <Route path="/teachers/:id" element={<TeacherDetailPage/>} />
            <Route path='/create-organization' element={<OrganizationForm/>} />
            <Route path="/create-school" element={<SchoolForm/>} />
            <Route path='/settings' element={<Settings />} />
            <Route path="/attendence" element={<Attendance />} />
            <Route path="/syllabus" element={<SyllabusForm />} />
        </Routes>
      </Box>
    </Box>
  );
}