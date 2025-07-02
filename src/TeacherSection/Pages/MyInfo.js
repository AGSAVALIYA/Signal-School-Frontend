import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Chip, Typography, Box, Paper, Zoom, Button } from "@mui/material";

/**
 * MyInfo Component (Teacher Section)
 * 
 * This component displays the teacher's personal information and profile details.
 * It serves as the teacher's personal dashboard where they can view their
 * information and manage their account settings.
 * 
 * Key Features:
 * - Displays teacher profile information (name, avatar, details)
 * - Shows current language settings with Google Translate integration
 * - Provides logout functionality with complete session cleanup
 * - Route protection - redirects unauthenticated users to login
 * - Responsive design with Material-UI components
 * - Cookie and localStorage cleanup on logout
 * 
 * The component includes language detection and management for the
 * multi-language support provided by Google Translate.
 */
const MyInfo = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [currLanguage, setCurrLanguage] = useState(null);

    /**
     * Effect hook for component initialization and authentication check
     * 
     * Performs the following on component mount:
     * 1. Checks if user is authenticated, redirects to login if not
     * 2. Initializes language settings using Google Translate API
     * 3. Sets up the component state based on user information
     */
    useEffect(() => {
        // Redirect to login if user is not authenticated
        if (!userInfo) {
            navigate('/login');
        }
        
        // Initialize current language if not already set
        if (!currLanguage) {
            setCurrLanguage(get_current_lang());
        }
    }, [userInfo]);

    // Early return if user info is not available
    if (!userInfo) {
        return null;
    }

    /**
     * Handles user logout with complete session cleanup
     * 
     * Performs comprehensive cleanup:
     * 1. Clears all localStorage data
     * 2. Removes all cookies to ensure complete logout
     * 3. Reloads the page to reset application state
     */
    const handleLogout = () => {
        // Clear all localStorage data
        localStorage.clear();
        
        // Clear all cookies for complete session cleanup
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Reload page to reset application state
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
        // document.cookie = `googtrans=/auto/${ln};`;
        // document.cookie = `googtrans=/auto/${ln}; domain=.${getMainDomain(window.location.hostname)}; path=/`;
        //with expire of 7 days
        document.cookie = `googtrans=/auto/${ln}; domain=.${getMainDomain(window.location.hostname)}; path=/; expires=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;
        document.cookie = `googtrans=/auto/${ln}; path=/; expires=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;
        setCurrLanguage(ln);

        window.location.reload();
    }

    function get_current_lang() {
        var keyValue = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
        return keyValue ? keyValue[2].split('/')[2] : null;
    }


    return (
        <Zoom in={true} timeout={300}>

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
