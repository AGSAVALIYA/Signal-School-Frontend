import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        background: {
            default: '#e6e6e6', // cream color
            tabs: '#fff', // white
            box: '#fff', // white
        },
        
        transparentBG: {
            default: '#ffffffde',
            bgcolor: '#ffffffde',
        },

        primary: {
            main: '#027086ff', // black
        },
        secondary: {
            //blue
            main: '#2b5035', // cobalt blue
        },
        colors: {
            main: "#027086ff",
            error: '#ff0000',
            success: '#008000',
         },
    },
    components: {
        MuiBottomNavigation: {
            styleOverrides: {
                '& .MuiBottomNavigationAction-iconOnly': {},
                '& .Mui-selected': {
                    color: '#fff', // blue
                },
            },
        },
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '20px',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    // backgroundImage: "url('https://i.postimg.cc/gcthRfZM/ssbg.png')",
                    backgroundImage: "url('/background/ssbgmobile.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    boxSizing: 'border-box',
                },
                '@media (min-width: 600px)': {
                    body: {
                        // backgroundImage: "url('https://i.postimg.cc/VkFTstLb/43-6.jpg')",
                        backgroundImage: "url('/background/ssbgdesktop.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        boxSizing: 'border-box',
                    },
                },
            },
        },
    },
});

export default theme;
