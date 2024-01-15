// NewStudentTab.js
import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

const NewStudentTab = ({ classes, name, selectedClass, age, dob, address, setName, setSelectedClass, setAge, setDob, setAddress, handleSubmit }) => {
  return (
    <>
      <TextField label="Name" fullWidth margin="normal" name="name" value={name} onChange={(e) => setName(e.target.value)} />
      <FormControl fullWidth margin="normal">
        <InputLabel>Class</InputLabel>
        <Select
          value={selectedClass.id}
          onChange={(e) => setSelectedClass({ name: e.target.value, id: e.target.value })}
          label="Class"
          name="class"
          //height of menu item
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          
        >
          {classes.map((classItem) => (
            <MenuItem key={classItem.id} value={classItem.id}>
              {classItem.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Age" fullWidth margin="normal" name="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      <TextField
        label="Date of Birth"
        fullWidth
        margin="normal"
        name="dob"
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        InputLabelProps={{
          shrink: true,
          style: { marginLeft: '0px' },
        }}
      />
      <TextField label="Address" fullWidth margin="normal" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <Button variant="contained" color="colors" sx={{ color: '#fff' }} onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
};

export default NewStudentTab;
