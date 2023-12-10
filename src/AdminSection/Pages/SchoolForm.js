import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SchoolForm = () => {
  const [school, setSchool] = useState({
    name: '',
    address: '',
    contactNumber: '',
    location: '',
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const accessToken = localStorage.getItem('accessToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();




  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchool((prevSchool) => ({
      ...prevSchool,
      [name]: value,
    }));
  };

  const headers = {
    'Authorization': `Bearer ${accessToken}`
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_BACKEND}/school/create`, school, { headers })
      .then((res) => {
          setSuccess(res.data.message);
          setTimeout(() => {
            setSuccess("");
            localStorage.setItem('userInfo', JSON.stringify(res.data.data));
            navigate("/school");
          }, 1000);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setTimeout(() => {
          setError("");
        }, 2000);
      });

    console.log('Submitted:', school);
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: "transparentBG.bgcolor", borderRadius: '20px', padding: '0 5px 20px 5px', width: '100%', display: 'flex', flexDirection: 'column' }}>
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

      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: "colors.main" }}>Create School</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="School Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            name="name"
            value={school.name}
            onChange={handleChange}
            size='small'
          />
          <TextField
            label="Address"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            name="address"
            value={school.address}
            onChange={handleChange}
            size='small'
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            name="contactNumber"
            value={school.contactNumber}
            onChange={handleChange}
            size='small'
          />
          <TextField
            label="Location"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            name="location"
            value={school.location}
            onChange={handleChange}
            size='small'
          />
          <Button type="submit" variant="contained" color="colors" fullWidth sx={{ marginTop: 2, color: "#fff" }}>
            Create School
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SchoolForm;
