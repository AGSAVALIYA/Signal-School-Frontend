import React, { useState } from 'react';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';

function StudentTimeline() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const dummyData = [
    {
      date: new Date(2023, 9, 16),
      activities: ['Learned ABC', 'Learned Addition'],
    },
    {
        date: new Date(2023, 9, 16),
        activities: ['Learned ABC', 'Learned Addition'],
        image: 'https://cdn3.vectorstock.com/i/1000x1000/66/07/children-drawing-vector-2276607.jpg', // Set to null if no image
      },
    {
      date: new Date(2023, 9, 17),
      activities: ['Learned Shapes', 'Learned Subtraction'],
    },
    {
      date: new Date(2023, 9, 18),
      activities: ['Learned Colors', 'Practice Multiplication'],
      image: 'https://t3.ftcdn.net/jpg/05/74/59/94/360_F_574599444_KdhVklOr3PTUyMlq7079mbrFXyB0lFXf.jpg'
    },
    {
      date: new Date(2023, 9, 19),
      activities: ['Learned Numbers', 'Solve Math Problems'],
    },
    {
      date: new Date(2023, 9, 20),
      activities: ['Learned Vocabulary', 'Read a Book'],
    },
    {
      date: new Date(2023, 9, 21),
      activities: ['Science Experiments', 'Write an Essay'],
    },
    {
      date: new Date(2023, 9, 22),
      activities: ['Outdoor Activities', 'Review Week\'s Work'],
    },
  ];
  const openImageView = (imageURL) => {
    setSelectedImage(imageURL);
  };

  const closeImageView = () => {
    setSelectedImage(null);
  };

  return (
     <Box sx={{backgroundColor: "transparentBG.bgcolor", borderRadius: "20px", padding: "1rem"}}>
        <Typography variant="h5" gutterBottom>
          Student Learning Path
        </Typography>
        <Timeline>
          {dummyData.map((dayData, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                <Typography variant="body2">{dayData.date.toDateString()}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                {index < dummyData.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">
                    {dayData.activities.join(', ')}
                    {dayData.image && (
                      <Button
                        color="primary"
                        onClick={() => openImageView(dayData.image)}
                        size='small'
                      >
                        <VisibilityIcon sx={{ marginRight: '5px' }} />
                        View
                      </Button>
                    )}
                  </Typography>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
 
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