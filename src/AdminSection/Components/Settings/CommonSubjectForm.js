import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const CommonSubjectForm = () => {
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const [selectedAYforCommonSubject, setSelectedAYforCommonSubject] = useState({name: '', id: ''});
    const [commonSubjects, setCommonSubjectes] = useState([]);
    const [commonSubjectName, setCommonSubjectName] = useState('');
    const accessToken = localStorage.getItem('accessToken');
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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

    const handleCommonSubjectNameChange = (event) => {
        setCommonSubjectName(event.target.value);
    };

    const handleAddCommonSubject = () => {
        // Create the commonSubject requirement object
        const commonSubjectRequirement = {
            name: commonSubjectName,
            AcademicYearId: selectedAcademicYear,
        };
        axios.post(`${process.env.REACT_APP_API_BACKEND}/commonsubject/create`, commonSubjectRequirement, { headers })
            .then(response => {
                setSuccess(response.data.message);
                setTimeout(() => {
                    setSuccess("");
                setCommonSubjectName('');
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

    const handleFetchCommonSubjectes=(e) => {
        setLoading(true);
            setSelectedAYforCommonSubject({name: e.target.value, id: e.target.value});
            axios.get(`${process.env.REACT_APP_API_BACKEND}/commonsubject/getAll/${e.target.value}`,{ headers })
                .then(response => {
                    setCommonSubjectes(response.data.commonSubjects);
                    setLoading(false);
                }
                )
                .catch(error => {
                    console.error('Error fetching commonSubjects:', error);
                    setError("Something went wrong. Please try again.");
                    setLoading(false);
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
                Common Subject Form
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
                id="commonSubject-name"
                label="Common Subject Name"
                value={commonSubjectName}
                onChange={handleCommonSubjectNameChange}
                margin="normal"
                size='small'
            />

            <Button variant="contained"  onClick={handleAddCommonSubject} sx={{ backgroundColor: 'colors.main', color: 'colors.white'}}>
                Add Common Subject
            </Button>
            </Paper>
            <Paper elevation={0} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '20px', borderRadius: '20px'}}>
            <Typography variant="h5" align="center" gutterBottom sx={{color: 'colors.main'}}>
                Common Subjectes
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="academic-year-label">Select Academic Year</InputLabel>
                <Select
                    labelId="academic-year-label"
                    id="academic-year"
                    value={selectedAYforCommonSubject.id}
                    onChange={(e) => handleFetchCommonSubjectes(e) }
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

    {
        loading ? <CircularProgress size={24} sx={{ margin: 'auto' }} />
        : commonSubjects.length > 0 ?
        commonSubjects.map((commonSubjectObject) => (
            <Box key={commonSubjectObject.id} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '10px', borderRadius: '20px', marginTop: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)'}}>
                <Typography variant="h6" align="center" gutterBottom sx={{color: 'colors.main'}}>
                    {commonSubjectObject.name}
                </Typography>
            </Box>
        ))
        : (
            <Typography variant="h6" align="center" gutterBottom sx={{color: 'colors.main'}}>No Common Subjectes found.</Typography>
        )
    }


            </Paper>
        </div>
    );
};

export default CommonSubjectForm;
