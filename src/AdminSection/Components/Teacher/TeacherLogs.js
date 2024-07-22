import { Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import { Skeleton, Typography } from "@mui/material";

const TeacherTimeline = (props) => {
    const {teacherId, setError} = props;
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const fetchLogs = () => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/teacher/getLogs/${teacherId}`, { headers }).then((res) => {
            setLogs(res.data.logs);
            setLoading(false);
          }
          ).catch((err) => {
            setError(err.response.data.error);
            setLoading(false);
          }
          )
    }   

    useEffect(() => {
        fetchLogs();
    }
    , []);

    return(
        <div>
            <Paper sx={{backgroundColor: "transparentBG.bgcolor" , borderRadius: "20px", padding: 2, marginTop: 2}}>
            {loading ? (
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
                logs.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
                        No logs available for this teacher.
                    </Typography>
                ) : (
                    <Timeline>
                        {logs.map((log, index) => (
                            <TimelineItem key={index}>
                                <TimelineOppositeContent sx={{ py: '2px', pl: '10px' }}>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        {new Date(log.createdAt).toDateString()}
                                    </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
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