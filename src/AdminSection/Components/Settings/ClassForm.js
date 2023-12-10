import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Paper, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

const ClassForm = () => {
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const [selectedAYforClass, setSelectedAYforClass] = useState({name: '', id: ''});
    const [classes, setClasses] = useState([]);
    const [className, setClassName] = useState('');
    const accessToken = localStorage.getItem('accessToken');
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    }

    useEffect(() => {
        // Fetch academic years from the API
        axios.get(`${process.env.REACT_APP_API_BACKEND}/academicYear/getAll`, { headers })
            .then(response => setAcademicYears(response.data.academicYears))
            .catch(error => console.error('Error fetching academic years:', error));

    }, []);

    const handleAcademicYearChange = (event) => {
        setSelectedAcademicYear(event.target.value);
    };

    const handleClassNameChange = (event) => {
        setClassName(event.target.value);
    };

    const handleAddClass = () => {
        // Create the class requirement object
        const classRequirement = {
            name: className,
            AcademicYearId: selectedAcademicYear,
        };
        axios.post(`${process.env.REACT_APP_API_BACKEND}/class/create`, classRequirement, { headers })
            .then(response => {
                setSuccess(response.data.message);
                setTimeout(() => {
                    setSuccess("");
                setClassName('');
                }, 2000);
            })
            .catch(error => {
                setError(error.response.data.error);
                setTimeout(() => {
                    setError("");
                }, 2000);
            }
            );
    };

    const handleFetchClasses=(e) => {
            setSelectedAYforClass({name: e.target.value, id: e.target.value});
            axios.get(`${process.env.REACT_APP_API_BACKEND}/class/getAll/${e.target.value}`,{ headers })
                .then(response => {
                    setClasses(response.data.classes);
                }
                )
                .catch(error => {
                    console.error('Error fetching classes:', error);
                    setError("Something went wrong. Please try again.");
                    setTimeout(() => {
                        setError("");
                    }
                    , 2000);

                }
                );
    };



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

            <Typography variant='h4' gutterBottom sx={{color: 'colors.main'}}>
                Class Form
            </Typography>
            <Paper elevation={0} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px'}}>
            <FormControl fullWidth>
                <InputLabel id="academic-year-label">Select Academic Year</InputLabel>
                <Select
                    labelId="academic-year-label"
                    id="academic-year"
                    value={selectedAcademicYear}
                    onChange={handleAcademicYearChange}
                    label="Select Academic Year"
                    size='small'
                >
                    {academicYears && 
                    academicYears.length > 0 &&
                    academicYears.map(year => (
                        <MenuItem key={year.id} value={year.id}>
                            {year.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                id="class-name"
                label="Class Name"
                value={className}
                onChange={handleClassNameChange}
                margin="normal"
                size='small'
            />

            <Button variant="contained"  onClick={handleAddClass} sx={{ backgroundColor: 'colors.main', color: 'colors.white'}}>
                Add Class
            </Button>
            </Paper>
            <Paper elevation={0} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '20px', borderRadius: '20px'}}>
            <Typography variant="h5" align="center" gutterBottom sx={{color: 'colors.main'}}>
                Classes
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="academic-year-label">Select Academic Year</InputLabel>
                <Select
                    labelId="academic-year-label"
                    id="academic-year"
                    value={selectedAYforClass.id}
                    onChange={(e) => handleFetchClasses(e) }
                    label="Select Academic Year"
                    size='small'
                >
                    {academicYears && 
                    academicYears.length > 0 &&
                    academicYears.map(year => (
                        <MenuItem key={year.id} value={year.id}>
                            {year.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

{classes.length > 0 ?
    classes.map((classObject) => (
        <Box key={classObject.id} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '10px', borderRadius: '20px', marginTop: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)'}}>
            <Typography variant="h6" align="center" gutterBottom sx={{color: 'colors.main'}}>
                {classObject.name}
            </Typography>
        </Box>
    ))
: (
    <div>No classes found.</div>
)}


            </Paper>
        </div>
    );
};

export default ClassForm;
