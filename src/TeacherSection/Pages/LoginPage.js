import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * CSS-in-JS style objects for consistent styling
 */

// Container styling for centering the login form
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
};

// Paper component styling with translucent background
const paperStyle = {
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: '#ffffff7d',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

// Input field styling with rounded corners and white background
const inputStyle = {
  borderRadius: '16px',
  backgroundColor: 'white',
  marginBottom: '10px',
};

/**
 * LoginPage Component (Teacher Section)
 * 
 * A dedicated login page component specifically for teachers in the teacher section.
 * This appears to be an alternative to the main Login component that handles
 * both admin and teacher authentication.
 * 
 * Features:
 * - Teacher-specific login interface
 * - Email and password authentication
 * - Success and error message handling
 * - Automatic redirection to schedule page after successful login
 * - Consistent styling with the main application theme
 * - Session management through localStorage
 * 
 * This component is similar to the main Login component but is specifically
 * designed for the teacher workflow and redirects to teacher-specific pages.
 */
function LoginPage() {
  // Form state management
  const [username, setUsername] = useState(''); // Teacher email/username
  const [password, setPassword] = useState(''); // Teacher password
  
  // UI state for user feedback
  const [success, setSuccess] = useState(""); // Success message display
  const [error, setError] = useState("");     // Error message display
  
  const navigate = useNavigate();

  /**
   * Handles teacher login authentication
   * 
   * Sends POST request to teacher login endpoint with credentials.
   * On success:
   * - Stores user info in localStorage
   * - Shows success message
   * - Redirects to teacher schedule page
   * On error:
   * - Displays error message from server
   * - Clears error after 2 seconds
   */
  const handleLogin = () => {
    // Prepare login data
    const data = {
      email: username,
      password: password
    }
    
    // Send login request to teacher endpoint
    axios.post(`${process.env.REACT_APP_API_BACKEND}/teacher/login`, data)
      .then((res) => {
        // Store teacher information in localStorage
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        setSuccess(res.data.message);

        // Redirect to teacher schedule after showing success message
        setTimeout(() => {
          setSuccess("");
          navigate('/schedule');
        }, 2000);
      })
      .catch((err) => {
        setError(err.response.data.error);
        
        // Clear error message after 2 seconds
        setTimeout(() => {
          setError("");
        }, 2000);
      });
  };

  /**
   * Renders the teacher login interface
   */
  return (
    <Container maxWidth="sm" style={containerStyle}>
      {/* Success message alert */}
      {success &&
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
      }

      {/* Error message alert */}
      {error &&
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
      }

      {/* Login form container */}
      <Paper elevation={3} style={paperStyle}>
        <Typography variant="h4">Login</Typography>
        
        {/* Username/Email input field */}
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
        
        {/* Password input field */}
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
        
        {/* Login button */}
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginPage;
