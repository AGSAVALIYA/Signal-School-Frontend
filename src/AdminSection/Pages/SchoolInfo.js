import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  TextField,
  Button,
  Alert,
  Divider,
  Box,
} from '@mui/material';
import axios from 'axios';
import AcademicYearList from '../Components/School/AcademicYearList';

const SchoolInfoTab = () => {
  // Dummy data for tables
  const accessToken = localStorage.getItem('accessToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [schoolInfo, setSchoolInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [infoEdit, setInfoEdit] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const headers = {
    'Authorization': `Bearer ${accessToken}`
  }


  const getSchoolInfo = () => {
    // You can get school info from the server here
    setLoading(true);
    const schoolId = userInfo.currentSchool.id;
    axios.get(`${process.env.REACT_APP_API_BACKEND}/school/get/${schoolId}`, { headers })
      .then((res) => {
        console.log(res.data.school);
        setSchoolInfo(res.data.school);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

  }


  useEffect(() => {
    getSchoolInfo();
  }
    , []);

    const handleSave = () => {
      const schoolId = userInfo.currentSchool.id;
      axios.put(`${process.env.REACT_APP_API_BACKEND}/school/update/${schoolId}`, schoolInfo, { headers })
        .then((res) => {
          setSuccess(res.data.message);
          setInfoEdit(false);
          setTimeout(() => {
            setSuccess("");
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setError(err.response.data.error);
          setTimeout(() => {
            setError("");
          }, 2000);
        })
    }

  return (
    <div>
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

      <div style={{display: "flex", flexDirection: "row", alignItems: "center", padding: "0 20px", justifyContent: "space-between"}}>
      <Typography variant="h3"  sx={{ color: 'colors.main' , marginLeft: "10px"}}>
        School Info
      </Typography>
      {/* <Button variant="contained" sx={{ backgroundColor: 'colors.main', color: 'colors.white', marginTop: '10px' }}  onClick={() => setInfoEdit(!infoEdit)}>
        {infoEdit ? "Save" : "Edit"}
      </Button> */}
      {infoEdit ? <Button variant="contained" sx={{ backgroundColor: 'colors.main', color: 'colors.white', marginTop: '10px' }} onClick={handleSave}>
        Save
      </Button> : <Button variant="contained" sx={{ backgroundColor: 'colors.main', color: 'colors.white', marginTop: '10px' }} onClick={() => setInfoEdit(!infoEdit)}>
        Edit
      </Button>}
      </div>
      <Grid container spacing={2} sx={{ marginTop: '20px', padding: "0 20px" }}>
        <Grid item xs={6}>
          <Paper sx={{backgroundColor: "transparentBG.bgcolor", borderRadius: '20px'}} elevation={0}>
            <Typography variant="h6" align="center" gutterBottom>
              General Information
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>School Name</TableCell>
                    <TableCell>
                      {loading ? <Skeleton height={25} width={100} /> : (
                        infoEdit ? <TextField
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          value={schoolInfo.name}
                          onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                        /> : schoolInfo.name
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell>{loading ? <Skeleton height={25} width={100} /> : (
                      infoEdit ? <TextField
                        id="outlined-basic"
                        variant="outlined"
                        size="small"
                        value={schoolInfo.location}
                        onChange={(e) => setSchoolInfo({ ...schoolInfo, location: e.target.value })}
                      /> : schoolInfo.location
                    )
                    }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{backgroundColor: "transparentBG.bgcolor", borderRadius: '20px'}} elevation={0}>
            <Typography variant="h6" align="center" gutterBottom>
              Contact Information
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>{loading ? <Skeleton height={25} width={100} /> :
                      infoEdit ? <TextField
                        id="outlined-basic"
                        variant="outlined"
                        size="small"
                        value={schoolInfo.contactNumber}
                        onChange={(e) => setSchoolInfo({ ...schoolInfo, contactNumber: e.target.value })}
                      /> : schoolInfo.contactNumber
                    }</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>{loading ? <Skeleton height={25} width={100} /> : 
                    infoEdit ? <TextField
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={schoolInfo.address}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                    /> : schoolInfo.address
                    }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Box sx={{width: "100%", marginTop: "20px", height: "1px", backgroundColor: "primary.main"}}></Box>
        <Grid item xs={12}>
          {!loading && (
          <AcademicYearList currentAcademicYear={schoolInfo.currentAcademicYear} loading={loading} />
          )}
          </Grid>
      </Grid>
    </div>
  );
};

export default SchoolInfoTab;
