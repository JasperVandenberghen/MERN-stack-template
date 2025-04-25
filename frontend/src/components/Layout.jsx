import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import SideMenu from '../components/SideMenu';
import Header from '../components/Header';

const Layout = () => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? '#444' : 'transparent',
      }}
    >
      <Header />
      <SideMenu />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          marginLeft: isMobileScreen ? 0 : '270px',
          px: isMobileScreen ? '0.5rem' : '1rem',
          pt: '5rem',
          pb: '2rem',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
