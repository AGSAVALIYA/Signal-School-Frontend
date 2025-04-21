import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton, Box, Skeleton, Grid, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon for Present
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Icon for Absent
import EventBusyIcon from '@mui/icons-material/EventBusy'; // Icon for Leave
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Icon for Unknown/Default

import axios from 'axios';
import { useParams } from 'react-router-dom';

// Helper function to get chip color and icon based on attendance status
const getAttendanceProps = (status) => {
  const lowerStatus = status?.toLowerCase();
  switch (lowerStatus) {
    case 'present':
      return { color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" />, label: 'Present' };
    case 'absent':
      return { color: 'error', icon: <HighlightOffIcon fontSize="small" />, label: 'Absent' };
    case 'leave':
      return { color: 'warning', icon: <EventBusyIcon fontSize="small" />, label: 'Leave' };
    default:
      return { color: 'default', icon: <HelpOutlineIcon fontSize="small" />, label: status || 'Unknown' };
  }
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};


function StudentTimeline() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const params = useParams();

  const openImageView = (imageURL) => {
    setSelectedImage(imageURL);
  };

  const closeImageView = () => {
    setSelectedImage(null);
  };

  const token = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${token}` // Corrected template literal syntax
  };

  const fetchTimeline = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_BACKEND}/studentTimeline/getAll/${params.id}`, { headers })
      .then((res) => {
        // Sort timeline data by date in descending order (most recent first)
        const sortedTimeline = (res.data.studentTimelines || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setTimeline(sortedTimeline);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching timeline:", err); // Log error details
        setTimeline([]); // Set to empty array on error
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]); // Add params.id as dependency if it can change


  return (
    <Box sx={{ backgroundColor: '#f0f2f5', borderRadius: '20px', padding: '1rem' }}> {/* Increased padding slightly */}
      <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', marginBottom: '1.5rem' }}> {/* Increased margin */}
        Student Learning Path
      </Typography>
      {loading ? (
        // Improved Skeleton layout
        <Grid container spacing={2}>
            {[1, 2, 3].map((key) => (
                <Grid item xs={12} key={key} sx={{ display: 'flex' }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }}/>
                    <Skeleton variant="rectangular" width="100%" height={100} animation="wave" />
                </Grid>
            ))}
        </Grid>
      ) : (
        timeline.length === 0 ? (
          <Paper elevation={1} sx={{ padding: 3, textAlign: 'center', borderRadius: '15px' }}>
            <Typography variant="h6" color="text.secondary">
              No timeline data available for this student yet.
            </Typography>
          </Paper>
        ) : (
          // Using position="right" might give more space for content if opposite content is just date
          <Timeline position="right">
            {timeline.map((dayData, index) => {
              const attendanceProps = getAttendanceProps(dayData.attendanceStatus);
              return (
              <TimelineItem key={dayData.id || index}> {/* Use unique ID from data if available */}
                <TimelineOppositeContent sx={{ flex: 0.2 }}> {/* Allocate less space for the date */}
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    {/* Using locale date string for better readability */}
                    {new Date(dayData.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    {/* Use attendance color for the dot for extra visual cue */}
                  <TimelineDot color={attendanceProps.color} variant="filled" />
                  {index < timeline.length - 1 && (
                    <TimelineConnector sx={{ bgcolor: 'grey.400' }} /> /* Use theme grey */
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ paddingRight: 0 }}> {/* Remove default paddingRight */}
                  <Paper elevation={1} sx={{ // Wrap content in Paper for better visual grouping
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '10px', // Space between timeline items
                    // Removed fixed width to allow responsiveness
                  }}>
                    <Grid container spacing={1.5} alignItems="flex-start">
                      {/* Attendance Status - Placed prominently */}
                      <Grid item xs={12}>
                        <Chip
                          icon={attendanceProps.icon}
                          label={attendanceProps.label}
                          color={attendanceProps.color}
                          size="small"
                          sx={{ fontWeight: 'medium' }} // Use medium weight
                        />
                      </Grid>

                       {/* Progress Notes */}
                      <Grid item xs={dayData.image ? 9 : 12}> {/* Adjust width based on image presence */}
                        <Typography variant="body1" sx={{ fontSize: '0.95rem', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {/* Handle empty progress gracefully */}
                          {dayData.progress ? dayData.progress : <Typography variant="body2" component="em" color="text.secondary">No progress notes for this day.</Typography>}
                        </Typography>
                      </Grid>

                      {/* Image Button */}
                      {dayData.image && (
                        <Grid item xs={3} container justifyContent="flex-end" alignItems="center">
                          <Button
                            variant="outlined" // Changed variant for less emphasis
                            color="primary"
                            onClick={() => openImageView(dayData.image)}
                            size="small"
                            startIcon={<VisibilityIcon />} // Use startIcon
                            sx={{ fontSize: "0.75rem", textTransform: 'none' }} // Prevent uppercase text
                            >
                            View
                          </Button>
                        </Grid>
                      )}

                      {/* Subjects */}
                      {dayData.Subjects && dayData.Subjects.length > 0 && (
                        <Grid item xs={12} sx={{ paddingTop: '10px !important' }}> {/* Ensure spacing */}
                          <Typography variant="caption" display="block" sx={{ mb: 0.5, color: 'text.secondary', fontWeight:'bold' }}>Subjects Covered:</Typography>
                          {dayData.Subjects.map((subject) => ( // Removed index from map params as key uses id/name
                            <Chip
                              key={subject.id || subject.name} // Prefer id if available
                              label={capitalizeFirstLetter(subject.name)} // Capitalize subject name
                              size="small"
                              variant="outlined" // Style subjects differently
                              sx={{ margin: '2px' }}
                            />
                          ))}
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
             );
            })}
          </Timeline>
        )
      )}
      {/* Image Viewer Dialog */}
      <Dialog open={selectedImage !== null} onClose={closeImageView} maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: '15px' } }}> {/* Slightly rounded corners */}
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
          Image Preview
          <IconButton
            aria-label="close"
            onClick={closeImageView}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers> {/* Add dividers for better separation */}
          <img src={selectedImage} alt="Student work preview" style={{ width: '100%', display: 'block', borderRadius: '8px' }} /> {/* Ensure image is block and rounded */}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default StudentTimeline;