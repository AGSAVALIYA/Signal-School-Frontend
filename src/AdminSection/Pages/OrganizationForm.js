import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * OrganizationForm Component
 * 
 * This component provides the interface for creating a new organization
 * in the Signal School system. It's part of the initial setup flow for
 * new admin users who need to establish their organization before
 * creating schools.
 * 
 * Features:
 * - Form for entering organization details (name, head office, contact)
 * - Form validation and submission
 * - Success/error message handling
 * - Automatic navigation to school creation after successful organization creation
 * - Updates user info in localStorage with organization data
 * 
 * This is typically the first step in the admin onboarding process.
 */
const OrganizationForm = () => {
  // Organization form data state
  const [organization, setOrganization] = useState({
    name: '',          // Organization name
    headOffice: '',    // Head office location/address
    contactNumber: '', // Primary contact number
  });
  
  // UI state for user feedback
  const [error, setError] = useState("");     // Error message display
  const [success, setSuccess] = useState(""); // Success message display
  
  // Authentication and navigation setup
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  /**
   * Handles form input changes
   * 
   * Updates the organization state when any form field changes.
   * Uses the input's name attribute to update the corresponding field.
   * 
   * @param {Event} e - Form input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization((prevOrganization) => ({
      ...prevOrganization,
      [name]: value,
    }));
  };

  // HTTP headers for authenticated API requests
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  }

  /**
   * Handles form submission
   * 
   * Submits the organization data to the backend API.
   * On success:
   * - Updates localStorage with new user info including organization data
   * - Shows success message
   * - Navigates to school creation page
   * On error:
   * - Displays error message
   * - Clears error after 2 seconds
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_BACKEND}/organization/create`, organization, { headers })
      .then((res) => {
          setSuccess(res.data.message);
          // Update user info with organization data
          localStorage.setItem('userInfo', JSON.stringify(res.data.data));
          
          // Navigate to school creation after 1 second
          setTimeout(() => {
            navigate("/create-school");
            setSuccess("");
          }, 1000);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setTimeout(() => {
          setError("");
        }, 2000);
      });


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
        <Typography variant="h4" sx={{ color: "colors.main" }}>Create Organization</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Organization Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            name="name"
            value={organization.name}
            onChange={handleChange}
            size='small'
          />
          <TextField
            label="Head Office"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            name="headOffice"
            value={organization.headOffice}
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
            value={organization.contactNumber}
            onChange={handleChange}
            size='small'
          />
          <Button type="submit" variant="contained" color="colors" fullWidth sx={{ marginTop: 2, color: "#fff" }}>
            Create Organization
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default OrganizationForm;
