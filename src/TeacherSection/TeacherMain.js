import React, { useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { CalendarMonth, MenuBook, Person, School } from '@mui/icons-material';
import { Link, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
// import Schedule from './Pages/Schedule';
// import Syllabus from './Pages/Syllabus';
// import MyInfo from './Pages/MyInfo';
// import Standard from './Pages/Class';
// import AttendenceClassWise from './Pages/AttendenceClassWise';
// import StudentList from './Pages/StudentsList';
// import StudentDetail from './Pages/StudentDetail';
// import LoginPage from './Pages/LoginPage';
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


const TeacherMain = () => {
  const [value, setValue] = React.useState('recents');
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/login';

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

    


  return (
    // https://i.postimg.cc/L55296qv/Untitled-design.png
    <div>

      <Outlet />
      {!isLoginPage &&
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: "1000", backgroundColor: "#fff",
          borderRadius: '20px 20px 0 0', boxShadow: '0px 0px 10px 0px #0000001a'
        }}>
          <BottomNavigation showLabels value={value} onChange={handleChange} sx={{ height: "60px", borderRadius: "20px 20px 0 0" }}>
            {/* <BottomNavigationAction
              label="Schedule"
              value="schedule"
              icon={<CalendarMonth />}
              //go to schedule page
              to="/schedule"
              component={Link}
            /> */}
            <BottomNavigationAction
              label="Syllabus"
              value="Syllabus"
              icon={<MenuBook />}
              component={Link}
              to="/syllabus"
            />
            <BottomNavigationAction
              label="Class"
              value="Class"
              icon={<School />}
              component={Link}
              to="/class"
            />
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