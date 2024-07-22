import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Grid,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TextField,
  Skeleton,
  Box,
  Paper,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Cancel, Edit, PhotoCamera } from '@mui/icons-material';
import UploadTeacherAvatar from './UploadTeacherAvatar';
import TeacherTimeline from './TeacherLogs';

const TeacherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    imageLink: '',
    contactNumber: '',
    currentSchool: '',
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  const fetchTeacher = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BACKEND}/teacher/get/${id}`, { headers });
      setTeacher(response.data.teacher);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch teacher details');
      setLoading(false);
    }
  };

  useEffect(() => {


    fetchTeacher();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacher({ ...teacher, [name]: value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_BACKEND}/teacher/updatePassword/${id}`, { password , confirmPassword }, { headers });
      setSuccess('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      axios.put(`${process.env.REACT_APP_API_BACKEND}/teacher/update/${id}`, teacher, { headers })
      .then((response) => {
        setSuccess('Teacher updated successfully');
        setEditMode(false);
      })
      .catch((err) => {
        setError('Failed to update teacher');
      });

    } catch (err) {
      setError('Failed to update teacher');
    }
  };

  const handleImageChange = async (imageLink) => {
    setTeacher({ ...teacher, imageLink });
  };

  const handleCancel = () => {
    setEditMode(false);
    fetchTeacher();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };


  if (loading) return <Skeleton variant="rectangular" width="100%" height={500} />;
  // if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <>
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
      <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Details" />
        <Tab label="Logs" />
      </Tabs>

 {currentTab === 0 && (
    <Grid container spacing={3} marginTop={1}>
      <Grid item xs={12} md={2} align="center" sx={{ marginTop: 3 }}>
        {loading ? (
          <Skeleton variant="circular" width={150} height={150} />
        ) : (
          <Avatar alt={teacher.name} src={teacher.imageLink} sx={{ width: 150, height: 150 }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <UploadTeacherAvatar handleImageChange={handleImageChange} setSuccess={setSuccess} setError={setError} teacherId={id} /> 
        
        {editMode ? (
          <Button
            variant="outlined"
            sx={{ marginTop: "10px" }}
            onClick={handleCancel}
          >
            Cancel <Cancel sx={{ fontSize: '1.2rem', marginLeft: '5px' }} />
          </Button>
        ) : (
          <Button
            variant="outlined"
            sx={{ marginTop: "10px" }}
            onClick={() => setEditMode(true)}
          >
            Edit <Edit sx={{ fontSize: '1.2rem', marginLeft: '5px' }} />
          </Button>
        )}
        </div>
        <div>
        {editMode && (
          <Button
            variant="contained"
            sx={{ marginTop: "5px", backgroundColor: "colors.main" }}
            onClick={handleSubmit}
          >
            Save
          </Button>
        )}
        </div>
      </Grid>
      <Grid item xs={12} md={10}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "transparentBG.bgcolor",
            borderRadius: "20px",
            padding: "10px",
            boxShadow: "inset 0px 0px 10px 0px rgba(42, 42, 42, 0.101)",
          }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                  Name
                </TableCell>
                <TableCell sx={{ width: "70%" }}>
                  {editMode ? (
                    <TextField
                      sx={{ width: '100%' }}
                      size="small"
                      name="name"
                      value={teacher.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    teacher.name
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                  Email
                </TableCell>
                <TableCell sx={{ width: "70%" }}>
                  {editMode ? (
                    <TextField
                      sx={{ width: '100%' }}
                      size="small"
                      name="email"
                      type="email"
                      value={teacher.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    teacher.email
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                  Contact Number
                </TableCell>
                <TableCell sx={{ width: "70%" }}>
                  {editMode ? (
                    <TextField
                      sx={{ width: '100%' }}
                      size="small"
                      name="contactNumber"
                      value={teacher.contactNumber}
                      onChange={handleInputChange}
                    />
                  ) : (
                    teacher.contactNumber
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Paper sx={{ backgroundColor: "transparentBG.bgcolor", borderRadius: "20px", padding: "20px", boxShadow: "inset 0px 0px 10px 0px rgba(42, 42, 42, 0.101)" , marginTop: "20px"}}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 4 }}>
          Change Password
        </Typography>
        <Box component="form" onSubmit={handlePasswordChange} sx={{ '& .MuiTextField-root': { my: 1 } }}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size='small'
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            size='small'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Password
          </Button>
        </Box>
        </Paper>
      </Grid>
    </Grid>
)}
  {currentTab === 1 && (
    <TeacherTimeline teacherId={id} setError={setError} />
  )}

  </>
  );
};

export default TeacherDetailPage;
