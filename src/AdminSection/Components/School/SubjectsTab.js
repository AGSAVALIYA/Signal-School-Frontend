import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

const SubjectsTab = () => {
  const [subjects, setSubjects] = useState(['Math', 'Science']);
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = () => {
    if (newSubject.trim() !== '') {
      setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
      setNewSubject('');
    }
  };

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>
        Subjects
      </Typography>

      {subjects.map((subject) => (
        <div key={subject}>{subject}</div>
      ))}

      <div>
        <TextField
          label="New Subject"
          variant="outlined"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddSubject}>
          Add Subject
        </Button>
      </div>
    </div>
  );
};

export default SubjectsTab;
