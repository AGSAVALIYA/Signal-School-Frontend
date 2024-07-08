import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Alert,
} from '@mui/material';
import StudentDetails from '../Components/Student/StudentDetails';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import StudentTimeline from '../Components/Student/StudentTimeline';


const studentTimeline = [
  { date: '2023-01-01', event: 'Joined the school' },
  { date: '2023-03-15', event: 'Participated in Science Fair' },
  { date: '2023-05-20', event: 'Achieved 1st position in Math Olympiad' },
];

const studentAcademics = [
  { subject: 'Mathematics', grade: 'A' },
  { subject: 'Science', grade: 'B' },
  { subject: 'English', grade: 'A' },
  { subject: 'History', grade: 'B' },
];

const StudentInfoPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState({});
  const [commonSubjects, setCommonSubjects] = useState([]);



  const params = useParams();


  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditButtonClick = () => {
    if (!editMode) {
      //fetch classes
      axios.get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers })
        .then((res) => {
          setClasses(res.data.classes);
        })
        .catch((err) => {
          console.log(err);
        });
      //fetch common subjects
      axios.get(`${process.env.REACT_APP_API_BACKEND}/commonsubject/getAll`, { headers }).then((res) => {
        setCommonSubjects(res.data.commonSubjects);
      }
      ).catch((err) => {
        setError(err.response.data.error);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
      )
    }
    setEditMode(!editMode);
  };

  const handleEditFieldChange = (field, value) => {
    setEditedInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const saveEditedInfo = () => {
    if(editedInfo.aadharNumber && editedInfo.aadharNumber.length !== 12){
      setError("Aadhar number should be 12 digits");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    axios.put(`${process.env.REACT_APP_API_BACKEND}/student/update/${params.id}`, editedInfo, { headers })
      .then((res) => {
        setSuccess(res.data.message);
        setEditMode(false);
        setTimeout(() => {
          setSuccess("");
        }
          , 2000);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setTimeout(() => {
          setError("");
        }
          , 2000);
      });
  };

  const fetchStudentInfo = () => {
    // Add logic to fetch student information (e.g., make an API call)
    axios.get(`${process.env.REACT_APP_API_BACKEND}/student/get/${params.id}`, { headers })
      .then((res) => {
        setEditedInfo(res.data.student);
        setSelectedClass(res.data.student.ClassId);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.error);
        setTimeout(() => {
          setError("");
        }
          , 2000);
      });
  };


  useEffect(() => {
    fetchStudentInfo();
  }
    , []);
  return (
    <Container>
      {success && (
        <Alert onClose={() => setSuccess("")} severity="success" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert onClose={() => setError("")} severity="error" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
          {error}
        </Alert>
      )}
      <Paper elevation={0} sx={{ padding: 3, marginTop: 3, backgroundColor: "transparentBG.bgcolor", borderRadius: "20px" }}>
        <Typography variant="h4" sx={{ marginBottom: 2, color: "colors.main" }}>
          Student Dashboard
        </Typography>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="secondary" centered>
          <Tab label="Info" />
          <Tab label="Timeline" />
          <Tab label="Academics" />
        </Tabs>

        {/* Tab Content */}
        {activeTab === 0 && (
          <StudentDetails
            studentInfo={editedInfo}
            editMode={editMode}
            onEditButtonClick={handleEditButtonClick}
            onEditFieldChange={handleEditFieldChange}
            onSaveEditedInfo={saveEditedInfo}
            classes={classes}
            loading={loading}
            setSuccess={setSuccess}
            setError={setError}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            commonSubjects={commonSubjects}
            
          />

        )}

        {activeTab === 1 && (
          // <div style={{ marginTop: "20px", boxShadow: "inset 0px 0px 10px 0px rgba(42, 42, 42, 0.101)", borderRadius: "20px" }}>
          <div style={{ marginTop: "20px", boxShadow: "inset 0px 0px 10px 0px rgba(42, 42, 42, 0.596)", borderRadius: "20px" }}>
            <StudentTimeline />
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 3 }}>
              Student Academics
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Grade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentAcademics.map((subject, index) => (
                    <TableRow key={index}>
                      <TableCell>{subject.subject}</TableCell>
                      <TableCell>{subject.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}


      </Paper>
    </Container>
  );
};

export default StudentInfoPage;
