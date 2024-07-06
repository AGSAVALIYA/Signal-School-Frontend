import React, { useState } from "react";
import { AddPhotoAlternate, Close as CloseIcon } from "@mui/icons-material";
import { Alert, Button, CircularProgress, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import axios from "axios";

const UploadAvatar = ({ studentId, studentBasicData, setStudentBasicData }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null); // Clear selected file when closing the dialog
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      // Handle error, no file selected
      setError("Please select a file to upload");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    axios.post(
        `${process.env.REACT_APP_API_BACKEND}/student/addAvatar/${studentId}`,
        formData,
        { headers }
        ).then((res) => {
        setStudentBasicData((prevData) => ({
            ...prevData,
            imageLink: res.data.imageLink,
        }));
        setLoading(false);
        setSuccess(res.data.message);
        setTimeout(() => {
            setSuccess("");
            handleClose();
        }, 2000);
        }).catch((err) => {
        setError(err.response.data.error);
        setTimeout(() => {
            setError("");
        }, 2000);
        })

  };

  return (
    <div>
     
      <Button
        variant="outlined"
        sx={{ color: '#fff', marginTop: "10px" }}
        onClick={handleOpen}
      >
        <AddPhotoAlternate sx={{ fontSize: "1.3rem" }} />
      </Button>
      <Dialog open={open} onClose={handleClose} PaperProps={{sx: {borderRadius: '20px', width: '300px'}}}>
      {success && (
        <Alert onClose={() => setSuccess("")} severity="success" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert onClose={() => setError("")} severity="error" sx={{ position: 'fixed', top: '50px', left: '0', right: '0', zIndex: '10000', width: 'max-content', margin: 'auto' }}>
          {error}
        </Alert>
      )}
        <div style={{ padding: "20px" }}>
          <Typography variant="h6">Upload Avatar</Typography>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-input"
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-input">
            <Button
              variant="outlined"
              component="span"
              sx={{ margin: "10px" }}
            >
              Choose File
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
          <Button
            variant="outlined"
            color="primary"
            sx={{ margin: "10px" }}
            onClick={handleUpload}
            disabled={loading}
          >
            {/* Upload */}
            {loading ? <CircularProgress /> : "Upload"}
          </Button>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "primary",
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </Dialog>
    </div>
  );
};

export default UploadAvatar;
