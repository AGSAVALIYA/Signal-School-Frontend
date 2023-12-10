import { Typography, Card, CardContent, Grid, Box, Zoom } from "@mui/material";
import React from "react";

const AcademicDetails = ({ academicData }) => {
  const cardStyle = {
    borderRadius: "20px",
    margin: "auto",
    marginBottom: "30px",
    padding: "1rem",
    paddingBottom: "0rem",
  
  };

  return (
    <Zoom in={true} timeout={300}>
    <div
      className="flex-container"
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {Object.keys(academicData[0]).map((subject, index) => (
        <Card key={subject} style={cardStyle} sx={{ display: "flex", width: "100%", marginRight: "2rem", backgroundColor: "transparentBG.bgcolor"}}>
          <CardContent>
            <Typography variant="h6" component="h6" style={{ fontWeight: "bold", fontSize: "1.75rem" }}>
              {subject}
            </Typography>
            <Box sx={{ padding: "0.5rem" }}>
              {Object.keys(academicData[0][subject]).map((category, categoryIndex) => (
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    {category}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "1rem" }}>
                    {academicData[0][subject][category]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
    </Zoom>
  );
};

export default AcademicDetails;
