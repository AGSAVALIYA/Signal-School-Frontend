import React, { useEffect } from 'react';
import { CircularProgress, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';

const dummyData = [
  { label: 'Total Students', value: 150 },
  { label: 'Teachers', value: 12 },
  { label: 'Courses', value: 25 },
  { label: 'Events', value: 0 },
];

// Dummy data for Bar Chart
// const barChartData = {
//   xAxis: [{ scaleType: 'band', data: ['group A', 'group B'] }],
//   series: [
//     { data: [4, 3, 5], name: 'Series 1' },
//     { data: [1, 6, 3], name: 'Series 2' },
//   ],
// };

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
  const [loading, setLoading] = useState(true);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [commonSubjectsCount, setCommonSubjectsCount] = useState(0);
  const [barChartData, setBarChartData] = useState({
    xAxis: [{ scaleType: 'band', data: ['group A', 'group B'] }],
    series: [
      { data: [0, 0, 0, 0, 0, 0, 0], name: 'Series 1' },
      { data: [0, 0, 0, 0, 0, 0, 0], name: 'Series 2' },
    ],
  });

  const theme = useTheme();


  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  }

  const getDashboardData = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_BACKEND}/dashboard`, { headers })
      .then(response => {
        setStudentsCount(response.data.totalStudents);
        setTeachersCount(response.data.totalTeachers);
        setCoursesCount(response.data.totalClasses);
        setCommonSubjectsCount(response.data.totalCommonSubjects);
        setBarChartData(response.data.barChartData);
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  return (

    <Container>
      <Typography variant="h3" sx={{ mt: 3, mb: 2, color: "colors.main" }}>
        School Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
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
            <Typography variant="h6" >Total Students</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: "colors.main" }}>
              {loading ? <CircularProgress size={20} /> : studentsCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
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
            <Typography variant="h6" >Total Teachers</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: "colors.main" }}>
              {loading ? <CircularProgress size={20} /> : teachersCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
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
            <Typography variant="h6" >Total Courses</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: "colors.main" }}>
              {loading ? <CircularProgress size={20} /> : coursesCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
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
            <Typography variant="h6" >Common Subjects</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: "colors.main" }}>
              {loading ? <CircularProgress size={20} /> : commonSubjectsCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>


      {/* MUI Charts */}
      {/* <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px' }} elevation={0}>
            <Typography variant="h6" color={"colors.main"}>Bar Chart</Typography>
            <BarChart {...barChartData} width={300} height={200} color />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px' }} elevation={0}>
            <Typography variant="h6" color={"colors.main"}>Line Chart</Typography>
            <LineChart {...lineChartData} width={300} height={200} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px' }} elevation={0}>
            <Typography variant="h6" color={"colors.main"}>Pie Chart</Typography>
            <PieChart {...pieChartData} width={350} height={200} />
          </Paper>
        </Grid>
      </Grid> */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px' }} elevation={0}>
            <Typography variant="h6" color={"colors.main"}>Topic-Attendance</Typography>
            <Typography variant="body2" color={"colors.main"}>
              <span style={{ backgroundColor: "#02B2AF", padding: '5px', borderRadius: '5px', color: '#fff' }}>Topics-Done</span>
              <span style={{ backgroundColor: "#2E96FF", padding: '5px', borderRadius: '5px', color: '#fff', marginLeft: '10px' }}>Attendance</span>

            </Typography>
            <ChartsLegend {...barChartData} />
            <BarChart {...barChartData} width={1000} height={200} color >
              <ChartsLegend />
            </BarChart>
          </Paper>

        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
