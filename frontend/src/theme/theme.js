import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '0.02em',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            boxShadow: '0 6px 28px rgba(16, 185, 129, 0.55)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;