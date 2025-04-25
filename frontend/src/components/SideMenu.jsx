import { memo } from 'react';
import { Box, Drawer } from '@mui/material/';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import MenuItems from './MenuItems';
import CardAlert from './CardAlert';

const SideMenu = () => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {!isMobileScreen && (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              position: 'fixed',
              width: 270,
              mt: '4em',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.text.secondary,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0px 10px 10px -10px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          <MenuItems />
          <Box sx={{ marginBottom: '5rem' }}>
            <CardAlert />
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default memo(SideMenu);
