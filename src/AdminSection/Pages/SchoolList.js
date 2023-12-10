import { Alert, Box, Button, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const SchoolList = () => {
    const navigate = useNavigate();
    const [schools, setSchools] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchSchools = () => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/school/getAll`, { headers })
            .then(response => setSchools(response.data.schools))
            .catch(error => console.error('Error fetching schools:', error));
    }

    const switchSchool = (schoolId) => {
        axios.post(`${process.env.REACT_APP_API_BACKEND}/school/switchByAdmin/${schoolId}`, {}, { headers })
            .then(response => {
                localStorage.setItem('userInfo', JSON.stringify(response.data.data));
                setSuccess("Switched school successfully");
                setTimeout(() => {
                    setSuccess("");
                    navigate("/school");
                }, 1000);
            })
            .catch(error => {
                setError(error.response.data.error);
                setTimeout(() => {
                    setError("");
                }, 2000);
            }
            );
    }


    useEffect(() => {
        fetchSchools();
    }
        , []);

    return (
        <div>
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
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "0 20px" }}>
                <Typography variant="h3" noWrap color={'colors.main'} sx={{ flexGrow: 1, marginLeft: "10px" }}>
                    Schools
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: "colors.main", color: "white" }}
                    onClick={() => navigate("/create-school")}
                >Add School</Button>
            </div>
            <Box>
                {
                    schools.map((school) => (
                        <Box key={school.id} sx={{ backgroundColor: "transparentBG.bgcolor", borderRadius: "10px", padding: "10px 20px", boxShadow: "0px 0px 10px 0px #0000001a", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: "10px" }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <img src="https://www.maharashtratoday.co.in/wp-content/uploads/2019/01/Signal-School.jpg" alt="school" style={{ width: "40px", height: "40px", border: "1px solid #000000ff", borderRadius: "5px" }} />

                                <Typography variant="h6" noWrap component="div" color={'primary.main'} sx={{ flexGrow: 1, marginLeft: "10px" }}>
                                    {school.name}
                                </Typography>
                            </Box>
                            {/* <Button variant="contained" sx={{ backgroundColor: "colors.main", color: "white" }} onClick={() => switchSchool(school.id)}
                            >Switch</Button> */}
                            {
                                userInfo && userInfo.currentSchool && userInfo.currentSchool.id === school.id ? (
                                    <Button variant="contained" sx={{ backgroundColor: "colors.main", color: "white" }} onClick={() => navigate("/school")}
                                    >View</Button>
                                ) : (
                                    <Button variant="contained" sx={{ backgroundColor: "colors.main", color: "white" }} onClick={() => switchSchool(school.id)}
                                    >Switch</Button>
                                )
                                
                            }
                        </Box>
                    ))
                }

            </Box>

        </div>
    )
}

export default SchoolList;