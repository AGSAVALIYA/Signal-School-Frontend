import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Alert, TextField } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import ExportAttendanceButton from '../Components/ExportAttendanceButton';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Attendance = () => {
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default start date (last 7 days)
    const [endDate, setEndDate] = useState(dayjs());
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");




    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    const fetchAttendanceData = () => {
        if (selectedClass === null) {
            setError("Please select a class.");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }

        if(startDate.isAfter(endDate)){
            setError("Start date cannot be after end date.");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }


        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BACKEND}/attendance/${selectedClass ? selectedClass : 'all'}`, {
            headers,
            params: {
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
            }
        })
            .then((res) => {
                setAttendanceData(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching attendance data:', err);
                setLoading(false);
            });
    };


    const getClasses = () => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers }).then((res) => {
            setClasses(res.data.classes);
        }
        ).catch((err) => {
            setError(err.response.data.error);
            setTimeout(() => {
                setError("");
            }, 2000);
        }
        )
    };



    useEffect(() => {
        getClasses();
    }, []);
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    position: 'sticky',
                    top: '70px',
                    zIndex: '10',
                }}
            >
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <DatePicker 
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                            label="Start Date"
                            //format = "yyyy-MM-dd"
                            format='DD/MM/YYYY'
                            
                        />
                    </LocalizationProvider>

                </FormControl>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                            label="End Date"
                            format='DD/MM/YYYY'
                        />
                    </LocalizationProvider>
                </FormControl>



                <FormControl>
                    <InputLabel id="class-label">Select Class</InputLabel>
                    <Select
                        onChange={(e) => setSelectedClass(e.target.value)}
                        style={{ minWidth: 200 }}
                        defaultValue=""
                        labelId="class-label"
                        label="Select Class"
                    >
                        {
                            classes && classes.map((classItem) => (
                                <MenuItem key={classItem.id} value={classItem.id}>{classItem.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>


                <Button variant="contained" onClick={fetchAttendanceData}>
                    Get Attendance
                </Button>

                <ExportAttendanceButton attendanceData={attendanceData} />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : (
                Object.keys(attendanceData).length === 0 ? (
                    <Box sx={{ textAlign: 'center', width: '80%' }}>
                        <h3>No attendance data available for the selected date range.</h3>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                        {Object.keys(attendanceData).map((date) => (
                            <Box key={date} sx={{ width: '80%', marginBottom: '20px' }}>
                                <h3>{date}</h3>
                                <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Student Name</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {attendanceData[date].map((record) => (
                                                <TableRow key={record.Student.id}>
                                                    <TableCell>{record.Student.name}</TableCell>
                                                    <TableCell>
                                                        <Chip label={record.status} color={record.status === 'present' ? 'success' : 'error'} sx={{ textTransform: 'capitalize' }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ))}
                    </Box>
                )
            )}
        </Box>
    );
};

export default Attendance;
