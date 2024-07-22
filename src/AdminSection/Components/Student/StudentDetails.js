import React from "react";
import {
  Grid,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
  Autocomplete,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { Cancel, Delete, Edit } from "@mui/icons-material";
import UplaodAvatar from "./UploadAvatar";
import axios from "axios";

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
  setSelectedClass,
  commonSubjects
}) => {

  const handleClassChange = (event) => {
    const classId = event.target.value;
    const classData = classes.find((classItem) => classItem.id === classId);
    setSelectedClass(classId);
    onEditFieldChange("Class", classData);
    onEditFieldChange("ClassId", classId);
  };

  const [deleteConfirmation, setDeleteConfirmation] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const handleDeleteConfirmation = () => {
    setDeleteConfirmation(true);
  }
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const handleDelete = () => {
    setDeleteLoading(true);
    axios.delete(`${process.env.REACT_APP_API_BACKEND}/student/delete/${studentInfo.id}`, { headers })
      .then((res) => {
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess("");
          window.location.href = "/students";
        }, 2000);
      }
      )
      .catch((err) => {
        setError(err.response.data.error);
        setDeleteLoading(false);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
      )
  }



  return (
    <div>
      <Grid container spacing={3} marginTop={1}>
        <Grid item xs={12} md={2} align="center" sx={{ marginTop: 3 }}>
          {loading ? (
            <Skeleton variant="circular" width={150} height={150} />
          ) : (
            <Avatar
              alt={`${studentInfo && studentInfo.name}`}
              src={studentInfo && studentInfo.imageLink}
              sx={{ width: 150, height: 150 }}
            />
          )}
          <UplaodAvatar studentId={studentInfo.id} setSuccess={setSuccess} setError={setError} onEditFieldChange={onEditFieldChange} />
          {editMode ? (
            <Button variant="outlined" sx={{ marginTop: "10px" }} onClick={onEditButtonClick}>
              Cancel <Cancel sx={{ fontSize: '1.2rem', marginLeft: '5px' }} />
            </Button>
          ) : (
            <Button variant="outlined" sx={{ marginTop: "10px" }} onClick={onEditButtonClick}>
              Edit <Edit sx={{ fontSize: '1.2rem', marginLeft: '5px' }} />
            </Button>
          )}
          <br />
          {editMode && (
            <Button
              variant="contained"
              sx={{ marginTop: "5px", backgroundColor: "colors.main" }}
              onClick={onSaveEditedInfo}
            >
              Save
            </Button>
          )}
          <div>
            <Button variant="contained" sx={{ marginTop: "5px", backgroundColor: "red", color: "white" }} onClick={handleDeleteConfirmation}>
              Delete <Delete sx={{ fontSize: '1.2rem', marginLeft: '5px' }} />
            </Button>
          </div>
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
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
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
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Age
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
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
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Address
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
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
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Date of Birth
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
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
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Class
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
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
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Subjects
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {loading ? (
                      <>
                        <Skeleton width={200} height={30} />
                        <Skeleton width={200} height={30} />
                      </>
                    ) : (
                      studentInfo.Class &&
                      studentInfo.Class.Subjects &&
                      studentInfo.Class.Subjects.map((subject, index) => (
                        <Chip key={index} label={subject.name} sx={{ margin: '2px' }} />
                      ))
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Common Subjects
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={commonSubjects}
                        getOptionLabel={(option) => option.name}
                        filterSelectedOptions
                        onChange={(event, newValue) => onEditFieldChange('CommonSubjects', newValue)}
                        value={studentInfo.CommonSubjects}
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
                    ) : (
                      loading ? (<Skeleton width={200} height={30} />) :
                        studentInfo.CommonSubjects.length > 0 ?
                          studentInfo.CommonSubjects.map((subject, index) => (
                            <Chip key={index} label={subject.name} sx={{ margin: '2px' }} />
                          )) :
                          <span>No</span>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer
            sx={{
              backgroundColor: "transparentBG.bgcolor",
              borderRadius: "20px",
              padding: "10px",
              boxShadow: "inset 0px 0px 10px 0px rgba(42, 42, 42, 0.101)",
              marginTop: '20px',
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Aadhar Number
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.aadharNumber}
                        onChange={(e) =>
                          onEditFieldChange("aadharNumber", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.aadharNumber
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    PAN Card Number
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.panCardNumber}
                        onChange={(e) =>
                          onEditFieldChange("panCardNumber", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.panCardNumber
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Father's Name
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.fatherName}
                        onChange={(e) =>
                          onEditFieldChange("fatherName", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.fatherName
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Mother's Name
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.motherName}
                        onChange={(e) =>
                          onEditFieldChange("motherName", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.motherName
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Contact Number 1
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.contactNumber_1}
                        onChange={(e) =>
                          onEditFieldChange("contactNumber_1", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.contactNumber_1
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Contact Number 2
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.contactNumber_2}
                        onChange={(e) =>
                          onEditFieldChange("contactNumber_2", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.contactNumber_2
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Gender
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.gender}
                        onChange={(e) =>
                          onEditFieldChange("gender", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.gender
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                    Blood Group
                  </TableCell>
                  <TableCell sx={{ width: "70%" }}>
                    {editMode ? (
                      <TextField
                        sx={{ width: '100%' }}
                        size="small"
                        value={studentInfo.bloodGroup}
                        onChange={(e) =>
                          onEditFieldChange("bloodGroup", e.target.value)
                        }
                      />
                    ) : loading ? (
                      <Skeleton width={200} height={30} />
                    ) : (
                      studentInfo.bloodGroup
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
                  <Dialog
                    open={deleteConfirmation}
                    onClose={() => setDeleteConfirmation(false)}
                  
                  >
                    <Box sx={{ padding: '20px' , textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ marginBottom: '20px' , backgroundColor: "skyblue" , padding: '10px' , borderRadius: '10px' }}>
                        Are you sure you want to delete info of {studentInfo.name}?
                      </Typography>
                      <Button variant="contained" sx={{ marginRight: '10px' }} onClick={() => setDeleteConfirmation(false)} disabled={deleteLoading}>
                       {deleteLoading ? <CircularProgress size={24} /> : 'Cancel'}
                      </Button>
                      <Button variant="contained" sx={{ backgroundColor: 'red', color: 'white' }} onClick={handleDelete} disabled={deleteLoading}>
                        {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                      </Button>
                    </Box>
                  </Dialog>

    </div>
  );
};

export default StudentDetails;
