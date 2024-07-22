import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, Snackbar, Alert, Tabs, Tab, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettingsOutlined, Person2Outlined } from '@mui/icons-material';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
};

const paperStyle = {
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: '#ffffff7d',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const inputStyle = {
  borderRadius: '16px',
  backgroundColor: 'white',
  marginBottom: '10px',
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState(1); // 0 for teacher, 1 for admin
  const [adminMode, setAdminMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminAction = () => {
    if (adminMode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = () => {
    const userType = selectedTab === 0 ? 'teacher' : 'admin';
    setLoading(true);
    const data = {
      email: username,
      password: password,
    }

    axios.post(`${process.env.REACT_APP_API_BACKEND}/${userType}/login`, data)
      .then((res) => {
        res.data.data.userType = userType;
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        localStorage.setItem('accessToken', res.data.accessToken);
        setSuccess(res.data.message);

        setTimeout(() => {
          setSuccess("");
          window.location.href = "/";
        }, 2000);
      })
      .catch((err) => {
        // setError(err.response.data.error);
        setLoading(false);
        if(err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        }
        else {
          setError("Server Error");
        }
        setTimeout(() => {
          setError("");
        }, 2000);
      });
  };

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
        res.data.data.userType = "admin";
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        localStorage.setItem('accessToken', res.data.accessToken);
        setTimeout(() => {
          setSuccess("");
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.error);
        setTimeout(() => {
          setError("");
        }, 2000);
      });
  };

  return (
    <Container maxWidth="sm" style={containerStyle}>
      {success && (
        <Alert onClose={() => setSuccess("")} severity="success" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert onClose={() => setError("")} severity="error" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} style={paperStyle}>
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

        {/* Tabs for selecting user type */}
        <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} sx={{ border: '3px solid colors.main', borderRadius: '16px' }}>
          <Tab label="Teacher" />
          <Tab label="Admin" />
        </Tabs>

        {/* Name field for admin in register mode */}
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

        {/* Email field for both login and register modes */}
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

        {/* Password field for both login and register modes */}
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

        {/* Login or Register button */}
        <Button variant="contained" color="colors" sx={{ color: "#fff" }} onClick={handleAdminAction} disabled={loading}>
          {/* {adminMode === 'login' ? 'Login' : 'Register'} */}
          {loading ? <CircularProgress size={24} /> : (adminMode === 'login' ? 'Login' : 'Register')}
        </Button>

        {/* Switch between login and register mode for admin */}
        {selectedTab === 1 && (
          <Typography variant="body2" sx={{ marginTop: '10px', cursor: 'pointer' }} onClick={() => setAdminMode(adminMode === 'login' ? 'register' : 'login')}>
            {adminMode === 'login' ? 'Need to register? Click here.' : 'Already registered? Click here to login.'}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default Login;
