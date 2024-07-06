import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentDataDummyData from '../dummy/StudentChipDummy.json'
import { Box, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import StudentChip from '../components/Students/StudentChip';
import axios from 'axios';
import BulkAttendence from '../components/Students/BulkAttendence';

const AttendenceClassWise = () => {
    const [studentData, setStudentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classData, setClassData] = useState([]);
    const [classLoading, setClassLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const params = useParams();
    const id = params.id;
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    }


    const getStudentData = () => {
        //sort by name
        setClassLoading(true);
        axios.get(`${process.env.REACT_APP_API_BACKEND}/student/getAll/${id}`, { headers })
            .then((res) => {
                setStudentData(res.data.students);
                setFilteredStudents(res.data.students);
                setClassData(res.data.classDetails);
                getSubjects();
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const getSubjects = () => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/subject/getAll/${id}`, { headers })
            .then((res) => {
                setSubjects(res.data.subjects);
                setClassLoading(false);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    useEffect(() => {
        getStudentData();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value === "") {
            setFilteredStudents(studentData);
        } else {
            const filteredStudents = studentData.filter((item) => {
                return item.name.toLowerCase().includes(event.target.value.toLowerCase());
            });
            setFilteredStudents(filteredStudents);
        }
    }

    // const filteredStudents = studentData.filter((item) => {
    //     return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    // });

    const fakeInputStyle = { opacity: 0, float: 'left', border: 'none', height: '0', width: '0' }


    return (
        <div>
            <div>
          
                {
                    classLoading ? <Skeleton height={"60px"} sx={{ marginTop: "15px" }} />
                        : <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {classData &&
                                <Typography variant="h3" sx={{ color: "colors.main", marginBottom: "10px", marginTop: "15px" }}>
                                    {classData.name}
                                </Typography>
                                
                            }
                            <BulkAttendence subjects={subjects} classId={id} studentData={studentData} />
                        </div>
                }
           </div>
            <TextField
                placeholder="Search by name"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: "100%", marginBottom: "30px", height: "40px" }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                    style: { borderRadius: "30px", backgroundColor: "#fff", marginBottom: "10px" },
                    autoComplete: 'off'
                }}
            />
            <Box style={{ display: "flex", flexWrap: "wrap", borderRadius: "30px", padding: "5px" }} sx={{ backgroundColor: "transparentBG.bgcolor" }}>
                {
                    loading ? <Typography variant="subtitle1" sx={{ margin: "auto" }}>Loading...</Typography>
                        :
                        filteredStudents.length === 0 ?
                            <Typography variant="subtitle1" sx={{ margin: "auto" }}>No students found</Typography>
                            :
                            filteredStudents.map((item, i) => (
                                <StudentChip key={i} 
                                name={item.name} 
                                id={item.id} 
                                image={item.imageLink} 
                                todayStatus={item.todayStatus}
                                timeline={item.StudentTimelines}
                                subjects={subjects}
                                setStudentData={setStudentData}
                                setFilteredStudents={setFilteredStudents}
                                />
                            ))

                            
                }
            </Box>

            <input type="password" name='fake-password' autoComplete='new-password' tabIndex='-1' style={{ ...fakeInputStyle }} />
        </div>
    );
}

export default AttendenceClassWise;

