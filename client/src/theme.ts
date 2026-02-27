import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Teal color for header and buttons
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffab40', // Orange/Amber for pending or alerts
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f8', // Light grey app background
      paper: '#ffffff',
    },
    text: {
      primary: '#1d2125',
      secondary: '#6b778c',
    },
    success: {
      main: '#36b37e',
    },
    error: {
      main: '#ff5630',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          borderRadius: 16,
          border: 'none',
        },
      },
      defaultProps: {
        variant: 'elevation',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #e0e0e0',
          height: 64,
        },
      },
    },
  },
});

export default theme;
