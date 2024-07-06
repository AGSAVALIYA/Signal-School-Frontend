import React, { useEffect, useState } from "react";
import { Alert, Box, Tab, Tabs, Typography } from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Avatar, IconButton } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import StudentBasicDetails from "../components/Students/StudentBasicData";
import StudentTimeline from "../components/Students/StudentTimeline";
import axios from "axios";
import { useParams } from "react-router-dom";
import UploadAvatar from "../components/Students/UploadAvatar";
import AcademicDetails from "../components/Students/AcademicDetails";

const StudentDetail = () => {
  const [studentBasicData, setStudentBasicData] = useState();
  const [basicDetailEditMode, setBasicDetailEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [classes, setClasses] = useState([]);
  const params = useParams();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const getClasses = () => {
    axios.get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers }).then((res) => {
       setClasses(res.data.classes);
     }
     ).catch((err) => {
      setError(err.response.data.error);
       setTimeout(() => {
         setError("");
       }, 2000);
     }
     )
 
   };

  const handleStudentUpdate = (student) => {
    // Simulated update function
    axios.put(`${process.env.REACT_APP_API_BACKEND}/student/update/${params.id}`, student, { headers }).then((res) => {
      setSuccess(res.data.message);
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    }
    ).catch((err) => {
      console.log(err);
    }
    )
    setBasicDetailEditMode(false);
  };

  const fetchStudent = () => {
    // Simulated fetch function
    axios.get(`${process.env.REACT_APP_API_BACKEND}/student/get/${params.id}`, { headers }).then((res) => {
      console.log(res.data);
      setStudentBasicData(res.data.student);
      setLoading(false);
    }
    ).catch((err) => {
      console.log(err);
      setTimeout(() => {
        setError("");
      }
        , 2000);
    }
    )

    
  };

  const handleEditButtonClick = () => {
    if (!basicDetailEditMode) {
      //fetch classes
      getClasses();
    }

    setBasicDetailEditMode(!basicDetailEditMode);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div style={{ position: "fixed", top: "0", left: "0", right: "0", bottom: "0", overflow: "auto", paddingBottom: "20px" }}>
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
      <Box
        sx={{
          backgroundColor: "colors.main",
          margin: "0",
          width: "100vw",
          padding: "10px",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <div style={{ textAlign: "center", paddingTop: "10px" }}>
          {/* <Avatar sx={{ width: "100px", height: "100px", margin: "auto" }} /> */}
          {
            !loading ? (
              studentBasicData.imageLink ? (
                <Avatar
                  src={studentBasicData.imageLink}
                  sx={{ width: "100px", height: "100px", margin: "auto" }}
                />
              ) : (
                <Avatar sx={{ width: "100px", height: "100px", margin: "auto" }}>
                  {/* {studentBasicData.name.charAt(0)} */}
                </Avatar>
              )
            ) : (
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                style={{ margin: "auto" }}
              />
            )
          }
           <UploadAvatar studentId={params.id} setStudentBasicData={setStudentBasicData} studentBasicData={studentBasicData} />
          {!loading ? (
            <h1 style={{ color: "#FFFFFF" }}>{studentBasicData.name}</h1>
          ) : (
            <div style={{ margin: "10px auto", width: "fit-content" }}>
              {" "}
              <Skeleton variant="text" width={200} height={50} />{" "}
            </div>
          )}
         
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              sx={{ "& .MuiTabs-indicator": { display: "none" } }}
            >
              <Tab
                label="Details"
                sx={{
                  color: "background.tabs",
                  "&.Mui-selected": {
                    backgroundColor: "background.tabs",
                    color: "primary.main",
                    borderRadius: "20px",
                    transition: "0.5s",
                  },
                  fontWeight: "bold"
                }}
              />
              <Tab
                label="Timeline"
                sx={{
                  color: "background.tabs",
                  "&.Mui-selected": {
                    backgroundColor: "background.tabs",
                    color: "primary.main",
                    borderRadius: "20px",
                    transition: "0.5s",
                  },
                  fontWeight: "bold"
                }}
              />
            </Tabs>
          </div>
        </div>
      </Box>

      <Box sx={{ borderRadius: "20px", padding: "15px", paddingBottom: "50px" }}>
        {currentTab === 0 && (
          <div>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px", marginTop: "15px", margin: "auto", width: "100%"
            }}>


              <Typography variant="h5" component="h5" style={{ color: "primary.main", fontWeight: "bold", marginLeft: "10px", display: "flex", alignItems: "center" }}>
                <LibraryBooksIcon sx={{ color: "primary.main", fontSize: "30px" }}></LibraryBooksIcon>
                Basic Details
              </Typography>
              <div>
                {basicDetailEditMode ? (
                  <IconButton aria-label="save" onClick={() => handleStudentUpdate(studentBasicData)} sx={{ color: "primary.main" }}>
                    <SaveIcon sx={{ color: "primary.main" }} /> Save
                  </IconButton>
                ) : (
                  <IconButton aria-label="edit" onClick={handleEditButtonClick}>
                    <EditIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                )}
              </div>
            </div>
            <StudentBasicDetails student={studentBasicData} editMode={basicDetailEditMode} setStudent={setStudentBasicData} loading={loading} classes={classes} />
            <AcademicDetails studentBasicData={studentBasicData} studentDataLoading={loading}/>
          </div>
        )}

        {currentTab === 1 && (
          <div>
            <StudentTimeline />
          </div>
        )}
      </Box>
    </div>
  );
};

export default StudentDetail;
