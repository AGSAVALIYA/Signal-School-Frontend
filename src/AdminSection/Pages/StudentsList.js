import { Box } from '@mui/material';
import React, {useEffect, useState} from 'react';
import StudentListHeader from '../Components/Student/StudentListHeader';
import dummyStudentData from './dummyStudents.json';
import StudentsTable from '../Components/Student/StudentsTable';
import axios from 'axios';

const StudentsList = () => {
    const [AllStudents, setAllStudents] = useState(dummyStudentData);
    const [filteredStudents, setFilteredStudents] = useState(dummyStudentData);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    }

    const fetchStudents = () => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BACKEND}/student/getAll`, { headers })
            .then((res) => {
                setAllStudents(res.data.students);
                setFilteredStudents(res.data.students);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        fetchStudents();
    }
        , [])

    return (
        <Box
        sx={{ backgroundColor: 'transparentBG.bgcolor', borderRadius: '20px', padding: '5px', height: '80vh', width: '100%', display: 'flex', flexDirection: 'column'}}
        >
         <StudentListHeader AllStudents={AllStudents} setFilteredStudents={setFilteredStudents} fetchStudents={fetchStudents} />

        <StudentsTable students={filteredStudents} loading={loading} fetchStudents={fetchStudents} />
    
        </Box>
    );
}


export default StudentsList;