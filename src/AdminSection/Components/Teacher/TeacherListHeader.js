import React, { useState } from "react";
import { Box, InputAdornment, TextField, MenuItem, IconButton, Tooltip, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import AddNewTeacher from "./AddTecher";

const TeacherListHeader = (props) => {
    const { AllTeachers, setFilteredTeachers, fetchTeachers } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [sortOption, setSortOption] = useState("name");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filtered = AllTeachers.filter((student) => {
      if (selectedClass === "all") {
        return student.name.toLowerCase().includes(event.target.value.toLowerCase());
      } else {
        return (
          student.name.toLowerCase().includes(event.target.value.toLowerCase()) &&
          student.class.toLowerCase().includes(selectedClass.toLowerCase())
        );
      }
    });
    setFilteredTeachers(filtered);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    const filtered = AllTeachers.filter((student) => {
      if (event.target.value === "all") {
        return student.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return (
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          student.class.toLowerCase().includes(event.target.value.toLowerCase())
        );
      }
    });
    setFilteredTeachers(filtered);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    const filtered = AllTeachers.filter((student) => {
      if (event.target.value === "") {
        return student.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return (
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          student.class.toLowerCase().includes(selectedClass.toLowerCase())
        );
      }
    });
    if (event.target.value === "name") {
      filtered.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (event.target.value === "createdAt") {
      filtered.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (event.target.value === "modifiedAt") {
      filtered.sort((a, b) => {
        return new Date(b.modifiedAt) - new Date(a.modifiedAt);
      });
    }
    setFilteredTeachers(filtered);
  };

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
            Teachers
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
          }
          }
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
          <MenuItem value="1st">1st Grade</MenuItem>
          <MenuItem value="2nd">2nd Grade</MenuItem>
          <MenuItem value="3rd">3rd Grade</MenuItem>
          <MenuItem value="4th">4th Grade</MenuItem>
          <MenuItem value="5th">5th Grade</MenuItem>
        </TextField>
        <TextField
          select
          value={sortOption}
          onChange={handleSortChange}
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
      <AddNewTeacher fetchTeachers={fetchTeachers} />
    </Box>
  );
};

export default TeacherListHeader;
