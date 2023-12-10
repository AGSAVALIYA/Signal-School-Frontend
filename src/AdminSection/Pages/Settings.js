import React, { useState } from "react";
import ClassForm from "../Components/Settings/ClassForm";
import { Typography, Tabs, Tab, Grid } from "@mui/material";
import SubjectForm from "../Components/Settings/SubjectForm";

const Settings = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div>
            <Typography variant="h4" sx={{ color: 'colors.main', }}>Settings</Typography>

            <Grid container spacing={2} sx={{ marginTop: '20px' }}>

                <Grid item xs={2}>
                    <Tabs
                        orientation="vertical"
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            backgroundColor: 'transparentBG.bgcolor',
                            borderRadius: '20px',
                            padding: '5px',
                        }}
                        indicatorColor="colors.main"
                    >
                        <Tab
                            label="Class Form"
                            sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'colors.main', '&.Mui-selected': { backgroundColor: 'colors.main', color: '#fff', borderRadius: '20px' } }}
                        />
                        <Tab
                            label="Subject Form"
                            sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'colors.main', '&.Mui-selected': { backgroundColor: 'colors.main', color: '#fff',borderRadius: '20px' } }}
                        />
                    </Tabs>
                </Grid>

                <Grid item xs={9} sx={{ marginLeft: '20px' }}>
                    <div>
                        {activeTab === 0 && <ClassForm />}
                        {activeTab === 1 && <SubjectForm   />}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Settings;
