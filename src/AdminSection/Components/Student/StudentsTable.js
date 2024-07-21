import React from 'react';
import { Avatar, Chip, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DriveFileRenameOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StudentsTable = (props) => {
  const { students, loading } = props;
  const navigate = useNavigate();

  if (students.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
        No students match the current filter criteria.
      </Typography>
    );
  }
  const navigateToStudent = (id) => {
    navigate(`/students/${id}`);
  };


  const getThumbLink = (link) => {
    if(link && link.includes("ss-mumbai-avatar")) {
      return link.replace("ss-mumbai-avatar", "ss-mumbai-avatar-thumbnails");
    }
    return link;
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', borderRadius: '20px',  marginTop: "5px", height: "100%" }} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: "transparentBG.bgcolor", backdropFilter: 'blur(10px)'}}>
            <TableCell align="center" >
              {/* Blank header for the Avatar */}
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="center">Class</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {!loading && students.map((student) => (
            <TableRow key={student.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} onClick={() => navigateToStudent(student.id)}>
              <TableCell align="right"  sx={{width: "10%", padding: "0 0 0 50px"}} >
                {/* <img
                  src={student.image}
                  alt={`${student.name}'s Avatar`}
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                /> */}
                {/* <Avatar src={student.imageLink} sx={{ width: '40px', height: '40px', borderRadius: '50%' }} /> */}
                <Avatar src={getThumbLink(student.imageLink)} sx={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              </TableCell>
              <TableCell component="th" scope="row" sx={{fontSize: "1rem", cursor: "pointer"}} onClick={() => navigateToStudent(student.id)}>
                {student.name}
              </TableCell>
              <TableCell align="center" sx={{fontSize: "1rem"}}>{student.Class.name}</TableCell>
              <TableCell align="center" sx={{fontSize: "1rem"}}>
                {/* <Chip label="Present" color="success"  sx={{borderRadius: "10px", backgroundColor: "#6cbf6c", fontWeight: "500"}}/>
                <Chip label="Absent" color="success"  sx={{borderRadius: "10px", backgroundColor: "#6cb5bf", fontWeight: "500"}}/> */}
                {
                  student.todayStatus === "present" ? <Chip label="Present" color="success"  sx={{borderRadius: "10px", backgroundColor: "#6cbf6c", fontWeight: "500"}}/> 
                  : 
                  <Chip label="Absent" color="success"  sx={{borderRadius: "10px", backgroundColor: "#6cb5bf", fontWeight: "500"}}/>
                }
              </TableCell>
              <TableCell align="center" sx={{fontSize: "1rem"}}>
                <DriveFileRenameOutline />
              </TableCell>
            </TableRow>
          ))}
          {loading && (
            <>
            <TableRow>
              <TableCell align="center" >
                <Skeleton variant="circular" width={40} height={40} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell component="th" scope="row">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" >
                <Skeleton variant="circular" width={40} height={40} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell component="th" scope="row">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" >
                <Skeleton variant="circular" width={40} height={40} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell component="th" scope="row">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} sx={{margin: "auto"}} />
              </TableCell>
            </TableRow>


            </>
          )}

        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentsTable;
