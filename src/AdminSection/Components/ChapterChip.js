import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import { AddCircleOutline, Delete, Edit, RemoveCircleOutline } from '@mui/icons-material';
import axios from 'axios';


const ChapterChip = ({ chapter , handleDelete}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [chapterName, setChapterName] = useState(chapter.name);
    const [topics, setTopics] = useState(chapter.Topics.map((topic) => topic.content));

    const handleChipClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const handleSave = () => {
        // axios.put(`${process.env.REACT_APP_API_BACKEND}/syllabus/update/${chapter.id}`, {
        //     chapterName: chapterName,
        //     topics: topics
        // }
        axios.put(`${process.env.REACT_APP_API_BACKEND}/syllabus/update/${chapter.id}`, {
            chapterName: chapterName,
            topics: topics
        }, { headers: headers })
            .then(() => {
                setOpenDialog(false);
            })
            .catch((error) => {
                console.error('Error updating chapter:', error);
            });
    }



    const handleAddTopic = () => {
        setTopics([...topics, '']);
    };

    const handleRemoveTopic = (index) => {
        const updatedTopics = [...topics];
        updatedTopics.splice(index, 1);
        setTopics(updatedTopics);
    };

   


    return (
        <>
            <Tooltip title={renderTopics(topics)} placement="top">
                <Chip
                    sx={{ margin: '3px', cursor: 'pointer' }}
                    label={chapterName}
                    onClick={handleChipClick}
                    icon={<Edit sx={{ fontSize: '1rem' }} />}
                    //icon position="end"  
                />
            </Tooltip>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Edit Chapter</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Chapter Name"
                        value={chapterName}
                        onChange={(e) => setChapterName(e.target.value)}
                        margin="normal"
                    />

                    {topics.map((topic, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                label={`Topic ${index + 1}`}
                                value={topic}
                                onChange={(e) => {
                                    const updatedTopics = [...topics];
                                    updatedTopics[index] = e.target.value;
                                    setTopics(updatedTopics);
                                }}
                                margin="none"
                                size="small"
                            />
                            <IconButton onClick={() => handleRemoveTopic(index)} size="small">
                                <RemoveCircleOutline />
                            </IconButton>
                        </div>
                    ))}

                    <IconButton onClick={handleAddTopic} size="small">
                        <AddCircleOutline />
                    </IconButton>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDelete(chapter.id)} color="error">
                        Delete
                        <Delete />
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save Changes

                    </Button>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const renderTopics = (topics) => {
    if (!topics || topics.length === 0) {
        return 'No topics';
    }

    return (
        <ul style={{ padding: '0 15px' }}>
            {topics.map((topic, index) => (
                <li key={index}>{topic}</li>
            ))}
        </ul>
    );
};

export default ChapterChip;
