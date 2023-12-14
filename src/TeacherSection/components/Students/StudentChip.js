import React, { useEffect, useState } from "react";
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";

const StudentChip = ({ name, id, image, todayStatus, timeline }) => {
  const [status, setStatus] = useState();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected File:", file);

    if (file) {
      setSelectedFile(file);
    } else {
      console.error("Invalid file selected");
    }
  };

  const handleSubmit = (st) => {
    setStatus(st);
    const formData = new FormData();

    //const date to iso string
    let date = new Date().toISOString();


    formData.append("timelineImg", selectedFile);
    formData.append("studentId", id);
    formData.append("progress", progress);
    formData.append("attendanceStatus", st);
    formData.append("date", date);


    axios.post(`${process.env.REACT_APP_API_BACKEND}/studentTimeline/create/${id}`, formData, {
      headers
    })
      .then((res) => {
        console.log(res);
      }
      )
      .catch((err) => {
        console.log(err);
      }
      )

    handleClose();
  }

  // useEffect(() => {
  //   if (todayStatus === "present") {
  //     setStatus("present");
  //   }
  //   else if (todayStatus === "absent") {
  //     setStatus("absent");
  //   }
  // }, [todayStatus]);

  useEffect(() => {
    if(timeline.length > 0){
      setStatus(timeline[0].attendanceStatus);
    }
  }
  , [timeline]);

  return (
    <div>
      <Chip
        avatar={<Avatar alt={name} src={image} />}
        label={name}
        sx={{ margin: "7px 5px", backgroundColor: status === 'present' ? '#4caf50' : (status === 'absent' ? '#f44336' : '#e8e8e8'), fontSize: "15px" }}
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
            sx={{ textAlign: "center" }}
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
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />

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
            <div style={{ textAlign: "center" }}>
              <Typography sx={{ marginTop: "10px" }}>
                Selected File: {selectedFile.name}
              </Typography>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Avatar"
                style={{ maxWidth: "200px", maxHeight: "200px", margin: "auto" }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", padding: "10px 20px" }}>
          <Button onClick={handleClose} color="primary" variant="outlined" sx={{ borderRadius: "30px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit("present")}
            sx={{ borderRadius: "30px", backgroundColor: "#4caf50", color: "#fff" }}
          >
            Present
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleSubmit("absent")}
            sx={{ borderRadius: "30px", borderColor: "#f44336", color: "#f44336" }}
          >
            Absent
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentChip;
