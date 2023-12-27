
import { Box, Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AcademicDetails = (props) => {
    const { studentBasicData, studentDataLoading } = props
    const [addDialog, setAddDialog] = useState(false);
    const [reportType, setReportType] = useState("");
    const [content, setContent] = useState("");
    const [grade, setGrade] = useState("");
    const [subject, setSubject] = useState(null);
    const [currentAYReports, setCurrentAYReports] = useState([]);




    const params = useParams();
    const studentId = params.id;



    const handleAddDialog = () => {
        setAddDialog(true);
    }
    const token = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const handleAddReport = () => {
        // const { reportType, content, grade, studentId, subjectId} = req.body;
        const report = {
            reportType,
            content,
            grade,
            studentId,
            subjectId: subject
        }
        axios.post(`${process.env.REACT_APP_API_BACKEND}/report/create`, report, { headers }).then((res) => {
            console.log(res.data);
            setAddDialog(false);
        }
        ).catch((err) => {
            console.log(err);
        }
        )

        setAddDialog(false);
    }

    const handleClose = () => {
        setReportType("");
        setContent("");
        setGrade("");
        setSubject(null);

        setAddDialog(false);
    }

    const fetchCurrentAYReports = () => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/report/getForCurrAY/${studentId}`, { headers }).then((res) => {
            console.log(res.data);
            setCurrentAYReports(res.data.data);
        }
        ).catch((err) => {
            console.log(err);
        }
        )
    }

    useEffect(() => {
        fetchCurrentAYReports();
    }
        , [studentId]
    )

    return (
        <div>
            <Box sx={{ backgroundColor: "transparentBG.bgcolor", mt: "10px", borderRadius: "20px", padding: "10px 15px" }}>
                <Typography variant="h5" sx={{ color: "#000", textAlign: "center" }}>Academic Details</Typography>

                {currentAYReports.length > 0 ? (
  <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    {currentAYReports.map((report) => (
      <Box
        key={report.id} // Assuming each report has a unique identifier
        sx={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "12px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography variant="h6" sx={{ color: "#333" }}>
            Report Type: {report.reportType}
          </Typography>
        </Box>
        <Box sx={{ padding: "12px" }}>
          <Typography variant="body1" sx={{ color: "#555" }}>
            Content: {report.content}
          </Typography>
          <Typography variant="body1" sx={{ color: "#555" }}>
            Grade: {report.grade}
          </Typography>
          <Typography variant="body1" sx={{ color: "#555" }}>
            Subject: {report.Subject.name}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
) : (
  <Typography variant="body1" sx={{ color: "#555" }}>
    No Academic Details
  </Typography>
)}


                <Button onClick={handleAddDialog} sx={{ width: '100%', backgroundColor: "colors.main", color: "#fff", borderRadius: "20px", mt: "15px" }} variant="contained"
                    disabled={studentDataLoading}
                >Add</Button>
            </Box>
            <Dialog open={addDialog} onClose={() => setAddDialog(false)} sx={{"& .MuiDialog-paper": {
      borderRadius: "20px",
    }}}>
                <DialogContent sx={{borderRadius: "20px" }}>
                    <Typography variant="h6">Add Academic Detail</Typography>
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel id="report-type-label">Report Type</InputLabel>
                        <Select
                            labelId="report-type-label"
                            id="report-type"
                            value={reportType}
                            label="Report Type"
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <MenuItem value="s1">Semester 1</MenuItem>
                            <MenuItem value="s2">Semester 2</MenuItem>
                            <MenuItem value="annual">Annual</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel id="grade-label">Grade</InputLabel>
                        <Select
                            labelId="grade-label"
                            id="grade"
                            value={grade}
                            label="Grade"
                            onChange={(e) => setGrade(e.target.value)}
                        >
                            <MenuItem value="A">A</MenuItem>
                            <MenuItem value="B">B</MenuItem>
                            <MenuItem value="C">C</MenuItem>
                            <MenuItem value="D">D</MenuItem>
                            <MenuItem value="E">E</MenuItem>
                            <MenuItem value="F">F</MenuItem>
                        </Select>
                    </FormControl>
                    { studentBasicData && studentBasicData.Class &&
                        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel id="subject-label">Subject</InputLabel>
                        <Select
                            labelId="subject-label"
                            id="subject"
                            value={subject}
                            label="Subject"
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            {studentBasicData.Class.Subjects.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    }

                    <TextField
                        fullWidth
                        label="Content"
                        multiline
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                
                    <Box sx={{ textAlign: "center" }}>
                        <Button onClick={handleClose} variant="outlined" sx={{ mt: 2, mr: 2 }}>
                            Cancel
                        </Button>
                    <Button onClick={handleAddReport} variant="contained" sx={{ mt: 2 }}>
                        Add Report
                    </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AcademicDetails;
