import { Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import { Skeleton, Typography } from "@mui/material";

/**
 * TeacherTimeline Component
 * 
 * Displays a chronological timeline of teacher activities and logs.
 * This component fetches and presents teacher activity data in a visually
 * appealing timeline format, showing what actions the teacher has performed
 * and when they occurred.
 * 
 * Features:
 * - Fetches teacher logs from the backend API
 * - Displays logs in a Material-UI Timeline component
 * - Shows loading skeletons while data is being fetched
 * - Handles empty state when no logs are available
 * - Error handling for failed API requests
 * 
 * Props:
 * @param {string} teacherId - The ID of the teacher whose logs to display
 * @param {Function} setError - Function to display error messages in parent component
 */
const TeacherTimeline = (props) => {
    const {teacherId, setError} = props;
    
    // Component state management
    const [loading, setLoading] = useState(true); // Loading state for API request
    const [logs, setLogs] = useState([]); // Array of teacher log entries
    
    // Authentication setup for API requests
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    /**
     * Fetches teacher logs from the backend API
     * 
     * Makes a GET request to retrieve all log entries for the specified teacher.
     * Updates the component state with the fetched data or handles errors appropriately.
     */
    const fetchLogs = () => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/teacher/getLogs/${teacherId}`, { headers })
            .then((res) => {
                setLogs(res.data.logs);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response.data.error);
                setLoading(false);
            });
    }   

    // Effect hook to fetch logs when component mounts or teacherId changes
    useEffect(() => {
        fetchLogs();
    }, []);

    /**
     * Render the component
     * 
     * Returns a Paper container with a Timeline component that displays:
     * - Loading skeletons while data is being fetched
     * - A message when no logs are available
     * - Timeline items for each log entry with date, action, and description
     */
    return(
        <div>
            <Paper sx={{backgroundColor: "transparentBG.bgcolor" , borderRadius: "20px", padding: 2, marginTop: 2}}>
            {loading ? (
                // Loading state - show skeleton placeholders
                <Timeline>
                    <TimelineItem>
                        <TimelineOppositeContent sx={{ py: '2px', pl: '10px' }}>
                            <Skeleton variant="text" width={100} />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper sx={{ p: '6px 16px' }}>
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>
            ) : (
                // Check if logs exist
                logs.length === 0 ? (
                    // Empty state - no logs available
                    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
                        No logs available for this teacher.
                    </Typography>
                ) : (
                    // Display timeline with log entries
                    <Timeline>
                        {logs.map((log, index) => (
                            <TimelineItem key={index}>
                                {/* Date display on the left side of timeline */}
                                <TimelineOppositeContent sx={{ py: '2px', pl: '10px' }}>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        {new Date(log.createdAt).toDateString()}
                                    </Typography>
                                </TimelineOppositeContent>
                                
                                {/* Timeline connector elements */}
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                
                                {/* Log content on the right side */}
                                <TimelineContent>
                                    <Paper sx={{ p: '6px 16px' }}>
                                        <Typography variant="h6">{log.action}</Typography>
                                        <Typography variant="body2">{log.description}</Typography>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                )
            )}
            </Paper>
        </div>
    )
}

export default TeacherTimeline;