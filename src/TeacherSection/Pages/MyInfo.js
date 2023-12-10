import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Chip, Typography, Box, Paper, Zoom, Button } from "@mui/material";
import GTranslateComponent from "../../GTranslateWraper";

const MyInfo = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [currLanguage, setCurrLanguage] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
        setCurrLanguage(get_current_lang());
    }, [userInfo]);

    if (!userInfo) {
        return null;
    }

    const handleLogout = () => {
        //remove every item from local storage
        localStorage.clear();
        //clear every cookie
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        
        window.location.reload();
    }


   
    function getMainDomain(url) {
        let parts = url.split('.').reverse();
        if (parts[0] === "localhost:3000") {
            return "localhost:3000";
        }

        let mainDomain = parts[1] + '.' + parts[0];
        return mainDomain;
    }
    const handleLanguageChange = (ln) => {
        document.cookie = `googtrans=/auto/${ln};`;
        document.cookie = `googtrans=/auto/${ln}; domain=.${getMainDomain(window.location.hostname)}; path=/`;
        window.location.reload();
    }

    function get_current_lang() {
        var keyValue = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
        return keyValue ? keyValue[2].split('/')[2] : null;
    }


    return (
        <Zoom in={true} timeout={500}>

            <Box>
                <Paper elevation={3} sx={{ backgroundColor: "transparentBG.bgcolor", borderRadius: "20px", padding: "20px 30px", marginTop: "20px" }}>
                    <Avatar sx={{ width: "75px", height: "75px", margin: "auto" }}>
                        {/* <Typography variant="h4">
                        {userInfo.name.split(" ")[0][0]} {userInfo.name.split(" ")[1][0]}
                    </Typography> */}
                    </Avatar>

                    <Box sx={{ marginTop: "20px" }}>
                        <Typography variant="body1">
                            <span style={{ fontWeight: "600" }}>Name: </span> {userInfo.name}
                        </Typography>
                        <Typography variant="body1">
                            <span style={{ fontWeight: "600" }}>Email: </span> {userInfo.email}
                        </Typography>
                        <Typography variant="body1">
                            <span style={{ fontWeight: "600" }}>Current School: </span>
                            <br />
                            <span style={{ color: "#3f51b5", fontWeight: "500" }}>Name:</span> {userInfo.currentSchoolData.name}
                            <br />
                            <span style={{ color: "#3f51b5", fontWeight: "500" }}>Location:</span> {userInfo.currentSchoolData.location}
                        </Typography>
                    </Box>
                </Paper>
                <Paper className="notranslate" elevation={3} sx={{ marginTop: '20px', backgroundColor: "transparentBG.bgcolor", borderRadius: "20px", padding: "20px 30px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "10px" }}>Translate</Typography>
                    {/* <div className="gtranslate_wrapper"></div> */}
                    <Button onClick={() => handleLanguageChange('en')}
                      sx={{backgroundColor: currLanguage === 'en' ? "colors.main" : "transparent", color: currLanguage === 'en' ? "#fff" : "colors.main"}}
                    >English</Button>
                    <Button onClick={() => handleLanguageChange('hi')}
                        sx={{backgroundColor: currLanguage === 'hi' ? "colors.main" : "transparent", color: currLanguage === 'hi' ? "#fff" : "colors.main"}}
                    >Hindi</Button>
                    <Button onClick={() => handleLanguageChange('mr')}
                      sx={{backgroundColor: currLanguage === 'mr' ? "colors.main" : "transparent", color: currLanguage === 'mr' ? "#fff" : "colors.main"}}
                    >Marathi</Button>
                    <Button onClick={() => handleLanguageChange('gu')}
                    sx={{backgroundColor: currLanguage === 'gu' ? "colors.main" : "transparent", color: currLanguage === 'gu' ? "#fff" : "colors.main"}}
                    >Gujarati</Button>

                </Paper>
                {userInfo.schools.length > 1 && (
                    <Paper elevation={3} sx={{ marginTop: '20px', backgroundColor: "transparentBG.bgcolor", borderRadius: "20px", padding: "20px 30px" }}>
                        {userInfo.schools.map((item) => (
                            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", backgroundColor: "transparentBG.bgcolor", padding: "10px", borderRadius: "10px", boxShadow: "0px 0px 10px 0px #0000001a" }}>
                                <Typography variant="body1">
                                    {item.name} - {item.location}
                                </Typography>
                                <Chip label="Switch" variant="outlined" size="small" />
                            </Box>
                        ))}
                    </Paper>
                )}

                <Button variant="contained" sx={{ marginTop: "20px", backgroundColor: "colors.error", color: "#fff", fontWeight: "600" }} onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

        </Zoom>
    );
};

export default MyInfo;
