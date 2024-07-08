import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const SubjectForm = () => {
    const [classes, setclasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedClassForSubject, setSelectedClassForSubject] = useState({name: '', id: ''});
    const [subjects, setSubjects] = useState([]);
    const [subjectName, setSubjectName] = useState('');
    const accessToken = localStorage.getItem('accessToken');
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers })
            .then(response => setclasses(response.data.classes))
            .catch(error => console.error('Error fetching classes:', error));

    }, []);

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleSubjectNameChange = (event) => {
        setSubjectName(event.target.value);
    };

    const handleAddSubject = () => {
        if (subjectName === '') {
            setError("Please enter a subject name.");
            setTimeout(() => {
                setError("");
            }
            , 2000);
            return;
        }
        if (selectedClass === '') {
            setError("Please select a class.");
            setTimeout(() => {
                setError("");
            }
            , 2000);
            return;
        }
        console.log("selectedClass", selectedClass);
        axios.post(`${process.env.REACT_APP_API_BACKEND}/subject/create`, {
            name: subjectName,
            classId: selectedClass
        }, { headers })
            .then(response => {
                setSuccess("Subject added successfully.");
                setTimeout(() => {
                    setSuccess("");
                }
                , 2000);
                setSubjectName("");
            }
            )
            .catch(error => {
                console.error('Error adding subject:', error);
                setError("Something went wrong. Please try again.");
                setTimeout(() => {
                    setError("");
                }
                , 2000);

            }
            );
    };

    
    const handleFetchSubjects=(e) => {
        setLoading(true);
            setSelectedClassForSubject({name: e.target.value, id: e.target.value});
            axios.get(`${process.env.REACT_APP_API_BACKEND}/subject/getAll/${e.target.value}`,{ headers })
                .then(response => {
                    setSubjects(response.data.subjects);
                    setLoading(false);
                }
                )
                .catch(error => {
                    console.error('Error fetching subjects:', error);
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
                Subject Form
            </Typography>
            <Paper elevation={0} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px'}}>
            <FormControl fullWidth>
                <InputLabel id="class-year-label">Select Class</InputLabel>
                <Select
                    labelId="class-year-label"
                    id="class-year"
                    value={selectedClass}
                    onChange={handleClassChange}
                    label="Select Class Year"
                    size='small'
                >
                    {classes &&
                    classes.length > 0 &&
                    classes.map(year => (
                        <MenuItem key={year.id} value={year.id}>
                            {year.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                id="subject-name"
                label="Subject Name"
                value={subjectName}
                onChange={handleSubjectNameChange}
                margin="normal"
                size='small'
            />

            <Button variant="contained"  onClick={handleAddSubject} sx={{ backgroundColor: 'colors.main', color: 'colors.white'}}>
                Add Subject
            </Button>
            </Paper>
            <Paper elevation={0} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '20px', borderRadius: '20px'}}>
            <Typography variant="h5" align="center" gutterBottom sx={{color: 'colors.main'}}>
                Subjects
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="academic-year-label">Select Class   </InputLabel>
                <Select
                    labelId="academic-year-label"
                    id="academic-year"
                    value={selectedClassForSubject.id}
                    onChange={(e) => handleFetchSubjects(e) }
                    label="Select Academic Year"
                    size='small'
                >
                    {classes &&
                    classes.length > 0 &&
                    classes.map(year => (
                        <MenuItem key={year.id} value={year.id}>
                            {year.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

{
loading ? <CircularProgress sx={{marginTop: '20px'}} />
:
subjects && subjects.length > 0 ?
    subjects.map((classObject) => (
        <Box key={classObject.id} sx={{backgroundColor: 'transparentBG.bgcolor', padding: '10px', borderRadius: '20px', marginTop: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)'}}>
            <Typography variant="h6" align="center" gutterBottom sx={{color: 'colors.main'}}>
                {classObject.name}
            </Typography>
        </Box>
    ))
: (
    <div>No subjects found.</div>
)}


            </Paper>
        </div>
    );
};

export default SubjectForm;
