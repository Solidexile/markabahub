import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e53935', // light red
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff7961', // lighter red
      contrastText: '#fff',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    text: {
      primary: '#222',
      secondary: '#e53935',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#fff',
          color: '#e53935',
        },
      },
    },
  },
});

export default theme;