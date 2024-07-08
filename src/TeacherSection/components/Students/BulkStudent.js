import { AppBar, Button, CircularProgress, Dialog, Divider, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const BulkStudent = ({classId, className}) => { 
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
    };

    const getSampleCSV = () => {
        axios.get(`${process.env.REACT_APP_API_BACKEND}/student/getSampleCSV/${classId}`, { headers })
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                className = className.replace(/\s/g, '_');
                link.setAttribute('download', `Students_of_${className}.csv`);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleUploadCsv = () => {
        setLoading(true);
        if (file === null) {
            setError("Please select a file");
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`${process.env.REACT_APP_API_BACKEND}/student/uploadCSV/${classId}`, formData, { headers })
            .then((res) => {
                setSuccess("Students added successfully");
                setLoading(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
            )
            .catch((err) => {
                console.log(err);
            })
    }



    return (
        <div>
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
                    </Toolbar>
                </AppBar>

                <div style={{ padding: '20px' }}>
                    <div>
                        <Typography variant='h5'>Download Sample CSV</Typography>
                        <Button variant='contained' sx={{ borderRadius: '20px', marginTop: '10px' }} onClick={getSampleCSV}>Download</Button>
                        <Typography variant='body2' sx={{ marginTop: '10px' }}>Note: Please do not change the format of the CSV file</Typography>
                        <Typography variant='body2' sx={{ marginTop: '10px' }}>Please remove the test student from the CSV file</Typography>
                    </div>
                    <Divider sx={{ marginTop: '20px' }} />
                    <div>
                        <Typography variant='h5' sx={{ marginTop: '20px' }}>Upload CSV</Typography>
                        <input type='file' accept='.csv' style={{ marginTop: '10px' }} onChange={(e) => setFile(e.target.files[0])} />
                        <Button variant='contained' sx={{ borderRadius: '20px', marginTop: '10px' }} onClick={handleUploadCsv}>
                           {loading ? <CircularProgress size={24} /> : 'Upload'}
                            </Button>

                        </div>
                </div>
            </Dialog>
            
        </div>
    )
}


export default BulkStudent;

