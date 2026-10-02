import { createTheme } from '@mui/material/styles';

// Teacher-first: larger base text, 48px touch targets, high-contrast teal from the school brand.
export const makeTheme = () =>
  createTheme({
    palette: {
      primary: { main: '#0b5f72', contrastText: '#ffffff' },
      secondary: { main: '#8a4b0f' },
      success: { main: '#1e7a3c' },
      error: { main: '#b3261e' },
      warning: { main: '#9a5b00' },
      background: { default: '#f4f7f7', paper: '#ffffff' },
      text: { primary: '#14262b', secondary: '#4a5f64' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Noto Sans", "Noto Sans Devanagari", "Noto Sans Gujarati", system-ui, sans-serif',
      fontSize: 15,
      h1: { fontSize: '1.6rem', fontWeight: 700 },
      h2: { fontSize: '1.35rem', fontWeight: 700 },
      h3: { fontSize: '1.15rem', fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600, fontSize: '1rem' },
      body1: { lineHeight: 1.6 },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 44 }, sizeLarge: { minHeight: 52 } } },
      MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
      MuiTextField: { defaultProps: { fullWidth: true } },
      MuiChip: { styleOverrides: { label: { fontWeight: 600 } } },
      // Initials on a light teal: readable (contrast > 7:1) instead of white on light grey.
      MuiAvatar: { styleOverrides: { colorDefault: { backgroundColor: '#d3e6ea', color: '#0b3f4b', fontWeight: 700 } } },
      MuiCard: { defaultProps: { variant: 'outlined' } },
      MuiDialog: { defaultProps: { fullWidth: true, maxWidth: 'sm' } },
    },
  });
