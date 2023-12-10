import React from 'react';
import { Typography } from '@mui/material';

const StudentTimeline = ({ studentTimeline }) => {
  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 3 }}>
        Student Timeline
      </Typography>
      <ul>
        {studentTimeline.map((event, index) => (
          <li key={index}>
            <strong>{event.date}:</strong> {event.event}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentTimeline;
