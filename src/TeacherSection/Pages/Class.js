import { Alert, List, ListItem, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import StudentData from '../dummy/StudentChipDummy.json'
import { useNavigate } from "react-router-dom";
import { Class, Assignment, FactCheck, TaskAlt, RecentActors } from '@mui/icons-material';
import axios from "axios";

const classDData = [
    {
        name: "Class 1",
        id: 1,
    },
    {
        name: "Class 2",
        id: 2,
    },
    {
        name: "Class 3",
        id: 3,
    },
    {
        name: "Class 4",
        id: 4,
    },
    {
        name: "Class 5",
        id: 5,
    },
    {
        name: "Class 6",
        id: 6,
    },
    {
        name: "Class 7",
        id: 7,
    },
]

const Standard = () => {
    const [value, setValue] = React.useState(null);
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Authorization': `Bearer ${token}`
    }


    const fetchClassData = () => {
        setLoading(true);
        // setTimeout(()=>{
        //     setClassData(classDData);
        //     setLoading(false);
        // },500)
        axios.get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers })
            .then((res) => {
                console.log(res.data);
                // setClassData(res.data.classes);
                const sortedClasses = res.data.classes.sort((a, b) => {
                    if (a.id < b.id) {
                      return -1;
                    }
                    if (a.id > b.id) {
                      return 1;
                    }
                  });
                    setClassData(sortedClasses);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setTimeout(() => {
                setError(err.response.data.message);
                }
                , 1000);
                setLoading(false);
            })
    }

    useEffect(() => {
        fetchClassData();
    }, [])


    return (
        <div>
            {error && (
                <Alert onClose={() => setError("")} severity="error" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
                    {error}
                </Alert>
            )}

            <Typography variant="h3" sx={{ color: "colors.main", marginBottom: "10px", marginTop: "15px" }}>Classes</Typography>
            <List sx={{ bgcolor: 'transparentBG.bgcolor', padding: "10px", borderRadius: '10px' }}>
                {loading &&
                    <div>
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                    </div>
                }
                {!loading && classData.length === 0 && !loading && <div>No Class Found</div>}
                {!loading && classData.length > 0 &&
                    classData.map((item) => (
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
                                padding: "5px 10PX",
                                boxShadow: "0px 0px 10px 0px #00000030"
                            }}
                        >
                            <div>
                                {item.name}
                            </div>
                            <div>
                                <TaskAlt sx={{ marginRight: "10px", fontSize: "40px", marginRight: "30px", color: "colors.main" }} onClick={() => navigate(`/class/attendence/${item.id}`)} />
                                <RecentActors sx={{ fontSize: "40px", color: "colors.main" }} onClick={() => navigate(`/class/${item.id}`)} />
                            </div>
                        </ListItem>
                    ))}
            </List>
        </div>
    );
}

export default Standard;