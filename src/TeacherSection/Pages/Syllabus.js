import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Button, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { CheckCircleOutline, RemoveDoneRounded } from '@mui/icons-material';
import dayjs from 'dayjs';

/**
 * Syllabus Component (Teacher Section)
 * 
 * This component provides teachers with an interface to view and manage their assigned syllabus.
 * Teachers can see all classes, subjects, chapters, and topics, and can mark topics as completed
 * or remove completion status for topics they have previously marked.
 * 
 * Key Features:
 * - Displays hierarchical syllabus structure (Classes > Subjects > Chapters > Topics)
 * - Allows teachers to mark topics as completed with timestamp
 * - Allows teachers to unmark topics they previously completed
 * - Shows completion status with visual indicators
 * - Handles success and error states with alert messages
 * - Responsive accordion-based layout for easy navigation
 */
const Syllabus = () => {
    // Component state management
    const [syllabus, setSyllabus] = useState([]); // Hierarchical syllabus data structure
    const [loading, setLoading] = useState(true); // Loading state for initial data fetch
    const [success, setSuccess] = useState(''); // Success message for user feedback
    const [error, setError] = useState(''); // Error message for user feedback

    // Authentication and user information
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    const teacherId = JSON.parse(localStorage.getItem('userInfo')).id;
    
    /**
     * Fetches the complete syllabus structure from the API
     * 
     * Retrieves all classes with their subjects, chapters, and topics.
     * Updates the loading state and handles any errors that occur during the fetch.
     */
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

    // Effect hook to load syllabus data when component mounts
    useEffect(() => {
        fetchSyllabus();
    }, []);

    /**
     * Renders the list of topics for a given chapter
     * 
     * For each topic, displays:
     * - Topic content/name
     * - Completion status (checkmark if completed, "Mark Done" button if not)
     * - Option to remove completion if the current teacher marked it as done
     * 
     * @param {Array} topics - Array of topic objects with completion information
     * @returns {JSX.Element} Rendered list of topics with interaction controls
     */
    const renderTopicsList = (topics) => {
        return (
            <div>
                {topics.map((topic) => (
                    <div key={topic.id} style={{ 
                        backgroundColor: '#f9f9f9', 
                        borderRadius: '8px', 
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', 
                        padding: '8px', 
                        marginBottom: '4px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {/* Topic content */}
                            <div>{topic.content} </div>
                            <div style={{ marginLeft: '2px' }}>
                                {topic.completedBy ? (
                                    // Show checkmark if topic is completed
                                    <CheckCircleOutline color='success' />
                                ) : (
                                    // Show "Mark Done" button if topic is not completed
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        sx={{ padding: '0 4px', fontSize: '12px', textTransform: 'none', marginLeft: '8px' }}
                                        onClick={() => handleMarkAsCompleted(topic.id)}
                                    >Mark Done</Button>
                                )}
                            </div>
                        </div>
                        <div>
                            {/* Show remove button only if current teacher marked this topic as completed */}
                            {topic.completedBy && topic.Teacher && topic.Teacher.id === teacherId &&
                                <RemoveDoneRounded onClick={() => handleUnMarkAsCompleted(topic.id)} />
                            }
                        </div>
                    </div>
                ))}
            </div>
        );
    };
                                )}
                            </div>
                        </div>
                        <div>
                            {topic.completedBy && topic.Teacher && topic.Teacher.id === teacherId &&
                                <RemoveDoneRounded onClick={() => handleUnMarkAsCompleted(topic.id)} />
                            }
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handleMarkAsCompleted = async (topicId) => {
        try {
            const completedDate = dayjs().format('YYYY-MM-DD');
            const data = {
                teacherId,
                completedDate
            };
            axios.post(`${process.env.REACT_APP_API_BACKEND}/syllabus/markTopicAsCompleted/${topicId}`, data, { headers })
                .then((response) => {
                    const updatedSyllabus = syllabus.map((classItem) => {
                        const updatedSubjects = classItem.Subjects.map((subject) => {
                            const updatedChapters = subject.Chapters.map((chapter) => {
                                const updatedTopics = chapter.Topics.map((topic) => {
                                    if (topic.id === topicId) {
                                        return { ...topic, completedBy: teacherId, Teacher: { id: teacherId } };
                                    }
                                    return topic;
                                }
                                );
                                return { ...chapter, Topics: updatedTopics };
                            }
                            );
                            return { ...subject, Chapters: updatedChapters };
                        }
                        );
                        return { ...classItem, Subjects: updatedSubjects };
                    }
                    );
                    setSuccess('Topic marked as completed');
                    setSyllabus(updatedSyllabus);
                    setTimeout(() => {
                        setSuccess('');
                    }, 2000);
                })
        } catch (error) {
            console.error('Error marking topic as completed:', error);
            setError('Error marking topic as completed');
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    }

    const handleUnMarkAsCompleted = async (topicId) => {
        try {
            axios.post(`${process.env.REACT_APP_API_BACKEND}/syllabus/unMarkTopicAsCompleted/${topicId}`, {}, { headers })
                .then((response) => {
                    const updatedSyllabus = syllabus.map((classItem) => {
                        const updatedSubjects = classItem.Subjects.map((subject) => {
                            const updatedChapters = subject.Chapters.map((chapter) => {
                                const updatedTopics = chapter.Topics.map((topic) => {
                                    if (topic.id === topicId) {
                                        return { ...topic, completedBy: null };
                                    }
                                    return topic;
                                });
                                return { ...chapter, Topics: updatedTopics };
                            });
                            return { ...subject, Chapters: updatedChapters };
                        });
                        return { ...classItem, Subjects: updatedSubjects };
                    });
                    setSuccess('Topic marked as incomplete');
                    setSyllabus(updatedSyllabus);
                    setTimeout(() => {
                        setSuccess('');
                    }, 2000);
                })
        } catch (error) {
            console.error('Error marking topic as incomplete:', error);
            setError('Error marking topic as incomplete');
            setTimeout(() => {
                setError('');
            }
                , 2000);
        }
    }


    return (
        <div style={{ padding: '20px 0px', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Syllabus
            </Typography>
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
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    {syllabus.map((classItem) => (
                        <Accordion key={classItem.id} elevation={3} style={{ marginBottom: '16px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{classItem.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ width: '100%' }}>
                                    {classItem.Subjects.map((subject) => (
                                        <Accordion key={subject.id} elevation={0} style={{ marginBottom: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)' }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1">{subject.name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div style={{ width: '100%' }}>
                                                    {subject.Chapters.map((chapter) => (
                                                        <Accordion key={chapter.id} elevation={0} style={{ marginBottom: '8px', borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }}>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                                <Typography>{chapter.name}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {renderTopicsList(chapter.Topics)}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Syllabus;
