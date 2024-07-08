import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import { Alert, CircularProgress, DialogContent, Snackbar } from '@mui/material';
import axios from 'axios';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function BulkAttendence({ subjects, classId, studentData, getStudentData }) {
    const [open, setOpen] = React.useState(false);
    const [progress, setProgress] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [attendenceDate, setAttendenceDate] = React.useState(dayjs());
    const [selectedSubjects, setSelectedSubjects] = React.useState([]);
    const [subjectsList, setSubjectsList] = React.useState(subjects);
    const [students, setStudents] = React.useState(studentData);
    const [selectedStudents, setSelectedStudents] = React.useState([]);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFile(file);
        } else {
            console.error("Invalid file selected");
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (selectedSubjects.length === 0) {
            setError('Please select subjects');
            return;
        }
        if (selectedStudents.length === 0) {
            setError('Please select students');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        //parse subjects a
        //add only subject id to selectedSubjects
        const temp = selectedSubjects.map((subject) => {
            return subject.id;
        });
        setSelectedSubjects(temp);
        const tempStudents = selectedStudents.map((student) => {
            return student;
        });
        setSelectedStudents(tempStudents);
        formData.append("progress", progress);
        formData.append("attendenceDate", attendenceDate);
        formData.append("subjects", JSON.stringify(temp));
        formData.append("studentIds", JSON.stringify(selectedStudents));
        formData.append("timelineImg", selectedFile);

        axios.post(`${process.env.REACT_APP_API_BACKEND}/studentTimeline/bulkCreate/${classId}`, formData, {
            headers
        })
            .then((res) => {
                setSuccess('Attendence saved successfully');
                setLoading(false);
                setTimeout(() => {
                    setSuccess('');
                    getStudentData();
                    handleClose();
                }
                    , 3000);

            })
            .catch((err) => {
                setError('Failed to save attendence.' + ' ' + err.response.data.error);
                setLoading(false);
                console.log(err);
            });
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents((prevSelectedStudents) => {
            if (prevSelectedStudents.includes(studentId)) {
                return prevSelectedStudents.filter((id) => id !== studentId);
            } else {
                return [...prevSelectedStudents, studentId];
            }
        });
    };

    const handleSelectAll = () => {
        setSelectedStudents((prevSelectedStudents) => {
            if (prevSelectedStudents.length === students.length) {
                return [];
            } else {
                return students.map((student) => student.id);
            }
        });
    }

    return (
        <React.Fragment>
            <Button variant='contained' sx={{ borderRadius: '20px' }} onClick={handleClickOpen}>
                Bulk
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                PaperProps={{
                    sx: {
                        borderRadius: '0',
                    },
                }}

            >
                <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    onClose={() => setSuccess('')}
                >
                    <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>

                </Snackbar>
                <Snackbar
                    open={error}
                    autoHideDuration={3000}
                    onClose={() => setError('')}
                >
                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>

                </Snackbar>


                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Bulk Attendence
                        </Typography>
                        <Button autoFocus onClick={handleSave} sx={{ backgroundColor: '#d9d9d9a1', color: "#fff", borderRadius: "20px" }}>
                            {
                                loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    "Save"
                                )
                            }
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <TextField
                        label="What did the student learn today?"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            style: { borderRadius: "20px" },
                        }}
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                    />
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            id="file-input"
                            name="timelineImg"
                            style={{ display: "none" }}
                            onChange={handleFileInputChange}
                        />
                        <label htmlFor="file-input">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                sx={{ borderRadius: "30px" }}
                                name="timelineImg"
                            >
                                Upload Photo
                            </Button>
                        </label>
                        {selectedFile && (

                            <> File: {selectedFile.name} </>

                        )}
                    </div>
                    <div style={{ margin: "10px 0" }}>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Select Date"
                                value={attendenceDate}
                                defaultValue={dayjs()}
                                slotProps={{ textField: { size: "small" } }}
                                onChange={(newValue) => {
                                    setAttendenceDate(dayjs(newValue));
                                }}
                            />

                        </LocalizationProvider>
                    </div>

                    <Autocomplete
                        multiple
                        id="subjects"
                        options={subjectsList}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            setSelectedSubjects(newValue);
                        }}
                        slotProps={{ textField: { size: "small" } }}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select Subjects"
                                placeholder="Subjects"
                                inputProps={{
                                    ...params.inputProps,
                                    "aria-readonly": true,
                                }}
                            />
                        )}
                    />
                    <Button
                    variant='contained'
                    sx={{margin: '10px 0', borderRadius: '20px' }}
                        onClick={handleSelectAll}
                    >Select All</Button>
                    <List>
                        {students.map((student) => (
                            <ListItemButton
                                key={student.id}
                                onClick={() => handleStudentSelection(student.id)}
                                sx={{ borderBottom: "1px solid #d9d9d9a1" }}
                            >
                                <ListItemText primary={student.name} />
                                <input
                                    type="checkbox"
                                    //size big
                                    style={{ width: "20px", height: "20px" }}
                                    onClick={() => handleStudentSelection(student.id)}
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleStudentSelection(student.id)}
                                />
                            </ListItemButton>
                        ))}
                    </List>

                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}


