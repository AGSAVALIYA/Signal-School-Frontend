import React, { useState } from "react";
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const StudentChip = ({ name, id, image }) => {
  const [status, setStatus] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileInputChange = (event) => {
    // Handle file input change
    const file = event.target.files[0];
    // Add your file handling logic here
  };

  return (
    <div>
      <Chip
        avatar={<Avatar alt={name} src={image} />}
        label={name}
        sx={{ margin: "7px 5px", backgroundColor: status === 'present' ? '#4caf50' : (status === 'absent' ? '#f44336' : '#e8e8e8'), fontSize: "15px"}}
        onClick={handleOpen}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Daily Report</DialogTitle>
        <DialogContent>
          <Avatar
            alt={name}
            src={image}
            style={{ width: "100px", height: "100px", margin: "auto" }}
          />
          <Typography variant="h6" component="div"
          sx={{textAlign: "center"}}
          >{name}</Typography>
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
            
          />
          <label htmlFor="file-input">
            <input
              type="file"
              accept="image/*"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ borderRadius: "30px" }}
            >
              Upload Photo
            </Button>
          </label>
        </DialogContent>
        <DialogActions sx={{justifyContent: "space-between", padding:"10px 20px"}}>
          <Button onClick={handleClose} color="primary" variant="outlined" sx={{borderRadius: "30px"}}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setStatus('present');
              handleClose();
            }}
            variant="contained"
            sx={{borderRadius: "30px", backgroundColor: "#4caf50", color: "#fff"}}
          >
            Present
          </Button>
          <Button
            onClick={() => {
              setStatus('absent');
              handleClose();
            }}
            color="primary"
            variant="outlined"
            sx={{borderRadius: "30px", borderColor: "#f44336", color: "#f44336"}}
          >
            Absent
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentChip;
