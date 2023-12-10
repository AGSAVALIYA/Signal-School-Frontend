import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import dummyStudentData from './dummyStudents.json';
import TeacherListHeader from '../Components/Teacher/TeacherListHeader';
import TeacherTable from '../Components/Teacher/TeacherTable';
import axios from 'axios';

const TeachersList = () => {
    const [AllTeachers, setAllTeachers] = useState(dummyStudentData);
    const [filteredTeachers, setFilteredTeachers] = useState(dummyStudentData);
    const accessToken = localStorage.getItem('accessToken');
    const [loading, setLoading] = useState(true);

    const headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    
    const fetchTeachers = () => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BACKEND}/teacher/getAll`, { headers })
            .then((res) => {
                setAllTeachers(res.data.teachers);
                setFilteredTeachers(res.data.teachers);
                setLoading(false);
                console.log(res.data.teachers);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        fetchTeachers();
    }
        , [])



    return (
        <Box
            sx={{ backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px', padding: '5px', height: '80vh', width: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <TeacherListHeader AllTeachers={AllTeachers} setFilteredTeachers={setFilteredTeachers} fetchTeachers={fetchTeachers} />

            <TeacherTable teachers={filteredTeachers} loading={loading} />

        </Box>
    );
}


export default TeachersList;