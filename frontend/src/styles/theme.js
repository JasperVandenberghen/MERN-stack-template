import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#247CAF',
    },
    gradients: {
      primary: 'linear-gradient(90deg, #2D9CDB, #56CCF2)',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#ffffff',
    },
    accent: {
      main: '#F39C12',
    },
    error: {
      main: '#E74C3C',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#F1C40F',
    },
    grey: {
      main: '#cececeba',
    },
    blue: {
      main: '#247CAF',
      darker: '#1E88E5',
      darkest: '#0D47A1',
    },
    text: {
      primary: '#444444',
      secondary: '#ffffff',
      tertiary: '#cececeba',
    },
    border: '#DDDDDD',
    purple: '#9B59B6',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'inherit', // Default background color for light mode
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0 + '!important',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: '#444444',
          },
          '& label.Mui-focused': {
            color: '#247CAF',
          },
        },
      },
    },
  },
  breakpoints: {
    xs: 0, // Extra small devices (phones)
    sm: 600, // Small devices (tablets)
    md: 960, // Medium devices (default laptops)
    lg: 1280, // Large devices (desktops)
    xl: 1920, // Extra large devices (large screens)
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#333',
      lighter: '#444',
      lightest: '#555',
    },
    secondary: {
      main: '#4CAF50',
    },
    accent: {
      main: '#F39C12',
    },
    error: {
      main: '#E74C3C',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#F1C40F',
    },
    grey: {
      main: '#cececeba',
    },
    blue: {
      main: '#247CAF',
      darker: '#1E88E5',
      darkest: '#0D47A1',
    },
    background: {
      default: '#444',
    },
    text: {
      primary: '#ffffff',
      secondary: '#f5f5f5f5',
      tertiary: '#cececeba',
    },
    border: '#DDDDDD',
    purple: '#9B59B6',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent !important', // Remove background color
          '--Paper-overlay': 'none !important', // Override overlay variable
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0 + '!important',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: '#ffffff',
          },
          '& label.Mui-focused': {
            color: '#f5f5f5f5',
          },
        },
      },
    },
  },
  breakpoints: {
    xs: 0, // Extra small devices (phones)
    sm: 600, // Small devices (tablets)
    md: 960, // Medium devices (default laptops)
    lg: 1280, // Large devices (desktops)
    xl: 1920, // Extra large devices (large screens)
  },
});
