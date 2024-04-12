import React from "react";
import {
  Grid,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Skeleton,
  Select,
    MenuItem,
    Box,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";
import { useState } from "react";
import {  Cancel, Edit } from "@mui/icons-material";
import UplaodAvatar from "./UploadAvatar";

const StudentDetails = ({
  studentInfo,
  editMode,
  onEditButtonClick,
  onEditFieldChange,
  onSaveEditedInfo,
  loading,
  classes,
  setSuccess,
  setError,
  selectedClass,
  setSelectedClass
}) => {



    const handleClassChange = (event) => {
        const classId = event.target.value;
        const classData = classes.find((classItem) => classItem.id === classId);
        setSelectedClass(classId);
        onEditFieldChange("Class", classData);
        onEditFieldChange("ClassId", classId);
    };
    


  return (
    <div>
      <Grid container spacing={3} marginTop={1}>
        <Grid item xs={12} md={2} align="center" sx={{ marginTop: 3 }}>
          {
            loading ? (<Skeleton variant="circular" width={150} height={150} />) : (
                <Avatar
                    alt={`${studentInfo && studentInfo.name}`}
                    src={studentInfo && studentInfo.imageLink}
                    sx={{ width: 150, height: 150 }}
                />
                )
          }
          <UplaodAvatar studentId={studentInfo.id}  setSuccess={setSuccess} setError={setError} onEditFieldChange={onEditFieldChange}/>
          {
            editMode ? (
              <Button variant="outlined" sx={{ marginTop: "10px" }} onClick={onEditButtonClick}>
                Cancel  <Cancel sx={{fontSize: '1.2rem', marginLeft: '5px'}}/>
              </Button>
            ) : (
                <Button variant="outlined" sx={{ marginTop: "10px" }} onClick={onEditButtonClick}>
                  Edit <Edit sx={{fontSize: '1.2rem', marginLeft: '5px'}}/>
                </Button>
                )
          }
          <br></br>
          {editMode && (
            <Button
              variant="contained"
              sx={{ marginTop: "5px", backgroundColor: "colors.main" }}
              onClick={onSaveEditedInfo}
            >
              Save
            </Button>
          )}
        </Grid>
        <Grid item xs={12} md={10}>
          <TableContainer
            sx={{
              backgroundColor: "transparentBG.bgcolor",
              borderRadius: "20px",
              padding: "10px",
              boxShadow: "inset 0px 0px 10px 0px rgba(42, 42, 42, 0.101)",
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Name
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        size="small"
                        value={studentInfo.name}
                        onChange={(e) => onEditFieldChange("name", e.target.value)}
                      />
                    ) : (
                     loading ? (<Skeleton width={200} height={30} />) : (studentInfo.name)
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Age
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        size="small"
                        value={studentInfo.age}
                        onChange={(e) => onEditFieldChange("age", e.target.value)}
                      />
                    ) : (
                      loading ? (<Skeleton width={200} height={30} />) : (studentInfo.age)
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Address
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        size="small"
                        value={studentInfo.address}
                        onChange={(e) => onEditFieldChange("address", e.target.value)}
                      />
                    ) : (
                        loading ? (<Skeleton width={200} height={30} />) : (studentInfo.address)
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Date of Birth
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        size="small"
                        value={studentInfo.dob}
                        onChange={(e) => onEditFieldChange("dob", e.target.value)}
                        type="date"
                      />
                    ) : (
                        loading ? (<Skeleton width={200} height={30} />) : (studentInfo.dob)
                        )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Class
                  </TableCell>
                  <TableCell>
                    {/* {editMode ? (
                      <TextField
                        size="small"
                        value={studentInfo.Class.name}
                        onChange={(e) => onEditFieldChange("Class", e.target.value)}
                      />
                    ) : (
                    loading ? (<Skeleton width={200} height={30} />) : (studentInfo.Class.name)
                    )} */}
                    {editMode ? (
                    <FormControl fullWidth>
                        <InputLabel>Select Class</InputLabel>
                        <Select
                            labelId="class-year-label"
                            id="class-year"
                            value={selectedClass}
                            onChange={handleClassChange}
                            label="Select Class Year"
                            size='small'
                        >
                            {classes &&
                            classes.length > 0 &&
                            classes.map(year => (
                                <MenuItem key={year.id} value={year.id}>
                                    {year.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    ) : (
                        loading ? (<Skeleton width={200} height={30} />) : (studentInfo.Class.name)
                        )}

                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Subjects 
                  </TableCell>
                  <TableCell>
                    {loading ? (<><Skeleton width={200} height={30} /><Skeleton width={200} height={30} /></>) : (
                        studentInfo.Class && 
                        studentInfo.Class.Subjects &&
                        studentInfo.Class.Subjects.map((subject, index) => (
                            // <div key={index}>{subject.name}</div>
                            <Chip key={index} label={subject.name} sx={{margin: '2px'}}/>
                        ))
                    )}

                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* <Grid item xs={12} md={12}>
          <Box sx={{ marginTop: 3 , boxShadow: 'inset 0px 0px 10px 0px rgba(42, 42, 42, 0.596)', borderRadius: '20px'}}>
                    Attendance
          </Box>
          </Grid> */}
      </Grid>
      
    </div>
  );
};

export default StudentDetails;
