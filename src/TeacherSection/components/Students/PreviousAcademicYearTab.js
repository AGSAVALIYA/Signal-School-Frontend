// PreviousAcademicYearTab.js
import React from 'react';
import {
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import axios from 'axios';

const PreviousAcademicYearTab = ({ searchedNames, loading, name, classes, selectedClass, age, dob, address, setName, setSelectedClass, setAge, setDob, setAddress, handleNameSearch, handleSubmit, headers, setGRNo }) => {
  return (
    <>
      <Autocomplete
        value={name}
        onChange={(e, newValue) => {
          setName(newValue);
          if (newValue) {
            // Fetch details for the selected ID
            axios
              .get(`${process.env.REACT_APP_API_BACKEND}/student/get/${newValue.id}`, { headers })
              .then((res) => {
                const studentDetails = res.data.student;
                setSelectedClass({ name: studentDetails.className, id: studentDetails.ClassId });
                setAge(studentDetails.age);
                setDob(new Date(studentDetails.dob).toISOString().split('T')[0]);
                setAddress(studentDetails.address);
                setGRNo(studentDetails.GRNumber);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }}
        options={searchedNames}
        loading={loading}
        onInputChange={(e, value) => {
          handleNameSearch(value);
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Name" fullWidth margin="normal" name="name" />}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Class</InputLabel>
        <Select
          value={selectedClass.id}
          onChange={(e) => setSelectedClass({ name: e.target.value, id: e.target.value })}
          label="Class"
          name="class"
          //if no value then disable
          disabled={!name}
        >
          {classes.map((classItem) => (
            <MenuItem key={classItem.id} value={classItem.id}>
              {classItem.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Age" fullWidth margin="normal" name="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} disabled />
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
        disabled
      />
      <TextField label="Address" fullWidth margin="normal" name="address" value={address} onChange={(e) => setAddress(e.target.value)} disabled />
      <Button variant="contained" color="colors" sx={{ color: '#fff' }} onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
};

export default PreviousAcademicYearTab;
