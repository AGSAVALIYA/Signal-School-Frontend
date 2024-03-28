import React, { useEffect, useState } from "react";
import { Autocomplete, Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

const StudentChip = ({ name, id, image, todayStatus, timeline, subjects }) => {
  
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attendenceDate, setAttendenceDate] = useState();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectsList, setSubjectsList] = useState(subjects);
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

    const formData = new FormData();

    formData.append("timelineImg", selectedFile);
    formData.append("studentId", id);
    formData.append("progress", progress);
    formData.append("attendanceStatus", st);
    formData.append("attendenceDate", attendenceDate);
    formData.append("subjects", JSON.stringify(selectedSubjects.map(subject => subject.id)));

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



  return (
    <div>
      <Chip
        avatar={<Avatar alt={name} src={image} />}
        label={name}
        sx={{ margin: "7px 5px", backgroundColor: todayStatus === 'present' ? '#4caf50' : (todayStatus === 'absent' ? '#f44336' : '#e8e8e8'), fontSize: "15px" }}
        onClick={handleOpen}
      />
      <Dialog open={open} onClose={handleClose} sx={{ zIndex: 1000 }}>
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
