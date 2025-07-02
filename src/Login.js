import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, Snackbar, Alert, Tabs, Tab, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettingsOutlined, Person2Outlined } from '@mui/icons-material';

/**
 * CSS-in-JS style objects for consistent styling across the login component
 */

// Container style for centering the login form on the page
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
};

// Paper component style with translucent background and rounded corners
const paperStyle = {
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: '#ffffff7d',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

// Input field styling with white background and rounded corners
const inputStyle = {
  borderRadius: '16px',
  backgroundColor: 'white',
  marginBottom: '10px',
};

/**
 * Login Component
 * 
 * Provides authentication interface for both teachers and administrators.
 * Features:
 * - Tab-based interface for user type selection (Teacher/Admin)
 * - Admin login and registration functionality
 * - Teacher login functionality
 * - Form validation and error handling
 * - Loading states during authentication
 * - Success/error message notifications
 */
function Login() {
  // Form input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Used for admin registration
  
  // UI state management
  const [success, setSuccess] = useState(""); // Success message display
  const [error, setError] = useState(""); // Error message display
  const [selectedTab, setSelectedTab] = useState(1); // 0 for teacher, 1 for admin
  const [adminMode, setAdminMode] = useState('login'); // 'login' or 'register' for admin
  const [loading, setLoading] = useState(false); // Loading state during API calls
  
  const navigate = useNavigate();

  /**
   * Handles admin actions based on current mode (login or register)
   */
  const handleAdminAction = () => {
    if (adminMode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  /**
   * Handles user login for both teachers and administrators
   * 
   * Process:
   * 1. Determines user type from selected tab
   * 2. Sends POST request to appropriate login endpoint
   * 3. Stores user info and access token in localStorage
   * 4. Redirects to main application on success
   * 5. Shows error message on failure
   */
  const handleLogin = () => {
    const userType = selectedTab === 0 ? 'teacher' : 'admin';
    setLoading(true);
    
    const data = {
      email: username,
      password: password,
    }

    axios.post(`${process.env.REACT_APP_API_BACKEND}/${userType}/login`, data)
      .then((res) => {
        // Add user type to response data and store in localStorage
        res.data.data.userType = userType;
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        localStorage.setItem('accessToken', res.data.accessToken);
        setSuccess(res.data.message);

        // Redirect after showing success message
        setTimeout(() => {
          setSuccess("");
          window.location.href = "/";
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        
        // Handle different error scenarios
        if(err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        }
        else {
          setError("Server Error");
        }
        
        // Clear error message after 2 seconds
        setTimeout(() => {
          setError("");
        }, 2000);
      });
  };

  /**
   * Handles administrator registration
   * 
   * Process:
   * 1. Sends POST request to admin registration endpoint
   * 2. Automatically logs in the new admin user
   * 3. Stores user info and access token
   * 4. Reloads the page to refresh the application state
   */
  const handleRegister = () => {
    const userType = 'admin';
    setLoading(true);
    
    const data = {
      email: username,
      password: password,
      name: name,
    }

    axios.post(`${process.env.REACT_APP_API_BACKEND}/${userType}/register`, data)
      .then((res) => {
        setSuccess(res.data.message);
        
        // Store user data and token for immediate login
        res.data.data.userType = "admin";
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        localStorage.setItem('accessToken', res.data.accessToken);
        
        // Reload page after showing success message
        setTimeout(() => {
          setSuccess("");
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.error);
        
        // Clear error message after 2 seconds
        setTimeout(() => {
          setError("");
        }, 2000);
      });
  };

  /**
   * Main render method
   * 
   * Renders the login interface with:
   * - Success/error alert messages positioned at the top
   * - Paper container with form fields
   * - Tab navigation for user type selection
   * - Conditional fields based on user type and mode
   * - Login/Register button with loading state
   * - Mode toggle for admin users
   */
  return (
    <Container maxWidth="sm" style={containerStyle}>
      {/* Success message alert - appears at top of screen */}
      {success && (
        <Alert onClose={() => setSuccess("")} severity="success" sx={{ 
          position: 'fixed', 
          top: '50px', 
          left: '0', 
          right: '0', 
          zIndex: '10000', 
          width: 'max-content', 
          margin: 'auto' 
        }}>
          {success}
        </Alert>
      )}

      {/* Error message alert - appears at top of screen */}
      {error && (
        <Alert onClose={() => setError("")} severity="error" sx={{ 
          position: 'fixed', 
          top: '50px', 
          left: '0', 
          right: '0', 
          zIndex: '10000', 
          width: 'max-content', 
          margin: 'auto' 
        }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} style={paperStyle}>
        {/* Dynamic header based on selected tab and mode */}
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selectedTab === 1 ? (
            <>
              {adminMode === 'login' ? 'Admin Login' : 'Admin Register'}
            </>
          ) : (
            <>
              Teacher Login
              <Person2Outlined />
            </>
          )}
        </Typography>

        {/* Tab navigation for user type selection */}
        <Tabs 
          value={selectedTab} 
          onChange={(event, newValue) => setSelectedTab(newValue)} 
          sx={{ border: '3px solid colors.main', borderRadius: '16px' }}
        >
          <Tab label="Teacher" />
          <Tab label="Admin" />
        </Tabs>

        {/* Name field - only shown for admin registration */}
        {selectedTab === 1 && adminMode === 'register' && (
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            variant='outlined'
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              style: inputStyle,
              autoComplete: 'off',
            }}
            InputLabelProps={{
              style: { color: 'black' },
            }}
          />
        )}

        {/* Email/Username field - shown for all login/register scenarios */}
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          variant='outlined'
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            style: inputStyle,
            autoComplete: 'off',
          }}
          InputLabelProps={{
            style: { color: 'black' },
          }}
        />

        {/* Password field - shown for all login/register scenarios */}
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            style: inputStyle,
          }}
          InputLabelProps={{
            style: { color: 'black' },
          }}
        />

        {/* Primary action button - login or register */}
        <Button 
          variant="contained" 
          color="colors" 
          sx={{ color: "#fff" }} 
          onClick={handleAdminAction} 
          disabled={loading}
        >
          {/* Show loading spinner or text based on loading state */}
          {loading ? <CircularProgress size={24} /> : (adminMode === 'login' ? 'Login' : 'Register')}
        </Button>

        {/* Mode toggle - only shown for admin tab */}
        {selectedTab === 1 && (
          <Typography 
            variant="body2" 
            sx={{ marginTop: '10px', cursor: 'pointer' }} 
            onClick={() => setAdminMode(adminMode === 'login' ? 'register' : 'login')}
          >
            {adminMode === 'login' ? 'Need to register? Click here.' : 'Already registered? Click here to login.'}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default Login;
