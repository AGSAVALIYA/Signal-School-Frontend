import React, { useState, useEffect } from 'react';
import Login from './Login';
import TeacherMain from './TeacherSection/TeacherMain';
import AdminMain from './AdminSection/AdminMain';
import { Box, CircularProgress, Typography } from '@mui/material';
import './App.css';

/**
 * Main App Component
 * 
 * This is the root component of the Signal School Frontend application.
 * It handles user authentication and routing between different user interfaces:
 * - Admin interface for school administrators
 * - Teacher interface for teaching staff
 * - Login interface for unauthenticated users
 * 
 * The component manages user type detection and provides a loading screen
 * during initialization.
 */
const App = () => {
  // State to track the current user type (admin, teacher, or undefined)
  const [userType, setUserType] = useState("");
  
  // Get user information from localStorage (contains user type and other user data)
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // Loading state to show splash screen during initialization
  const [loading, setLoading] = useState(true);

  /**
   * Pre-load function to initialize the application
   * 
   * This function:
   * 1. Sets the user type from localStorage if user is authenticated
   * 2. Applies specific styling for teacher interface (adds padding to body)
   * 3. Sets a 1-second delay for better user experience with loading screen
   */
  const preLoad = () => {
    if (userInfo) {
      setUserType(userInfo.userType);
      const dbs = document.body.style;
      
      // Apply specific styling for teacher interface
      if (userInfo.userType === "teacher" && !loading) {
        // Add padding to accommodate teacher interface navigation
        dbs.paddingBottom = "65px";
        dbs.paddingLeft = "20px";
        dbs.paddingRight = "20px";
      }
    }
    
    // Set loading to false after 1 second to show the loading animation
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  // Effect hook to initialize the application when component mounts
  useEffect(() => {
    preLoad();
  }, [userInfo, userType])

  /**
   * LoadingScreen Component
   * 
   * Displays a branded loading screen with:
   * - School logo
   * - Circular progress indicator
   * - Centered layout covering the entire viewport
   */
  const LoadingScreen = () => {
    return (
      <Box sx={{ 
        position: "fixed", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        width: "100vw",
        backgroundColor:"colors.main" 
      }}>
        <div className='loading-div'>
          <div>
            {/* Display school logo */}
            <img src="/sslogo.png" alt="logo" className='loading-img' />
          </div>
          {/* Loading spinner */}
          <CircularProgress size={30} thickness={4} sx={{ color: "#fff" }} />
        </div>
      </Box>
    )
  }

  /**
   * Main render function
   * 
   * Conditionally renders different interfaces based on:
   * 1. Loading state - shows LoadingScreen
   * 2. User type - shows AdminMain, TeacherMain, or Login
   */
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
