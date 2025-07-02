import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import { AddCircleOutline, Delete, Edit, RemoveCircleOutline } from '@mui/icons-material';
import axios from 'axios';

/**
 * ChapterChip Component
 * 
 * A interactive chip component that displays chapter information and provides
 * editing capabilities for syllabus chapters. When clicked, it opens a dialog
 * that allows administrators to edit chapter names and manage associated topics.
 * 
 * Features:
 * - Displays chapter name as a clickable chip with edit icon
 * - Tooltip showing all topics in the chapter on hover
 * - Modal dialog for editing chapter details
 * - Add/remove topics functionality within the chapter
 * - Save changes to backend API
 * - Delete chapter capability
 * - Real-time topic list management
 * 
 * Props:
 * @param {Object} chapter - Chapter object containing id, name, and Topics array
 * @param {Function} handleDelete - Callback function to handle chapter deletion
 */
const ChapterChip = ({ chapter , handleDelete}) => {
    // Component state management
    const [openDialog, setOpenDialog] = useState(false); // Controls dialog visibility
    const [chapterName, setChapterName] = useState(chapter.name); // Editable chapter name
    const [topics, setTopics] = useState(chapter.Topics.map((topic) => topic.content)); // Array of topic strings

    /**
     * Opens the edit dialog when chip is clicked
     */
    const handleChipClick = () => {
        setOpenDialog(true);
    };

    /**
     * Closes the edit dialog without saving changes
     */
    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    
    // Authentication headers for API requests
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    /**
     * Saves the edited chapter data to the backend
     * 
     * Sends a PUT request with the updated chapter name and topics list.
     * Closes the dialog on successful save and handles errors appropriately.
     */
    const handleSave = () => {
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

    /**
     * Adds a new empty topic field to the topics array
     */
    const handleAddTopic = () => {
        setTopics([...topics, '']);
    };

    /**
     * Removes a topic from the topics array at the specified index
     * 
     * @param {number} index - Index of the topic to remove
     */
    const handleRemoveTopic = (index) => {
        const updatedTopics = [...topics];
        updatedTopics.splice(index, 1);
        setTopics(updatedTopics);
    };

    /**
     * Renders the chapter chip with tooltip and edit dialog
     */
    return (
        <>
            {/* Chapter chip with tooltip showing topics */}
            <Tooltip title={renderTopics(topics)} placement="top">
                <Chip
                    sx={{ margin: '3px', cursor: 'pointer' }}
                    label={chapterName}
                    onClick={handleChipClick}
                    icon={<Edit sx={{ fontSize: '1rem' }} />}
                />
            </Tooltip>

            {/* Edit dialog for chapter and topics */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Edit Chapter</DialogTitle>
                <DialogContent>
                    {/* Chapter name input field */}
                    <TextField
                        fullWidth
                        label="Chapter Name"
                        value={chapterName}
                        onChange={(e) => setChapterName(e.target.value)}
                        margin="normal"
                    />

                    {/* Dynamic topic input fields */}
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
                            {/* Remove topic button */}
                            <IconButton onClick={() => handleRemoveTopic(index)} size="small">
                                <RemoveCircleOutline />
                            </IconButton>
                        </div>
                    ))}

                    {/* Add new topic button */}
                    <IconButton onClick={handleAddTopic} size="small">
                        <AddCircleOutline />
                    </IconButton>
                </DialogContent>
                
                {/* Dialog action buttons */}
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

/**
 * Helper function to render topics list for tooltip
 * 
 * @param {Array} topics - Array of topic strings
 * @returns {JSX.Element|string} Formatted topics list or "No topics" message
 */
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
