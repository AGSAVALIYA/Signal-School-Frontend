import React from 'react';
import { Add } from '@mui/icons-material';
import { Dialog, Fab, Zoom, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddNewStudent = () => {
    const [open, setOpen] = React.useState(false);
    const [studentData, setStudentData] = React.useState([]);

    const handleFabClick = () => {
        setOpen(!open);
    }

    const handleClose = () => {
        setOpen(false);
        // Reset the form data when the dialog is closed

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = () => {
        // Handle form submission logic here, e.g., send data to backend
        console.log("Submitting student data:", studentData);
        handleClose();
    }

    return (
        <div>
            <div style={{ position: "fixed", bottom: "75px", right: "20px" }}>
                <Zoom in={true} timeout={500}>
                    <Fab color="colors" aria-label="add" onClick={handleFabClick} sx={{ color: "#fff" }}>
                        <Add />
                    </Fab>
                </Zoom>
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
                <div style={{ padding: '20px' }}>
                    <TextField label="Name" fullWidth margin="normal" name="name" value={studentData.name} onChange={handleChange} />
                    <TextField label="Class" fullWidth margin="normal" name="class" value={studentData.class} onChange={handleChange} />
                    <TextField label="Age" fullWidth margin="normal" name="age" type="number" value={studentData.age} onChange={handleChange} />
                    <TextField label="Date of Birth" fullWidth margin="normal" name="dob" type="date" value={studentData.dob} onChange={handleChange} InputLabelProps={{
                        shrink: true,
                        style: { marginLeft: '0px' } // Adjust the margin as needed
                    }} />
                    <TextField label="Address" fullWidth margin="normal" name="address" value={studentData.address} onChange={handleChange} />
                    <Button variant="contained" color="colors" sx={{color:"#fff"}} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}

export default AddNewStudent;
