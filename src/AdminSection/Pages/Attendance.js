import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import ExportAttendanceButton from '../Components/ExportAttendanceButton';

const Attendance = () => {
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default start date (last 7 days)
    const [endDate, setEndDate] = useState(dayjs());
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    const fetchAttendanceData = () => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BACKEND}/attendance/16`, {
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

    const handleDateRangeChange = (option) => {
        const today = dayjs();
        switch (option) {
            case 'last7days':
                setStartDate(today.subtract(7, 'day'));
                setEndDate(today);
                break;
            case 'monthwise':
                setStartDate(today.subtract(1, 'month'));
                setEndDate(today);
                break;
            // Add more cases for custom range, all dates, etc.
            default:
                break;
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, [startDate, endDate]); // Fetch data when date range changes

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    <InputLabel>Date Range</InputLabel>
                    <Select
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                        style={{ minWidth: 200 }}
                        size='small'
                        defaultValue="last7days"
                    >
                        <MenuItem value="last7days">Last 7 Days</MenuItem>
                        <MenuItem value="monthwise">Month-wise</MenuItem>
                        {/* Add more date range options (custom range, all dates, etc.) */}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={fetchAttendanceData} size='small'>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
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
