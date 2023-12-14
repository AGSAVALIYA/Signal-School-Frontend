import React, { useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyData = [
  { label: 'Total Students', value: 150 },
  { label: 'Teachers', value: 12 },
  { label: 'Courses', value: 25 },
  { label: 'Events', value: 0 },
];

// Dummy data for Bar Chart
const barChartData = {
  xAxis: [{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }],
  series: [
    { data: [4, 3, 5], name: 'Series 1' },
    { data: [1, 6, 3], name: 'Series 2' },
    { data: [2, 5, 6], name: 'Series 3' },
  ],
};

// Dummy data for Line Chart
const lineChartData = {
  xAxis: [{ data: [1, 2, 3, 5, 8, 10] }],
  series: [
    {
      data: [2, 5.5, 2, 8.5, 1.5, 5],
      area: true,
      name: 'Series 1',
    },
  ],
};

// Dummy data for Pie Chart
const pieChartData = {
  series: [
    {
      data: [
        { id: 0, value: 10, label: 'Series A' },
        { id: 1, value: 15, label: 'Series B' },
        { id: 2, value: 20, label: 'Series C' },
      ],
    },
  ],
};

const Home = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();


  return (
    
    <Container>
      <Typography variant="h3" sx={{ mt: 3, mb: 2, color: "colors.main" }}>
        School Dashboard
      </Typography>
      <Grid container spacing={3}>
        {dummyData.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: 'transparentBG.bgcolor',
                borderRadius: '20px',
              }}
            >
              <Typography variant="h6" >{item.label}</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color:"colors.main"}}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* MUI Charts */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px' }} elevation={0}>
            <Typography variant="h6" color={"colors.main"}>Bar Chart</Typography>
            <BarChart {...barChartData} width={300} height={200} color/>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px' }} elevation={0}>
            <Typography variant="h6" color={"colors.main"}>Line Chart</Typography>
            <LineChart {...lineChartData} width={300} height={200} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 , backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px'}} elevation={0}>
            <Typography variant="h6" color={"colors.main"}>Pie Chart</Typography>
            <PieChart {...pieChartData} width={350} height={200} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
