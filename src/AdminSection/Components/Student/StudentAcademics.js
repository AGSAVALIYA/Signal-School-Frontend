import React, { useState } from 'react';
import { Grid, Avatar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField } from '@mui/material';

const StudentDetails = ({ studentInfo, editMode, onEditButtonClick, onEditFieldChange, onSaveEditedInfo }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4} align="center">
        <Avatar alt={`${studentInfo && studentInfo.firstName} ${studentInfo && studentInfo.lastName}`} src={studentInfo && studentInfo.avatarUrl} sx={{ width: 150, height: 150 }} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 3 }}>
          Student Info
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {studentInfo && Object.entries(studentInfo).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        value={value}
                        onChange={(e) => onEditFieldChange(key, e.target.value)}
                      />
                    ) : (
                      value
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit button */}
        <Button variant="outlined" sx={{ mt: 2, mr: 2 }} onClick={onEditButtonClick}>
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
        {editMode && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={onSaveEditedInfo}>
            Save
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default StudentDetails;
