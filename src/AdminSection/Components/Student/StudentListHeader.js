import React, { useEffect, useState } from "react";
import { Box, InputAdornment, TextField, MenuItem, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import AddNewStudent from "./AddStudent";
import axios from "axios";

const StudentListHeader = (props) => {
  const { AllStudents, setFilteredStudents, fetchStudents } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [sortOption, setSortOption] = useState("name");
  const [classes, setClasses] = React.useState([]);

  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    axios
      .get(`${process.env.REACT_APP_API_BACKEND}/class/getAll`, { headers })
      .then((res) => {
        setClasses(res.data.classes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filtered = AllStudents.filter((student) => {
      const studentName = student.name?.toLowerCase() || "";
      const studentClass = student.Class.name?.toLowerCase() || "";
      const searchTermLower = event.target.value.toLowerCase();
      const selectedClassLower = selectedClass.toLowerCase();

      if (selectedClass === "all") {
        return studentName.includes(searchTermLower);
      } else {
        return (
          studentName.includes(searchTermLower) &&
          studentClass.includes(selectedClassLower)

        );
      }
    });
    setFilteredStudents(filtered.length === 0 ? [] : filtered);
  };


  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    const filtered = AllStudents.filter((student) => {
      const studentName = student.name?.toLowerCase() || "";
      const studentClass = student.Class.name?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();
      const selectedClassLower = event.target.value.toLowerCase();
  
      if (event.target.value === "all") {
        return studentName.includes(searchTermLower);
      } else {
        return (
          studentName.includes(searchTermLower) &&
          studentClass.includes(selectedClassLower)
        );
      }
    });
    setFilteredStudents(filtered.length === 0 ? [] : filtered);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    const filtered = AllStudents.sort((a, b) => {
      const studentName = a.name?.toLowerCase() || "";
      const studentClass = a.Class.name?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();
      const selectedClassLower = selectedClass.toLowerCase();
      const sortOptionLower = event.target.value.toLowerCase();
      if (selectedClass === "all") {
        if (sortOptionLower === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortOptionLower === "createdAt") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOptionLower === "modifiedAt") {
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        }
      } else {
        if (sortOptionLower === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortOptionLower === "createdAt") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOptionLower === "modifiedAt") {
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        }
      }
    }
    );
    setFilteredStudents(filtered.length === 0 ? [] : filtered);
  }
  

  
  
  return (
    <Box
      sx={{
        backgroundColor: 'transparentBG.bgcolor',
        borderRadius: '20px',
        padding: '0 10px 10px 10px', // Increased padding for better spacing
        boxShadow: '0px 0px 10px 0px #0000001a',
        display: 'flex',
        flexDirection: 'column',
        padding: "10px"
      }}
    >
      <Typography variant="h4" noWrap component="div" color={'colors.main'} sx={{ textAlign: 'center', fontWeight: "600"}}>
        Students
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: "space-between"}}>
        <Box>
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                padding: '0 10px',
                borderRadius: '20px',
                width: '400px',
              },
            }}
            inputProps={{
              style: {
                padding: '10px',
                borderRadius: '20px',
              },
            }}
          />
        </Box>
        <Box>
          <TextField
            select
            value={selectedClass}
            onChange={handleClassChange}
            label="Class"
            size= "small"
            defaultChecked="all"
            sx={{ marginLeft: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              )
            }}
          >
            {/* Replace with your class options */}
            <MenuItem value="all">All</MenuItem>
            {classes.length > 0 ? classes.map((classObject) => (
              <MenuItem key={classObject.id} value={classObject.name}>
                {classObject.name}
              </MenuItem>
            )) : null
            }
          </TextField>
          <TextField
            select
            value={sortOption}
            onChange={(e) => handleSortChange(e) }
            label="Sort By"
            defaultChecked="createdAt"
            sx={{ marginLeft: 1 }}
            size= "small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SortIcon />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="createdAt">Date Added</MenuItem>
            <MenuItem value="modifiedAt">Date Modified</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </TextField>
        </Box>
      </Box>
      <AddNewStudent fetchStudents={fetchStudents} />
    </Box>
  );
};

export default StudentListHeader;
