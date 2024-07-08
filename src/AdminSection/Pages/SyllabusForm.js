import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Paper, Button, Typography, TextField, InputAdornment, IconButton, CircularProgress, Tabs, Tab, TableContainer } from '@mui/material'; // Add CircularProgress for loading state
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { RemoveCircleOutline, RemoveDoneRounded } from '@mui/icons-material';
import ChapterChip from '../Components/ChapterChip';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import MarkTopicCompleted from '../Components/MarkTopicCompleted';

const SyllabusForm = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [syllabus, setSyllabus] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [newChapter, setNewChapter] = useState('');
    const [newTopics, setNewTopics] = useState(['']);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [tabValue, setTabValue] = useState(0);
    const [teachers, setTeachers] = useState([]);


    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    useEffect(() => {
        fetchClasses();
        if (successMessage) {
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage('');
            }
                , 3000);
        }
    }, []);




    const fetchClasses = () => {
        setLoading(true); // Start loading indicator
        axios.get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers })
            .then(response => {
                setClasses(response.data.classes);
            })
            .catch(error => {
                console.error('Error fetching classes:', error);
                setClasses([]);
            })
            .finally(() => {
                setLoading(false); // Stop loading indicator
            });
    };

    const fetchSyllabus = (subjectId) => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/syllabus/get/${subjectId}`, { headers })
            .then(response => setSyllabus(response.data.chapters))
            .catch(error => console.error('Error fetching syllabus:', error));
    };

    const handleClassChange = (event) => {
        const classId = event.target.value;
        setSelectedClass(classId);

        axios.get(`${process.env.REACT_APP_API_BACKEND}/subject/getAll/${classId}`, { headers })
            .then(response => setSubjects(response.data.subjects))
            .catch(error => console.error('Error fetching subjects:', error));
    };

    const handleSubjectChange = (event) => {
        const subjectId = event.target.value;
        setSelectedSubject(subjectId);
        fetchSyllabus(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true); // Start loading indicator
        axios.post(`${process.env.REACT_APP_API_BACKEND}/syllabus/add/${selectedSubject}`, {
            chapterName: newChapter,
            topics: newTopics
        }, { headers })
            .then(response => {
                setSuccessMessage('Syllabus added successfully.');
                setNewChapter('');
                setNewTopics(['']);
                fetchSyllabus(selectedSubject);
            })
            .catch(error => {
                console.error('Error adding syllabus:', error);
                setErrorMessage('Error adding syllabus. Please try again.');
            })
            .finally(() => {
                setLoading(false); // Stop loading indicator
            });
    };

    const handleAddTopic = () => {
        setNewTopics([...newTopics, '']);
    };

    const handleRemoveTopic = (index) => {
        const updatedTopics = [...newTopics];
        updatedTopics.splice(index, 1);
        setNewTopics(updatedTopics);
    };

    const handleTopicChange = (index, value) => {
        const updatedTopics = [...newTopics];
        updatedTopics[index] = value;
        setNewTopics(updatedTopics);
    };

    const handleDelete = (id) => {
        axios.delete(`${process.env.REACT_APP_API_BACKEND}/syllabus/delete/${id}`)
            .then(() => {
                fetchSyllabus(selectedSubject);
            }
            )
            .catch((error) => {
                console.error('Error deleting chapter:', error);
            }
            );
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 1) {
            setLoading(true);
            //get Teachers
            axios.get(`${process.env.REACT_APP_API_BACKEND}/teacher/getAll`, { headers })
                .then(response => {
                    setTeachers(response.data.teachers);
                })
                .catch(error => {
                    console.error('Error fetching teachers:', error);
                    setTeachers([]);
                })
                .finally(() => {
                    setLoading(false);
                });

        }
    }


    const handleUnMarkAsCompleted = async (topicId) => {
        try {
            axios.post(`${process.env.REACT_APP_API_BACKEND}/syllabus/unMarkTopicAsCompleted/${topicId}`, {}, { headers })
                .then((response) => {
                const updatedSyllabus = syllabus.map((chapter) => {
                    const updatedTopics = chapter.Topics.map((topic) => {
                        if (topic.id === topicId) {
                            return { ...topic, completedBy: null };
                        }
                        return topic;
                    });
                    return { ...chapter, Topics: updatedTopics };
                });
                setSuccessMessage('Topic marked as incomplete');
                setSyllabus(updatedSyllabus);
                setTimeout(() => {
                    setSuccessMessage('');
                }, 2000);
            })
            .catch((error) => {
                console.error('Error marking topic as incomplete:', error);
                setErrorMessage('Error marking topic as incomplete');
                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            });

        } catch (error) {
            console.error('Error marking topic as incomplete:', error);
            setErrorMessage('Error marking topic as incomplete');
            setTimeout(() => {
                setErrorMessage('');
            }
                , 2000);
        }
    }
    return (
        <div>
            {successMessage && (
                <Alert onClose={() => setSuccessMessage('')} severity="success">
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert onClose={() => setErrorMessage('')} severity="error">
                    {errorMessage}
                </Alert>
            )}
            <Typography variant="h4" gutterBottom sx={{ color: 'colors.main' }}>Syllabus</Typography>


            <Paper elevation={0} sx={{ backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px' }}>
                {loading ? (
                    <CircularProgress /> // Show loading indicator
                ) : (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Class</InputLabel>
                        <Select
                            value={selectedClass}
                            onChange={handleClassChange}
                            size='small'
                            label="Select Class"
                        >
                            {classes.map(cls => (
                                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Subject</InputLabel>
                    <Select
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        size='small'
                        label="Select Subject"
                    >
                        {subjects.map(subject => (
                            <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {!loading && !selectedSubject ? <Paper elevation={0} sx={{ backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px' }}>
                <Typography variant="h6" sx={{ color: 'colors.main' }}>Select a Class and Subject. </Typography>
            </Paper>
                :

                (<><Paper elevation={0} sx={{ backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="secondary" centered>
                        <Tab label="Add Syllabus" />
                        <Tab label="View / Manage Syllabus" />
                    </Tabs>
                </Paper>

                    {tabValue === 0 && (
                        <>
                            <Paper elevation={0} sx={{ backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px' }}>
                                <Typography variant="h6" sx={{ color: 'colors.main', marginBottom: '10px' }}>Chapters</Typography>
                                {
                                    syllabus.length > 0 ?
                                        <div>
                                            {
                                                syllabus.map((chapter, index) => (
                                                    <ChapterChip key={index} chapter={chapter} handleDelete={handleDelete} />
                                                ))
                                            }
                                        </div>
                                        :
                                        <p>No syllabus available for the selected subject.</p>

                                }
                            </Paper>

                            {selectedSubject &&
                                <Paper elevation={0} sx={{ backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px' }}>
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            fullWidth
                                            label="Chapter Name"
                                            value={newChapter}
                                            onChange={(e) => setNewChapter(e.target.value)}
                                            margin="normal"
                                        />

                                        {newTopics.map((topic, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <TextField
                                                    fullWidth
                                                    label={`Topic ${index + 1}`}
                                                    value={topic}
                                                    onChange={(e) => handleTopicChange(index, e.target.value)}
                                                    margin="none"
                                                    size="small"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => handleRemoveTopic(index)} size="small">
                                                                    <RemoveCircleOutline />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        ))}

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddTopic}
                                            sx={{ backgroundColor: 'colors.main', color: 'colors.white', marginTop: '10px' }}
                                        >
                                            Add Topic
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{ backgroundColor: 'colors.main', color: 'colors.white', marginLeft: '10px', marginTop: '10px' }}
                                        >
                                            Submit
                                        </Button>
                                    </form>
                                </Paper>
                            }
                        </>
                    )}
{tabValue === 1 && (
    <Paper elevation={0} sx={{ backgroundColor: 'transparentBG.bgcolor', padding: '20px', marginBottom: '10px', borderRadius: '20px' }}>
        {loading ? (
            <CircularProgress /> // Show loading indicator
        ) : (
            <div>
                {syllabus.map(chapter => (
                    <div key={chapter.id} style={{ marginBottom: '20px' }}>
                        <Typography variant="h6" sx={{ marginBottom: '10px' }}>{chapter.name}</Typography>
                        <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                            <Table sx={{ minWidth: 650 , border: '1px solid #f5f5f5'}}>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell>Topic</TableCell>
                                        <TableCell align="center">Completed By</TableCell>
                                        <TableCell align="center">Completed At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {chapter.Topics.map(topic => (
                                        <TableRow key={topic.id}>
                                            <TableCell>
                                                {topic.content} 
                                            </TableCell>
                                            {
                                                topic.completedBy ? (
                                                    <>
                                                        <TableCell align="center">{topic.Teacher.name}</TableCell>
                                                        <TableCell align="center">{dayjs(topic.completedDate).format('DD/MM/YYYY')} <RemoveDoneRounded onClick={() => handleUnMarkAsCompleted(topic.id)} /></TableCell>
                                                    </>
                                                ) : (
                                                    <TableCell colSpan={2} align="center">
                                                        <MarkTopicCompleted 
                                                        topic={topic} 
                                                        teachers={teachers} 
                                                        setSuccess={setSuccessMessage} 
                                                        setError={setErrorMessage}
                                                        subjectId={selectedSubject}
                                                        fetchSyllabus={fetchSyllabus}
                                                        />
                                                    </TableCell>
                                                )
                                            }
                                        </TableRow>
                                    ))}
                                    {chapter.Topics.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">No topics available for this chapter.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ))}
            </div>
        )}
    </Paper>
)}



                    
                    </>)}

        </div>
    );
};

export default SyllabusForm;
