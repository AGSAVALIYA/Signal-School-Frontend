import { createTheme } from "@mui/material";

/**
 * Material-UI Theme Configuration for Signal School Frontend
 * 
 * This theme defines the visual design system for the entire application,
 * including colors, typography, component overrides, and responsive styles.
 * 
 * The theme supports both mobile and desktop layouts with different
 * background images and maintains consistent branding throughout the app.
 */
const theme = createTheme({
    /**
     * Color Palette Configuration
     * 
     * Defines the primary color scheme used throughout the application:
     * - Background colors for different UI elements
     * - Primary and secondary brand colors
     * - Custom colors for specific use cases
     */
    palette: {
        // Background color definitions
        background: {
            default: '#e6e6e6', // Light cream color for page backgrounds
            tabs: '#fff',       // White background for tab components
            box: '#fff',        // White background for content boxes
        },
        
        // Transparent background variations for layered components
        transparentBG: {
            default: '#ffffffde', // Semi-transparent white
            bgcolor: '#ffffffde', // Semi-transparent white for background color
        },

        // Primary brand color (teal/blue-green)
        primary: {
            main: '#027086ff', // Signal School primary brand color
        },
        
        // Secondary brand color (dark green)
        secondary: {
            main: '#2b5035', // Complementary dark green color
        },
        
        // Custom color palette for specific UI elements
        colors: {
            main: "#027086ff",    // Primary brand color (same as primary.main)
            error: '#ff0000',     // Red for error states
            success: '#008000',   // Green for success states
         },
    },
    
    /**
     * Component Style Overrides
     * 
     * Customizes the default styling of Material-UI components
     * to match the Signal School design system.
     */
    components: {
        /**
         * Bottom Navigation Component Styling
         * 
         * Customizes the bottom navigation bar used in mobile interfaces,
         * specifically for the teacher section navigation.
         */
        MuiBottomNavigation: {
            styleOverrides: {
                '& .MuiBottomNavigationAction-iconOnly': {
                    // Custom styling for icon-only navigation actions
                },
                '& .Mui-selected': {
                    color: '#fff', // White color for selected navigation items
                },
            },
        },
        
        /**
         * Dialog Component Styling
         * 
         * Applies rounded corners to all dialog components for a modern look.
         */
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '20px', // Rounded corners for dialog boxes
                },
            },
        },
        
        /**
         * Global CSS Baseline Overrides
         * 
         * Defines the global styling for the application body,
         * including responsive background images for different screen sizes.
         */
        MuiCssBaseline: {
            styleOverrides: {
                // Default mobile styling
                body: {
                    backgroundImage: "url('/background/ssbgmobile.png')", // Mobile background image
                    backgroundRepeat: 'no-repeat',    // Prevent background image repetition
                    backgroundSize: 'cover',          // Scale background to cover entire viewport
                    backgroundPosition: 'center',     // Center the background image
                    backgroundAttachment: 'fixed',    // Keep background fixed during scroll
                    boxSizing: 'border-box',         // Include padding/border in element width/height
                },
                
                // Desktop/tablet styling (screens >= 600px width)
                '@media (min-width: 600px)': {
                    body: {
                        backgroundImage: "url('/background/ssbgdesktop.png')", // Desktop background image
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
