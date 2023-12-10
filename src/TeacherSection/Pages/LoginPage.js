import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your login logic here
    const data = {
      email: username,
      password: password
    }
    axios.post(`${process.env.REACT_APP_API_BACKEND}/teacher/login`,
      data
    ).then((res) => {
      localStorage.setItem('userInfo', JSON.stringify(res.data.data));
      setSuccess(res.data.message);

      setTimeout(() => {
        setSuccess("");
        navigate('/schedule');
      }, 2000);
    }).catch((err) => {
      setError(err.response.data.error);
      setTimeout(() => {
        setError("");
      }, 2000);
    });

  };

  return (
    <Container maxWidth="sm" style={containerStyle}>
      {
        success &&
        <Alert onClose={() => setSuccess("")} severity="success" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
          {success}
        </Alert>
      }

      {error &&
        <Alert onClose={() => setError("")} severity="error" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000',  width: 'max-content', margin: 'auto' }}>
          {error}
        </Alert>
      }

      <Paper elevation={3} style={paperStyle}>
        <Typography variant="h4">Login</Typography>
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
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginPage;
