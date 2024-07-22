import React, { useState } from "react";
import { AddPhotoAlternate, Close as CloseIcon } from "@mui/icons-material";
import { Button, CircularProgress, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import axios from "axios";

const UploadTeacherAvatar = ({ teacherId, setSuccess, setError, handleImageChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BACKEND}/teacher/addAvatar/${teacherId}`,
        formData,
        { headers }
      );  


      handleImageChange(res.data.imageLink);
      setSuccess(res.data.message);
      setLoading(false);
      setTimeout(() => {
        setSuccess("");
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response.data.error);
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        sx={{ marginTop: "10px" }}
        onClick={handleOpen}
      >
        <AddPhotoAlternate sx={{ fontSize: "1.2rem" }} />
      </Button>
      <Dialog open={open} onClose={handleClose} PaperProps={{sx: {borderRadius: '20px', width: '300px'}}}>
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
            {loading ? <CircularProgress size={24} /> : "Upload"}
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

export default UploadTeacherAvatar;
