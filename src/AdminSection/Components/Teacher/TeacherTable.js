import React from 'react';
import { Avatar, Chip, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DriveFileRenameOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TeacherTable = (props) => {
  const { teachers, loading } = props;
  const navigate = useNavigate();
  const navigateToStudent = (id) => {
    navigate(`/teachers/${id}`);
  };

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
            <TableCell align="center">Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {!loading && teachers.map((teacher) => (
            <TableRow key={teacher.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="center" >
                <Avatar src={teacher.name} sx={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontSize: "1rem" }}>
                {teacher.name}
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontSize: "1rem" }}>
                {teacher.email}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "1rem" }}>
                <DriveFileRenameOutline />
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
              </TableRow>
            </>
          )
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeacherTable;
