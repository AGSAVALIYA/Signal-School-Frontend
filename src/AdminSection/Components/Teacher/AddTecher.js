import React from 'react';
import { Add } from '@mui/icons-material';
import { Dialog, Fab, Zoom, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

const AddNewTeacher = (props) => {
    const { fetchTeachers } = props;
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');

    const handleClose = () => {
        setOpen(false);
        // Reset the form data when the dialog is closed
        setName('');
        setEmail('');
        setPassword('');
    };

    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const handleFabClick = () => {
        setOpen(!open);
    };

    const handleSubmit = () => {
        const data = {
            name: name,
            email: email,
            password: password,
        };
        axios
            .post(`${process.env.REACT_APP_API_BACKEND}/teacher/create`, data, { headers })
            .then((res) => {
                setSuccess(res.data.message);
                setTimeout(() => {
                    setSuccess('');
                    fetchTeachers();
                    setOpen(false);
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data.error);
                setTimeout(() => {
                    setError('');
                }, 2000);
            });

        handleClose();
    };

    return (
        <div>
            {success && (
                <Alert
                    onClose={() => setSuccess('')}
                    severity="success"
                    sx={{
                        position: 'fixed',
                        top: '50px',
                        left: '0',
                        right: '0',
                        zIndex: '10000',
                        width: 'max-content',
                        margin: 'auto',
                    }}
                >
                    {success}
                </Alert>
            )}

            {error && (
                <Alert
                    onClose={() => setError('')}
                    severity="error"
                    sx={{
                        position: 'fixed',
                        top: '50px',
                        left: '0',
                        right: '0',
                        zIndex: '10000',
                        width: 'max-content',
                        margin: 'auto',
                    }}
                >
                    {error}
                </Alert>
            )}
            <div style={{ position: 'fixed', bottom: '75px', right: '20px' }}>
                <Zoom in={true} timeout={500}>
                    <Fab
                        aria-label="add"
                        onClick={handleFabClick}
                        sx={{ color: '#fff', backgroundColor: 'colors.main', '&:hover': { backgroundColor: 'colors.main' } }}
                    >
                        <Add sx={{ fontSize: '2rem' }} />
                    </Fab>
                </Zoom>
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
                <div style={{ padding: '20px' }}>
                    <TextField label="Name" fullWidth margin="normal" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Email" fullWidth margin="normal" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" fullWidth margin="normal" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" color="colors" sx={{ color: '#fff' }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default AddNewTeacher;
