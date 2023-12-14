import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton, Box, Skeleton, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function StudentTimeline() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]); // Provide a default empty array
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
        setTimeline(res.data.studentTimelines || []); // Ensure that timeline is defined even if the API response doesn't have a timeline property
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Set loading to false in case of an error
      });
  };

  useEffect(() => {
    fetchTimeline();
  }, []); // Make sure to include the dependency array to avoid unnecessary re-fetching

  const calculateConnectorHeight = (currentItem, nextItem) => {
    // Implement your logic to calculate the height based on content.
    // For example, you can check the lengths of progress strings.
    const height = Math.max(currentItem.progress.length) * 1.2; // Adjust the multiplier as needed.
    return height;
  };


  return (
    <Box sx={{ backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px', padding: '1rem' }}>
      <Typography variant="h5" gutterBottom>
        Student Learning Path
      </Typography>
      {loading ? (
        <Timeline>
          {[...Array(3)].map((_, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                <Typography variant="body2">
                  <Skeleton variant="text" />
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                {index < 2 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">
                    <Skeleton variant="text" width={150} />
                  </Typography>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        timeline.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            No timeline data available for this student.
          </Typography>
        ) :
          <Timeline>
            <Grid container spacing={2}>
              {timeline.map((dayData, index) => (
                <Grid item xs={12} key={index}>
                  <Grid container alignItems="center" spacing={2}>
                    {/* Date Column */}
                    <Grid item xs={4} alignItems="right">
                      <Typography sx={{ fontSize: '1rem', textAlign: "right" }}>
                        {new Date(dayData.date).toDateString()}
                      </Typography>
                    </Grid>

                    {/* Timeline Symbol Column */}
                    <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimelineSeparator sx={{ flexDirection: 'column', textAlign: "center", margin: "auto" }}>
                        <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                        {index < timeline.length - 1 && (
                          <TimelineConnector
                            sx={{ height: `${calculateConnectorHeight(dayData, timeline[index + 1])}px` }}
                          />
                        )}
                      </TimelineSeparator>
                    </Grid>

                    {/* Data Column */}
                    <Grid  xs={6}>
                       <div style={{ display: 'flex', alignItems: 'left', textAlign: "left", flexDirection: 'column', width: '100%', flexWrap: 'wrap', hyphens: 'auto', overflowWrap: 'break-word', wordBreak: 'break-all', wordWrap: 'break-word' }}>
                        <div style={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '1rem', margin: 0, textAlign: "left" }} >{dayData.progress}</Typography>
                        </div>
                        {dayData.image && (
                          <div>
                            <Button color="primary" onClick={() => openImageView(dayData.image)} size="small">
                              <VisibilityIcon sx={{ marginRight: '5px' }} />
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    </Grid>



                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Timeline>




      )}

      <Dialog open={selectedImage !== null} onClose={closeImageView} maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
        <DialogTitle>
          Image Preview
          <IconButton edge="end" color="inherit" onClick={closeImageView} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="View" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default StudentTimeline;
