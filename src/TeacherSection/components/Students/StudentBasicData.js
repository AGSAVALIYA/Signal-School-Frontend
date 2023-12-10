import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Button,
  TextField,
  Skeleton,
  Zoom,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const StudentBasicDetails = (props) => {
  const { student, editMode, setStudent, loading, classes } = props;
  const [selectedClass, setSelectedClass] = useState({});

  const tableRowStyle = {
    height: "50px",
    width: "100%",
    fontSize: "1.2rem",
  };

  const tableCellStyle = {
    padding: "10px 16px",
    fontSize: "1.2rem",
  };


  const inputCellStyle = {
    height: "100%",
    fontSize: "1.2rem",
  };

  const [newSubject, setNewSubject] = useState("");


  const token = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${token}`,
  };





  const formatMyDate = (date) => {
    // Simulated date formatting function
    return date;
  };

  const handleClassChange = (event) => {
    const classId = event.target.value;
    const classData = classes.find((classItem) => classItem.id === classId);
    setSelectedClass(classId);
    setStudent({ ...student, Class: classData, ClassId: classId });
  }




  return (
    <Zoom in={true} timeout={300}>
    <TableContainer component={Paper} sx={{ backgroundColor: "transparentBG.bgcolor", minWidth: "300px", borderRadius: "20px" }}>
      <Table >
        <TableBody>
          
          <TableRow style={tableRowStyle} >
            <TableCell 
         style={tableCellStyle}
          
            >Class:</TableCell>
            <TableCell style={tableCellStyle}>
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
              ) : loading ? (
                <Skeleton variant="text" width={100} height={30} />
              ) : (
                <span>{student.Class.name}</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow style={tableRowStyle}>
            <TableCell style={tableCellStyle}>Age:</TableCell>
            <TableCell style={tableCellStyle}>
              {editMode ? (
                <TextField
                  variant="outlined"
                  value={student.age}
                  onChange={(e) => setStudent({ ...student, age: e.target.value })}
                  size="small"
                  sx={inputCellStyle}
                />
              ) : loading ? (
                <Skeleton variant="text" width={100} height={30} />
              ) : (
                <span>{student.age}</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow style={tableRowStyle}>
            <TableCell style={tableCellStyle}>Date of Birth:</TableCell>
            <TableCell style={tableCellStyle}>
              {editMode ? (
                <TextField
                  variant="outlined"
                  value={formatMyDate(student.dob)}
                  onChange={(e) => setStudent({ ...student, dob: e.target.value })}
                  size="small"
                  type="date"
                  sx={inputCellStyle}
                />
              ) : loading ? (
                <Skeleton variant="text" width={100} height={30} />
              ) : (
                <span>{formatMyDate(student.dob)}</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow style={tableRowStyle}>
            <TableCell style={tableCellStyle}>Address:</TableCell>
            <TableCell style={tableCellStyle}>
              {editMode ? (
                <TextField
                  variant="outlined"
                  value={student.address}
                  onChange={(e) => setStudent({ ...student, address: e.target.value })}
                  size="small"
                  sx={inputCellStyle}
                />
              ) : loading ? (
                <Skeleton variant="text" width={100} height={30} />
              ) : (
                <span>{student.address}</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow style={tableRowStyle} >
            <TableCell style={tableCellStyle}>Subject:</TableCell>
            <TableCell style={tableCellStyle} sx={{marginBottom: "20px"}}>
              
              { loading ? (
                <Skeleton variant="text" width={100} height={30} />
              ) : (
                <>
                  {student.Class.Subjects.map((subject) => (
                    <Chip
                      key={subject.id}
                      label={subject.name}
                      sx={{
                        backgroundColor: "colors.main",
                        color: "#FFFFFF",
                        borderRadius: "10px",
                        margin: "2px 4px",
                        textAlign: "center",
                        fontSize: "1rem"
                      }}
                    />
                    ))}

                </>
                )}

            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </Zoom>
  );
};

export default StudentBasicDetails;
