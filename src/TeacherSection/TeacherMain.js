import React, { useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { CalendarMonth, MenuBook, Person, School } from '@mui/icons-material';
import { Link, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// Page component imports for teacher interface
import Schedule from './Pages/Schedule';
import Syllabus from './Pages/Syllabus';
import MyInfo from './Pages/MyInfo';
import Standard from './Pages/Class';
import AttendenceClassWise from './Pages/AttendenceClassWise';
import StudentList from './Pages/StudentsList';
import StudentDetail from './Pages/StudentDetail';
import LoginPage from './Pages/LoginPage';
import './Teacher.css';
import GTranslateComponent from '../GTranslateWraper';

/**
 * TeacherMain Component
 * 
 * This is the main layout component for the teacher interface of Signal School.
 * It provides a mobile-first design with bottom navigation for easy access to
 * core teacher functionalities.
 * 
 * Key Features:
 * - Bottom navigation bar with four main sections:
 *   1. Syllabus - View and manage curriculum content
 *   2. Class - View classes and student lists
 *   3. My Info - Teacher profile and personal information
 * - Responsive routing system for all teacher pages
 * - Conditional rendering of navigation (hidden on login page)
 * - Mobile-optimized interface with Material-UI components
 * 
 * Navigation Structure:
 * - /syllabus - Syllabus management page
 * - /class - Class overview page
 * - /class/:id - Student list for specific class
 * - /class/attendence/:id - Attendance tracking for specific class
 * - /student/:id - Individual student details page
 * - / - Teacher's personal information page (default)
 */
const TeacherMain = () => {
  // State for tracking the currently selected bottom navigation item
  const [value, setValue] = React.useState('recents');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current page is login to conditionally hide navigation
  const isLoginPage = location.pathname === '/login';

  /**
   * Handles bottom navigation item selection
   * 
   * @param {Event} event - Click event from navigation item
   * @param {string} newValue - New selected navigation value
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * Main render method
   * 
   * Renders the teacher interface with:
   * - Outlet for nested route rendering
   * - Conditional bottom navigation (hidden on login page)
   * - Route definitions for all teacher pages
   */
  return (
    <div>
      {/* Outlet renders the current route's component */}
      <Outlet />
      
      {/* Bottom navigation - only shown when not on login page */}
      {!isLoginPage &&
        <div style={{
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: "1000", 
          backgroundColor: "#fff",
          borderRadius: '20px 20px 0 0', 
          boxShadow: '0px 0px 10px 0px #0000001a'
        }}>
          <BottomNavigation 
            showLabels 
            value={value} 
            onChange={handleChange} 
            sx={{ height: "60px", borderRadius: "20px 20px 0 0" }}
          >
            {/* Syllabus Navigation Item */}
            <BottomNavigationAction
              label="Syllabus"
              value="Syllabus"
              icon={<MenuBook />}
              component={Link}
              to="/syllabus"
            />
            
            {/* Class Management Navigation Item */}
            <BottomNavigationAction
              label="Class"
              value="Class"
              icon={<School />}
              component={Link}
              to="/class"
            />
            
            {/* Teacher Profile Navigation Item */}
            <BottomNavigationAction
              label="My Info"
              value="My Info"
              icon={<Person />}
              component={Link}
              to="/"
            />
          </BottomNavigation>
        </div>
      }
      
      {/* Route definitions for all teacher interface pages */}
      <Routes>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/class" element={<Standard />} />
        <Route path='/class/attendence/:id' element={<AttendenceClassWise />} />
        <Route path="/class/:id" element={<StudentList />} />
        <Route path="/student/:id" element={<StudentDetail />} />
        <Route path="/" element={<MyInfo />} />
      </Routes>
    </div>
  );
}

export default TeacherMain;