import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Padding } from '@mui/icons-material';
import axios from 'axios';

const MarkTopicCompleted = ({ topic, teachers, setSuccess, setError, subjectId, fetchSyallabus }) => {
    const [open, setOpen] = useState(false);
    const [teacher, setTeacher] = useState('');
    const [completedDate, setCompletedDate] = useState(dayjs());

    const handleClose = () => {
        setOpen(false);
    };
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    const handleMarkCompleted = () => {
        if (teacher === '') {
            setError("Please select a teacher.");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }
        axios.post(`${process.env.REACT_APP_API_BACKEND}/syllabus/markTopicAsCompleted/${topic.id}`, {
            teacherId: teacher,
            completedDate: completedDate.format('YYYY-MM-DD')
        }, { headers })
            .then(() => {
                setSuccess("Topic marked as completed.");
                fetchSyallabus(subjectId);
                setTimeout(() => {
                    setSuccess("");
                    setOpen(false);
                }, 2000);
                setOpen(false);
            })
            .catch((error) => {
                setError("Error marking topic as completed.");
                setTimeout(() => {
                    setError("");
                }, 2000);
            }
            );

        // Close the dialog after marking completed
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Mark Topic Completed
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Topic: {topic.content}</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '10px' }}>
                        <FormControl>
                            <InputLabel>Teacher</InputLabel>
                            <Select
                                value={teacher}
                                onChange={(e) => setTeacher(e.target.value)}
                                label="Teacher"
                            >
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={completedDate}
                                onChange={(newValue) => setCompletedDate(newValue)}
                                label="Completed Date"
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                        <Button variant="contained" color="primary" onClick={handleMarkCompleted}>
                            Mark as Completed
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MarkTopicCompleted;
