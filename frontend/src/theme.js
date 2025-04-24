import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#232f3e',    // deep navy (Amazon-style)
    },
    secondary: {
      main: '#ff9900',    // warm gold
    },
    background: {
      default: '#f3f3f3', // soft grey
    },
    text: {
      primary: '#111',
    },
  },
  typography: {
    fontFamily: '"Amazon Ember", "Helvetica Neue", Arial, sans-serif',
  },
});

export default theme;
