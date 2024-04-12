import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton, Box, Skeleton, Grid, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Existing imports...

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
    'Authorization': `Bearer ${token}`
  };

  const fetchTimeline = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_BACKEND}/studentTimeline/getAll/${params.id}`, { headers })
      .then((res) => {
        setTimeline(res.data.studentTimelines || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const deleteTimelineItem = (index) => {
    axios.delete(`${process.env.REACT_APP_API_BACKEND}/studentTimeline/delete/${timeline[index].id}`, { headers })
      .then(() => {
    const updatedTimeline = [...timeline];
    updatedTimeline.splice(index, 1); // Remove the item at 'index'
    setTimeline(updatedTimeline);
  }
  )
      .catch((err) => {
        console.log(err);
      });
  };
  const calculateConnectorHeight = (currentItem, nextItem) => {
    // Assuming progress is a string, we can calculate height based on its length
    const lineHeight = 20; // Adjust as needed
    const maxLines = 3; // Maximum number of lines to show
    const lines = Math.min(currentItem.progress.split('\n').length, maxLines); // Splitting progress into lines and taking minimum of maxLines
    return lineHeight * lines;
  };
  return (
    <Box sx={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', marginBottom: '1rem' }}>
        Student Learning Path
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={400} animation="wave" />
      ) : (
        timeline.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            No timeline data available for this student.
          </Typography>
        ) : (
          <Timeline>
            {timeline.map((dayData, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    {new Date(dayData.date).toDateString()}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  {index < timeline.length - 1 && (
                    <TimelineConnector sx={{ backgroundColor: '#ccc', height: calculateConnectorHeight(dayData) }} />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#ffffffc1', padding: '10px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '50vw' }}>
                    <Grid container alignItems="center" spacing={2} >
                      <Grid item xs={12} sm={9}>
                        <Typography variant="body1" sx={{ fontSize: '1rem', margin: 0, color: '#333' }}>
                          {dayData.progress}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        {dayData.image && (
                          <Button color="primary" onClick={() => openImageView(dayData.image)} size="small" sx={{ fontSize: "10px", backgroundColor: '#3d8300ff', color: '#fff', '&:hover': { backgroundColor: '#1565c0' } }}>
                            <VisibilityIcon sx={{ marginRight: '5px', fontSize: '1rem' }} />
                            View
                          </Button>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        {dayData.Subjects && dayData.Subjects.map((subject, index) => (
                          <Chip key={index} label={subject.name} sx={{ margin: '5px 5px 5px 0' }} />
                        ))}
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => deleteTimelineItem(index)}
                          sx={{ fontSize: '10px', backgroundColor: '#ff0000', color: '#fff', '&:hover': { backgroundColor: '#c70039' } }}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )
      )}
      <Dialog open={selectedImage !== null} onClose={closeImageView} maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
        <DialogTitle>
          Image Preview
          <IconButton edge="end" color="inherit" onClick={closeImageView} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="View" style={{ width: '100%', borderRadius: '10px' }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default StudentTimeline;
