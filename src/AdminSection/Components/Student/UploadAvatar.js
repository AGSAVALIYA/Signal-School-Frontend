import React, { useState } from "react";
import { AddPhotoAlternate, Close as CloseIcon } from "@mui/icons-material";
import { Button, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import axios from "axios";

const UploadAvatar = ({ studentId, setSuccess, setError, onEditFieldChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BACKEND}/student/addAvatar/${studentId}`,
        formData,
        { headers }
      );

      onEditFieldChange("imageLink", res.data.imageLink);
      setSuccess(res.data.message);
      setTimeout(() => {
        setSuccess("");
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response.data.error);
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
          >
            Upload
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
