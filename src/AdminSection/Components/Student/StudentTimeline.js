import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton, Box, Skeleton, Grid, Chip, Tooltip } from '@mui/material'; // Added Tooltip
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Icon for Delete
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon for Present
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Icon for Absent
import EventBusyIcon from '@mui/icons-material/EventBusy'; // Icon for Leave
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Icon for Unknown/Default
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications

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
      // Return null or a default object if you don't want to display anything for unknown/missing status
      // return null;
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
  const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted
  const params = useParams();

  const openImageView = (imageURL) => {
    setSelectedImage(imageURL);
  };

  const closeImageView = () => {
    setSelectedImage(null);
  };

  const token = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${token}`
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
        console.error("Error fetching timeline:", err);
        toast.error("Failed to load timeline data.");
        setTimeline([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if(params.id) { // Only fetch if ID is present
        fetchTimeline();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]); // Re-fetch if the student ID changes


  const deleteTimelineItem = (itemId) => {
    if (!itemId) {
        console.error("Delete failed: Item ID is missing.");
        toast.error("Cannot delete item: ID missing.");
        return;
    }
    setDeletingId(itemId); // Indicate deletion is in progress for this item
    axios.delete(`${process.env.REACT_APP_API_BACKEND}/studentTimeline/delete/${itemId}`, { headers })
      .then(() => {
        // Update state *after* successful deletion
        setTimeline(prevTimeline => prevTimeline.filter(item => item.id !== itemId));
        toast.success("Timeline entry deleted successfully.");
        setDeletingId(null); // Reset deleting indicator
      })
      .catch((err) => {
        console.error("Error deleting timeline item:", err);
        toast.error(`Failed to delete timeline entry: ${err.response?.data?.message || err.message}`);
        setDeletingId(null); // Reset deleting indicator even on error
      });
  };

  // Removed calculateConnectorHeight as it's not used with the current layout

  return (
    // Adjusted main box styling slightly
    <Box sx={{ backgroundColor: '#f9f9f9', borderRadius: '15px', padding: '1rem', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#2c3e50', fontWeight: '600', marginBottom: '1.5rem' }}>
        Student Learning Path
      </Typography>
      {loading ? (
        // Use the improved Skeleton layout
        <Grid container spacing={2}>
            {[1, 2, 3].map((key) => (
                <Grid item xs={12} key={key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="text" width={80} sx={{ mr: 2 }} /> {/* Date Skeleton */}
                    <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }}/> {/* Dot Skeleton */}
                    <Skeleton variant="rectangular" width="calc(100% - 120px)" height={100} animation="wave" sx={{ borderRadius: '10px' }} /> {/* Content Skeleton */}
                </Grid>
            ))}
        </Grid>
      ) : (
        timeline.length === 0 ? (
          <Paper elevation={0} sx={{ padding: 3, textAlign: 'center', borderRadius: '15px', background: 'transparent' }}>
            <Typography variant="body1" color="text.secondary">
              No timeline data available for this student yet.
            </Typography>
          </Paper>
        ) : (
          // Using position="right" for better content alignment
          <Timeline position="right" sx={{ paddingLeft: 0, paddingRight: 0 }}>
            {timeline.map((dayData) => { // Removed index from map params, use dayData.id
              const attendanceProps = getAttendanceProps(dayData.attendanceStatus);
              const isDeleting = deletingId === dayData.id; // Check if this item is being deleted

              return (
              <TimelineItem key={dayData.id}> {/* Use unique ID from data */}
                <TimelineOppositeContent sx={{ flex: 0.15, pt: '12px' }}> {/* Adjusted flex and padding */}
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}> {/* Using caption for date */}
                    {new Date(dayData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    <br />
                    {new Date(dayData.date).toLocaleDateString(undefined, { year: 'numeric' })}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={attendanceProps?.color || 'primary'} // Use attendance color or default
                    variant="filled"
                    sx={{ boxShadow: 'none' }} // Remove default shadow if needed
                  />
                   {/* Only show connector if it's NOT the last item */}
                   {timeline.indexOf(dayData) < timeline.length - 1 && (
                     <TimelineConnector sx={{ bgcolor: 'grey.300' }} />
                    )}
                </TimelineSeparator>
                <TimelineContent sx={{ paddingRight: 0, paddingLeft: 2, pt: 0, pb: 3 }}>
                  <Paper elevation={1} sx={{
                    padding: '15px',
                    borderRadius: '10px',
                    position: 'relative', // Needed for absolute positioning of delete button if desired
                    opacity: isDeleting ? 0.6 : 1, // Dim item during deletion
                    transition: 'opacity 0.3s ease',
                    background: '#fff', // Ensure white background
                  }}>
                    <Grid container spacing={1.5} alignItems="flex-start">

                      {/* Attendance Status */}
                      {attendanceProps && ( // Only render chip if attendanceProps is not null
                          <Grid item xs={12} sm="auto"> {/* Auto width for chip */}
                            <Chip
                              icon={attendanceProps.icon}
                              label={attendanceProps.label}
                              color={attendanceProps.color}
                              size="small"
                              sx={{ fontWeight: 'medium', mr: 1, mb: 1 }}
                            />
                          </Grid>
                      )}

                      {/* Progress Notes take remaining space initially */}
                      <Grid item xs>
                        <Typography variant="body2" sx={{ color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 1 }}>
                          {dayData.progress ? dayData.progress : <Typography variant="body2" component="em" color="text.secondary">No progress notes.</Typography>}
                        </Typography>
                      </Grid>

                      {/* Action Buttons (View Image, Delete) */}
                      <Grid item xs={12} container spacing={1} justifyContent="flex-end" alignItems="center">
                         {/* Image Button */}
                         {dayData.image && (
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => openImageView(dayData.image)}
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    sx={{ fontSize: "0.75rem", textTransform: 'none', lineHeight: 1.5 }}
                                >
                                    View Work
                                </Button>
                            </Grid>
                         )}
                         {/* Delete Button */}
                         <Grid item>
                            <Tooltip title="Delete this entry">
                                <span> {/* Tooltip needs a span wrapper when button is disabled */}
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => deleteTimelineItem(dayData.id)}
                                        disabled={isDeleting} // Disable button during deletion
                                        sx={{
                                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } // Subtle hover effect
                                        }}
                                    >
                                        <DeleteForeverIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                         </Grid>
                      </Grid>

                      {/* Subjects */}
                      {dayData.Subjects && dayData.Subjects.length > 0 && (
                        <Grid item xs={12} sx={{ mt: 1, pt: 1, borderTop: '1px solid #eee' }}> {/* Separator line */}
                          <Typography variant="caption" display="block" sx={{ mb: 0.5, color: 'text.secondary', fontWeight:'500' }}>
                              Subjects:
                          </Typography>
                          <Box>
                            {dayData.Subjects.map((subject) => (
                                <Chip
                                key={subject.id || subject.name}
                                label={capitalizeFirstLetter(subject.name)}
                                size="small"
                                variant="outlined"
                                sx={{ margin: '2px 3px 2px 0' }} // Consistent small margin
                                />
                            ))}
                          </Box>
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
      {/* Image Viewer Dialog (using improved styling) */}
      <Dialog open={selectedImage !== null} onClose={closeImageView} maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: '15px' } }}>
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
          Image Preview
          <IconButton
            aria-label="close"
            onClick={closeImageView}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <img src={selectedImage} alt="Student work preview" style={{ width: '100%', display: 'block', borderRadius: '8px' }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default StudentTimeline;