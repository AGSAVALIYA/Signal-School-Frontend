import React, { useState } from 'react';
import { Avatar, Chip, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DriveFileRenameOutline, PersonOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TeacherTable = (props) => {
  const { teachers, loading } = props;
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const navigateToTeacher = (id) => {
    navigate(`/teachers/${id}`);
  };

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (teacherToDelete) {
      try {
        const accessToken = localStorage.getItem('accessToken');
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
        const response = await fetch(`${process.env.REACT_APP_API_BACKEND}/teacher/delete/${teacherToDelete.id}`, {
          method: 'DELETE',
          headers
        });
        
        if (response.ok) {
          // You might want to refresh the teachers list here
          // or call a callback function passed from parent component
          window.location.reload(); //reload the page to reflect changes
          console.log('Teacher made inactive successfully');
        } else {
          console.error('Failed to make teacher inactive');
        }
      } catch (error) {
        console.error('Error making teacher inactive:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setTeacherToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setTeacherToDelete(null);
  };

  
  const getThumbLink = (link) => {
    if(link && link.includes("ss-mumbai-faculty")) {
      return link.replace("ss-mumbai-faculty", "ss-mumbai-faculty-thumbnails");
    }
    return link;
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', borderRadius: '20px', marginTop: "5px", height: "100%" }} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: "transparentBG.bgcolor", backdropFilter: 'blur(10px)' }}>
            <TableCell align="center" >
              {/* Blank header for the Avatar */}
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Contact</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {!loading && teachers.map((teacher) => (
            <TableRow key={teacher.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="center" >
                <Avatar src={getThumbLink(teacher.imageLink)} sx={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontSize: "1rem", cursor:"pointer" }} onClick={() => navigateToTeacher(teacher.id)}>
                {teacher.name}
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontSize: "1rem" }} align='center' >
                {teacher.email ? <Chip label={teacher.email} /> : "N/A"}
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontSize: "1rem" }} align='center' >
                {teacher.contactNumber ? <Chip label={teacher.contactNumber} /> : "N/A"}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "1rem",  cursor:"pointer" }} onClick={() => navigateToTeacher(teacher.id)}>
                <DriveFileRenameOutline />
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "1rem" }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  startIcon={<PersonOff />}
                  onClick={() => handleDeleteClick(teacher)}
                  sx={{ textTransform: 'none' }}
                >
                  Make Inactive
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {loading && (
            <>
              <TableRow>
                <TableCell align="center" >
                  <Skeleton variant="circular" width={40} height={40} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" >
                  <Skeleton variant="circular" width={40} height={40} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" >
                  <Skeleton variant="circular" width={40} height={40} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={100} />
                </TableCell>
              </TableRow>
            </>
          )
          }
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Action"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to make "{teacherToDelete?.name}" inactive? 
            This action will prevent the teacher from accessing the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Make Inactive
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default TeacherTable;
