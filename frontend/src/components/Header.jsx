import { memo } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Login as LoginIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import NotificationsMenu from './NotificationsMenu';
import DarkModeSwitch from './DarkModeSwitch';
import OptionsMenu from './OptionsMenu';
import MenuButton from './MenuButton';
import Search from './Search';
import { routes, secondaryRoutes } from './MenuItems';

const Header = () => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isAuthenticated = useSelector((state) => !!state.session.token);
  const user = useSelector((state) => state.session.user);

  return (
    <Stack
      direction="row"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pr: 3,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4em',
        backgroundColor: 'primary.main',
        zIndex: 1,
        py: 1,
        boxShadow: '10px 0 20px rgba(0, 0, 0, 0.4)',
      }}
      spacing={2}
    >
      <Stack
        direction="row"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!isMobileScreen && (
          <>
            <Button component={Link} to="/" sx={{ p: 0, mr: '2.5em' }}>
              <Box
                component="header"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pl: 1,
                }}
              >
                <img
                  src="/Aftermatch.png"
                  alt="Logo"
                  style={{ width: '16em', height: '6.5em' }}
                />
              </Box>
            </Button>
          </>
        )}
        <Search />
      </Stack>
      {isMobileScreen ? (
        <List sx={{ display: 'flex', flexDirection: 'row' }}>
          {routes.map((item, index) => (
            <ListItem key={index} sx={{ p: 0, width: '3rem' }}>
              <ListItemButton
                component={Link}
                to={item.route}
                sx={{ p: 0, borderRadius: '50%' }}
              >
                <ListItemIcon
                  className="icon"
                  sx={{
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
          <MenuButton aria-label="Open settings" className="icon">
            {secondaryRoutes.find((route) => route.text === 'Settings').icon}
          </MenuButton>
        </List>
      ) : (
        <>
          {isAuthenticated ? (
            <Stack
              direction="row"
              sx={{
                py: 2.5,
                px: 2,
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuButton
                aria-label="Open profile"
                component={Link}
                to="/profile"
                direction="row"
                sx={{
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    borderRadius: '10%',
                  },
                }}
              >
                <Avatar
                  sizes="small"
                  alt="profile-picture"
                  src={user?.profilePicture}
                  sx={{ width: 36, height: 36 }}
                />
                {!isSmallScreen && (
                  <Box sx={{ mx: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        lineHeight: '12px',
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                      }}
                    >
                      {user?.displayName.trim().length === 0
                        ? user?.email
                        : user?.displayName}
                    </Typography>
                  </Box>
                )}
              </MenuButton>
              <Badge
                variant="dot"
                overlap="circular"
                color="primary"
                sx={{
                  '& .MuiBadge-dot': {
                    backgroundColor: theme.palette.error.main,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    border: '1px solid white',
                  },
                }}
              >
                {/* <NotificationsMenu /> */}
              </Badge>
              <OptionsMenu />
              <Box sx={{ paddingLeft: '0.5em', width: '1.5em' }}>
                <DarkModeSwitch showLabel={false} />
              </Box>
            </Stack>
          ) : (
            <Stack direction="row">
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.text.secondary,
                  px: 2,
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                  marginLeft: '0.5rem !important',
                  borderRadius: '3rem',
                  gap: 1,
                  '&:hover': {
                    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)',
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              >
                <Typography sx={{ color: theme.palette.primary.main }}>
                  Login
                </Typography>
                <LoginIcon sx={{ color: theme.palette.primary.main }} />
              </Button>
              <Box sx={{ ml: '1em', width: '1.5em' }}>
                <DarkModeSwitch showLabel={false} />
              </Box>
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};

export default memo(Header);
