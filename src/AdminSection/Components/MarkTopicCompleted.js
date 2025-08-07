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

/**
 * MarkTopicCompleted Component
 * 
 * A modal dialog component that allows administrators to mark specific syllabus topics 
 * as completed by assigning them to teachers with completion dates.
 * 
 * This component provides functionality to:
 * - Select a teacher who completed the topic
 * - Set the completion date using a date picker
 * - Submit the completion information to the backend
 * - Update the syllabus state after successful submission
 * 
 * Props:
 * @param {Object} topic - The topic object containing topic details (id, content, etc.)
 * @param {Array} teachers - Array of teacher objects to choose from
 * @param {Function} setSuccess - Function to display success messages
 * @param {Function} setError - Function to display error messages  
 * @param {string} subjectId - ID of the subject containing this topic
 * @param {Function} fetchSyallabus - Function to refresh syllabus data after update
 */
const MarkTopicCompleted = ({ topic, teachers, setSuccess, setError, subjectId, fetchSyallabus }) => {
    // Dialog state management
    const [open, setOpen] = useState(false);
    
    // Form state for teacher selection and date
    const [teacher, setTeacher] = useState(''); // Selected teacher ID
    const [completedDate, setCompletedDate] = useState(dayjs()); // Completion date, defaults to today

    /**
     * Closes the dialog and resets form state
     */
    const handleClose = () => {
        setOpen(false);
    };
    
    // Authentication headers for API requests
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    
    /**
     * Handles the marking of a topic as completed
     * 
     * Validates form data and sends a POST request to mark the topic as completed.
     * On success, it updates the syllabus data and displays a success message.
     * On error, it displays an error message.
     */
    const handleMarkCompleted = () => {
        // Validate teacher selection
        if (teacher === '') {
            setError("Please select a teacher.");
            setTimeout(() => {
                setError("");
            }, 2000);
            return;
        }
        
        // Send POST request to mark topic as completed
        axios.post(`${process.env.REACT_APP_API_BACKEND}/syllabus/markTopicAsCompleted/${topic.id}`, {
            teacherId: teacher,
            completedDate: completedDate.format('YYYY-MM-DD')
        }, { headers })
            .then(() => {
                setSuccess("Topic marked as completed.");
                fetchSyallabus(subjectId); // Refresh syllabus data
                
                // Close dialog and clear success message after 2 seconds
                setTimeout(() => {
                    setSuccess("");
                    setOpen(false);
                }, 2000);
                setOpen(false);
            })
            .catch((error) => {
                setError("Error marking topic as completed.");
                
                // Clear error message after 2 seconds
                setTimeout(() => {
                    setError("");
                }, 2000);
            });
    };

    /**
     * Render the component
     * 
     * Returns a button that opens a dialog for marking topics as completed.
     * The dialog contains:
     * - Topic title display
     * - Teacher selection dropdown
     * - Date picker for completion date
     * - Submit button to mark as completed
     */
    return (
        <div>
            {/* Button to open the dialog */}
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Mark Topic Completed
            </Button>
            
            {/* Dialog for marking topic as completed */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Topic: {topic.content}</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '10px' }}>
                        {/* Teacher selection dropdown */}
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
                        
                        {/* Date picker for completion date */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={completedDate}
                                onChange={(newValue) => setCompletedDate(newValue)}
                                label="Completed Date"
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                        
                        {/* Submit button */}
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
