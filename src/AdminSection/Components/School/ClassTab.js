import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

const ClassTab = () => {
  const [classes, setClasses] = useState(['Class A', 'Class B']);
  const [newClass, setNewClass] = useState('');

  const handleAddClass = () => {
    if (newClass.trim() !== '') {
      setClasses((prevClasses) => [...prevClasses, newClass]);
      setNewClass('');
    }
  };

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>
        Classes
      </Typography>

      {classes.map((className) => (
        <div key={className}>{className}</div>
      ))}

      <div>
        <TextField
          label="New Class"
          variant="outlined"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddClass}>
          Add Class
        </Button>
      </div>
    </div>
  );
};

export default ClassTab;
