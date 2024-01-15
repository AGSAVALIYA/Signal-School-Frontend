// AddNewStudent.js
import React, { useState, useEffect } from 'react';
import { Add } from '@mui/icons-material';
import { Dialog, Fab, Zoom, Alert, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import NewStudentTab from './NewStudentTab';
import PreviousAcademicYearTab from './PreviousAcademicYearTab.js';

const AddNewStudent = (props) => {
  const { fetchStudents } = props;
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState('');
  const [nameFromPreviousAcademicYear, setNameFromPreviousAcademicYear] = useState(null);
  const [selectedClass, setSelectedClass] = useState({ name: '', id: '' });
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [GRNo, setGRNo] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Autocomplete state
  const [searchedNames, setSearchedNames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      handleFetchClasses();
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    // Reset the form data when the dialog is closed
    resetFormData();
  };

  const resetFormData = () => {
    setName('');
    setSelectedClass({ name: '', id: '' });
    setAge('');
    setDob('');
    setAddress('');
  };

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const handleFetchClasses = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers })
      .then((res) => {
        const sortedClasses = res.data.classes.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
        });
        setClasses(sortedClasses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFabClick = () => {
    handleFetchClasses();
    setOpen(!open);
  };

  const handleNameSearch = (value) => {
    // Perform API call for name search
    setLoading(true);
    if (value === '') {
      setSearchedNames([]);
      setLoading(false);
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/student/searchName?name=${value}`, { headers })
      .then((res) => {
        setSearchedNames(res.data.names);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const resetFormAndTab = (val) => {
    resetFormData();
    setTabValue(val); // Assuming you want to reset to the first tab
  };
  const handleSubmit = () => {
    if (!name || !selectedClass || !age || !dob || !address) {
      setError('Please fill all the fields');
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }
    

    const data = {
      name: name,
      ClassId: selectedClass.id,
      age: age,
      dob: dob,
      address: address,
    };
    axios
      .post(`${process.env.REACT_APP_API_BACKEND}/student/create`, data, { headers })
      .then((res) => {
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess('');
          fetchStudents();
          setOpen(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.error);
        setTimeout(() => {
          setError('');
        }, 2000);
      });

    handleClose();
  };

  const handleFromPreviousAcademicYearSubmit = () => {
    if(!GRNo){
        setError("GR Number is required");
        setTimeout(() => {
            setError('');
        }, 2000);
        return;
        }

    const data = {
        name: nameFromPreviousAcademicYear.name,
        ClassId: selectedClass.id,
        age: age,
        dob: dob,
        address: address,
        GRNumber: GRNo,
        };
        axios.post(`${process.env.REACT_APP_API_BACKEND}/student/create`, data, { headers })
        .then((res) => {
            setSuccess(res.data.message);
            setTimeout(() => {
                setSuccess('');
                fetchStudents();
                setOpen(false);
            }, 2000);
        })
        .catch((err) => {
            console.log(err);
            setError(err.response.data.error);
            setTimeout(() => {
                setError('');
            }, 2000);
        });
    handleClose();
    };



  return (
    <div>
      {success && (
        <Alert
          onClose={() => setSuccess('')}
          severity="success"
          sx={{
            position: 'fixed',
            top: '50px',
            left: '0',
            right: '0',
            zIndex: '10000',
            width: 'max-content',
            margin: 'auto',
          }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{
            position: 'fixed',
            top: '50px',
            left: '0',
            right: '0',
            zIndex: '10000',
            width: 'max-content',
            margin: 'auto',
          }}
        >
          {error}
        </Alert>
      )}
      <div style={{ position: 'fixed', bottom: '75px', right: '20px' }}>
        <Zoom in={true} timeout={300}>
          <Fab
            aria-label="add"
            onClick={handleFabClick}
            sx={{
              color: '#fff',
              backgroundColor: 'colors.main',
              '&:hover': { backgroundColor: 'colors.main' },
            }}
          >
            <Add sx={{ fontSize: '2rem' }} />
          </Fab>
        </Zoom>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
        <div style={{ padding: '20px' }}>
          
          <Tabs value={tabValue} onChange={(e, newValue) => resetFormAndTab(newValue)} aria-label="basic tabs example">
            <Tab label="New Student" />
            <Tab label="From Previous A.Y." />
          </Tabs>
          {tabValue === 0 && (
            <NewStudentTab
              classes={classes}
              name={name}
              selectedClass={selectedClass}
              age={age}
              dob={dob}
              address={address}
              setName={setName}
              setSelectedClass={setSelectedClass}
              setAge={setAge}
              setDob={setDob}
              setAddress={setAddress}
              handleSubmit={handleSubmit}
            />
          )}
          {tabValue === 1 && (
            <PreviousAcademicYearTab
              searchedNames={searchedNames}
              loading={loading}
              name={nameFromPreviousAcademicYear}
              classes={classes}
              selectedClass={selectedClass}
              age={age}
              dob={dob}
              address={address}
              setName={setNameFromPreviousAcademicYear}
              setSelectedClass={setSelectedClass}
              setAge={setAge}
              setDob={setDob}
              setAddress={setAddress}
              handleNameSearch={handleNameSearch}
              headers={headers}
              setGRNo={setGRNo}
              handleSubmit={handleFromPreviousAcademicYearSubmit}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default AddNewStudent;
