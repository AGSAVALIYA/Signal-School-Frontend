import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const Syllabus = () => {
    const [syllabus, setSyllabus] = useState([]);
    const [loading, setLoading] = useState(true);

    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    const fetchSyllabus = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BACKEND}/syllabus/getFull`, { headers });
            setSyllabus(response.data.classes);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching syllabus:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const renderTopicsList = (topics) => {
        return (
            <List dense>
                {topics.map((topic) => (
                    <ListItem key={topic.id}>
                        <ListItemText primary={topic.content} />
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Syllabus
            </Typography>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    {syllabus.map((classItem) => (
                        <Accordion key={classItem.id} elevation={3} style={{ marginBottom: '16px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{classItem.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List style={{ width: '100%' }}>
                                    {classItem.Subjects.map((subject) => (
                                        <Accordion key={subject.id} elevation={0} style={{ marginBottom: '8px', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1">{subject.name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <List dense>
                                                    {subject.Chapters.map((chapter) => (
                                                        <ListItem key={chapter.id} disableGutters>
                                                            <ListItemText primary={chapter.name} secondary={renderTopicsList(chapter.Topics)} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Syllabus;
