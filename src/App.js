import React, { useState, useEffect } from 'react';
import Login from './Login';
import TeacherMain from './TeacherSection/TeacherMain';
import AdminMain from './AdminSection/AdminMain';
import { Box, CircularProgress, Typography } from '@mui/material';
import './App.css';
//import logo.svg from './logo.svg';

const App = () => {
  const [userType, setUserType] = useState("");
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [loading, setLoading] = useState(true);



  const preLoad = () => {
    if (userInfo) {
      setUserType(userInfo.userType);
      const dbs = document.body.style;
      if (userInfo.userType === "teacher" && !loading) {
        //apply padding to the body 65px
        dbs.paddingBottom = "65px";
        dbs.paddingLeft = "20px";
        dbs.paddingRight = "20px";
      }

    }
    setTimeout(() => {
    setLoading(false);
    }, 1000);
  }

  useEffect(() => {

    preLoad();
  }
    , [userInfo, userType])

  
  const LoadingScreen = () => {
    return (
      <Box sx={{ position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw",backgroundColor:"colors.main" }}>
        {/* <CircularProgress   size={75} thickness={3} sx={{color: "#fff"}}/>} */}
        <div className='loading-div'>
          <div>
        {/* <img src="https://i.postimg.cc/YSBS2Nzp/logo.png" alt="logo" className='loading-img' /> */}
        <img src="/sslogo.png" alt="logo" className='loading-img' />
        </div>
        <CircularProgress size={30} thickness={4} sx={{ color: "#fff" }} />
        </div>
      </Box>
    )
  }

{/* <div class="gtranslate_wrapper"></div>
<script>window.gtranslateSettings = {"default_language":"en","languages":["en","hi","mr","gu"],"wrapper_selector":".gtranslate_wrapper"}</script>
<script src="https://cdn.gtranslate.net/widgets/latest/ln.js" defer></script> */}


  return (
    <div>
      {loading ? <LoadingScreen /> : (
        <>
          {
            userType === "admin" ? (
              <AdminMain />
            ) : userType === "teacher" ? (
              <TeacherMain />
            ) : (
              <Login />
            )
          }
        </>
      )}
    </div>
  );
}

export default App;
