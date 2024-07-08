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
  Autocomplete,
} from "@mui/material";
import axios from "axios";

const StudentBasicDetails = (props) => {
  const { student, editMode, setStudent, loading, classes,commonSubjects } = props;
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
    <>
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
          <TableRow style={tableRowStyle}>
            <TableCell style={tableCellStyle}>Common Subjects:</TableCell>
            <TableCell style={tableCellStyle}>
              {editMode ? (
                //auto complete with chips AND MULTIPLE and set in student basic details CommonSubjects: []
                <Autocomplete 
                multiple
                id="tags-outlined"
                options={commonSubjects}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                onChange={(event, newValue) => {
                  setStudent({ ...student, CommonSubjects: newValue });
                }}
                value={student.CommonSubjects}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Common Subjects"
                    size="small"
                    placeholder="Select Common Subjects"
                  />
                )}
              />
              ) : loading ? (
                <Skeleton variant="text" width={100} height={30} />
              ) : (
                <span>
                  {student.CommonSubjects.length > 0
                    ? student.CommonSubjects.map((subject) => (
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
                      ))
                    : "No"}
                </span>
              )}

            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </Zoom>
    <Zoom in={true} timeout={300}>
    <TableContainer component={Paper} sx={{ backgroundColor: "transparentBG.bgcolor", minWidth: "300px", borderRadius: "20px", marginTop: "10px" }}>

    <Table>
      <TableBody>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Aadhar Number:</TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <TextField
                variant="outlined"
                value={student.aadharNumber}
                onChange={(e) => setStudent({ ...student, aadharNumber: e.target.value })}
                size="small"
                sx={inputCellStyle}
              />
            ) : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.aadharNumber}</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Pan Card Number:</TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <TextField
                variant="outlined"
                value={student.panCardNumber}
                onChange={(e) => setStudent({ ...student, panCardNumber: e.target.value })}
                size="small"
                sx={inputCellStyle}
              />
            ) : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.panCardNumber}</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Father Name:</TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <TextField
                variant="outlined"
                value={student.fatherName}
                onChange={(e) => setStudent({ ...student, fatherName: e.target.value })}
                size="small"
                sx={inputCellStyle}
              />
            ) : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.fatherName}</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Mother Name:</TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <TextField
                variant="outlined"
                value={student.motherName}
                onChange={(e) => setStudent({ ...student, motherName: e.target.value })}
                size="small"
                sx={inputCellStyle}
              />
            )
            : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.motherName}</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Contact Number 1:</TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <TextField
                variant="outlined"
                value={student.contactNumber_1}
                onChange={(e) => setStudent({ ...student, contactNumber_1: e.target.value })}
                size="small"
                sx={inputCellStyle}
              />
            ) : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.contactNumber_1}</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Contact Number 2:</TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <TextField
                variant="outlined"
                value={student.contactNumber_2}
                onChange={(e) => setStudent({ ...student, contactNumber_2: e.target.value })}
                size="small"
                sx={inputCellStyle}
              />
            ) : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.contactNumber_2}</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Gender: </TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <Select
                value={student.gender}
                onChange={(e) => setStudent({ ...student, gender: e.target.value })}
                size="small"
                sx={inputCellStyle}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            ) : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.gender}</span>
            )}
          </TableCell>
        </TableRow>
        <TableRow style={tableRowStyle}>
          <TableCell style={tableCellStyle}>Blood Group:</TableCell>
          <TableCell style={tableCellStyle}>
            {editMode ? (
              <TextField
                variant="outlined"
                value={student.bloodGroup}
                onChange={(e) => setStudent({ ...student, bloodGroup: e.target.value })}
                size="small"
                sx={inputCellStyle}
              />
            ) : loading ? (
              <Skeleton variant="text" width={100} height={30} />
            ) : (
              <span>{student.bloodGroup}</span>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </TableContainer>




    </Zoom>
    </>
  );
};

export default StudentBasicDetails;
