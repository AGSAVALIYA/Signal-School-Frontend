import React, { useEffect, useState } from "react";
import StudentDataDummyData from '../dummy/StudentChipDummy.json'
import {  Alert, InputAdornment, List, ListItem, Skeleton, TextField, Typography, Zoom } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {  Search, VisibilityOutlined } from "@mui/icons-material";
import axios from "axios";
import AddNewStudent from "../components/Students/AddNewStudent";
import BulkStudent from "../components/Students/BulkStudent";

const StudentList = () => {
    const [studentData, setStudentData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [classLoading, setClassLoading] = useState(false);
    const [studentLoading, setStudentLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [error, setError] = useState(null);
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${token}`
    }

    const getStudentData = () => {
        //sort by name
        setClassLoading(true);
        setStudentLoading(true);
       
        axios.get(`${process.env.REACT_APP_API_BACKEND}/student/getAll/${id}`, { headers })
            .then((res) => {
                setStudentData(res.data.students);
                setFilteredStudents(res.data.students);
                setClassData(res.data.classDetails);
                setClassLoading(false)
                setStudentLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError("Something went wrong");
                setStudentLoading(false);
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

    

    const fakeInputStyle = { opacity: 0, float: 'left', border: 'none', height: '0', width: '0' }

    return (
        <div>
             {error && (
                <Alert onClose={() => setError("")} severity="error" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
                    {error}
                </Alert>
            )}
            <div>

                {
                    classLoading ? <Skeleton height={"60px"} sx={{ marginTop: "15px" }} />
                        : <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {classData &&
                                <Typography variant="h3" sx={{ color: "colors.main", marginBottom: "10px", marginTop: "15px" }}>
                                    {classData.name}
                                </Typography>
                            }
                            
                             {/*
                            //  Testing Pening , need to check for GRNUMBER 
                             <BulkStudent classId={id} className={classData.name} />  
                             */}
                            
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
            <div>
                <List sx={{ bgcolor: 'transparentBG.bgcolor', padding: "10px", borderRadius: '10px', overflow: "auto", maxHeight: "calc(100vh - 200px)" }}>
                    {studentLoading &&
                        <>
                            <Skeleton height={"60px"} />
                            <Skeleton height={"60px"} />
                            <Skeleton height={"60px"} />
                        </>
                    }
                    {
                        studentData.length > 0 &&
                        filteredStudents.map((item) => (
                            <ListItem
                                key={item.id}
                                sx={{
                                    backgroundColor: "transparentBG.bgcolor",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    fontSize: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "10px",
                                    boxShadow: "0px 0px 10px 0px #0000001a"
                                }}
                                onClick={() => navigate(`/student/${item.id}`)}
                            >
                                <div>
                                    {item.name}
                                </div>
                                <VisibilityOutlined sx={{ fontSize: "30px", color: "colors.main" }} />
                            </ListItem>
                        ))}

                    {
                        studentData.length === 0 && !studentLoading &&
                        <Typography variant="body3">No Students</Typography>
                    }

                </List>
                
            </div>

        
            <AddNewStudent fetchStudents={getStudentData} />
            <input type="password" name='fake-password' autoComplete='new-password' tabIndex='-1' style={{ ...fakeInputStyle }} />
        </div>
    );
}

export default StudentList;