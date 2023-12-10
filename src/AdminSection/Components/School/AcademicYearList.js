import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

const AcademicYearList = (props) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(props.currentAcademicYear);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newAcademicYear, setNewAcademicYear] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  useEffect(() => {
    // Fetch the list of academic years from the server
    // You should replace the URL with your actual endpoint
    axios.get(`${process.env.REACT_APP_API_BACKEND}/academicYear/getAll`, { headers })
      .then((res) => {
        setAcademicYears(res.data.academicYears);
        console.log(currentAcademicYear)
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSave = () => {
    // Validate input before sending to the server
    if (newAcademicYear.name && newAcademicYear.startDate && newAcademicYear.endDate) {
      // Add new academic year to the server
      axios.post(`${process.env.REACT_APP_API_BACKEND}/academicYear/create`, newAcademicYear, { headers })
        .then((res) => {
          // Update the local state with the new academic year
          setSuccess(res.data.message);
          setAcademicYears([...academicYears, res.data.academicYear]);
          // Clear the form
          setNewAcademicYear({
            name: '',
            startDate: '',
            endDate: '',
          });
          // Close the modal
          setIsAddModalOpen(false);
          setTimeout(() => {
            setSuccess("");
          }, 2000);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleDeleteClick = (id) => {
    // Delete academic year from the server
    axios.delete(`${process.env.REACT_APP_API_BACKEND}/academicYear/delete/${id}`, { headers })
      .then(() => {
        // Update the local state by removing the deleted academic year
        setAcademicYears(academicYears.filter(year => year.id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const setCurrentYear = (id) => {
    const data = {
      academicYearId: id
    }
    axios.post(`${process.env.REACT_APP_API_BACKEND}/academicYear/setCurrentAcademicYear/`, data, { headers })
      .then((res) => {
        setCurrentAcademicYear(id);
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      }
      )
      .catch((err) => {
        console.error(err);
      });
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


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

      <Typography variant="h4"  sx={{ color: 'colors.main' }}>
        Academic Years
      </Typography>

      <Button variant="contained"   onClick={handleAddClick} sx={{ backgroundColor: 'colors.main', color: 'colors.white' }}>
        Add Academic Year
      </Button>
      </div>

      <TableContainer component={Paper} elevation={0} style={{ marginTop: '20px', backgroundColor: 'transparentBG.bgcolor' , borderRadius: '20px', padding: "0 0 0 20px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!props.loading && academicYears.map((year) => (
              <TableRow key={year.id}>
                <TableCell>{year.name}</TableCell>
                <TableCell>{new Date(year.startDate).toLocaleDateString("en-US")}</TableCell>
                <TableCell>{new Date(year.endDate).toLocaleDateString("en-US")}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteClick(year.id)}>
                    Delete
                  </Button>
                  {/* <Button variant="outlined" color="primary" sx={{ marginLeft: '10px' }} onClick={() => setCurrentYear(year.id)}>
                    Set Current Year
                  </Button> */}
                  {/* {currentAcademicYear === year.id ? <Button variant="outlined" color="primary" sx={{ marginLeft: '10px' }} disabled>
                    Current Year
                  </Button> : <Button variant="outlined" color="primary" sx={{ marginLeft: '10px' }} onClick={() => setCurrentYear(year.id)}>
                    Set Current Year
                  </Button>} */}
                  {parseInt(currentAcademicYear) === year.id && <Button variant="outlined" color="primary" sx={{ marginLeft: '10px' }} disabled>
                    Current Year
                  </Button>}
                  {parseInt(currentAcademicYear) !== year.id && <Button variant="outlined" color="primary" sx={{ marginLeft: '10px' }} onClick={() => setCurrentYear(year.id)}>
                    Set Current Year
                  </Button>}


                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Academic Year Modal */}
      <Modal open={isAddModalOpen} onClose={handleAddModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '20px',
          }}
        >
          <Typography variant="h5" gutterBottom align="center" sx={{ color: 'colors.main', fontWeight: 'bold' }}>
            Add Academic Year
          </Typography>
          <TextField
            label="Name"
            value={newAcademicYear.name}
            onChange={(e) => setNewAcademicYear({ ...newAcademicYear, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={newAcademicYear.startDate}
            onChange={(e) => setNewAcademicYear({ ...newAcademicYear, startDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
              style: { marginLeft: '0px' } // Adjust the margin as needed
          }}
          />
          <TextField
            label="End Date"
            type="date"
            value={newAcademicYear.endDate}
            onChange={(e) => setNewAcademicYear({ ...newAcademicYear, endDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
              style: { marginLeft: '0px' } // Adjust the margin as needed
          }}
          />
          <Button variant="contained" color="colors" onClick={handleAddSave} sx={{ color: '#fff' }}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AcademicYearList;
