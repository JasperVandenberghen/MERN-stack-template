import { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import {
  LogoutRounded as LogoutRoundedIcon,
  MoreVertRounded as MoreVertRoundedIcon,
  Person2Rounded,
  SettingsRounded,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';

import { logout } from '../redux/sessionSlice';
import { persistor } from '../redux/store';
import MenuButton from './MenuButton';

const routes = [
  { text: 'Profile', icon: <Person2Rounded />, route: '/profile' },
  { text: 'Settings', icon: <SettingsRounded />, route: '/settings' },
];

const OptionsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    persistor.purge();
    dispatch(logout());
    navigate('/login');
    console.log('User logged out successfully');
    handleClose();
  };

  return (
    <>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent', color: 'white' }}
      >
        <MoreVertRoundedIcon className="icon" />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '.MuiList-root': {
            padding: '4px',
          },
          '.MuiPaper-root': {
            padding: 0,
            width: '10em',
            top: '4em !important',
            right: 0,
          },
        }}
      >
        <List>
          {routes.map((item, index) => (
            <ListItemButton
              key={index}
              component={Link}
              to={item.route}
              sx={{ borderRadius: '10px' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </List>
      </Menu>
    </>
  );
};

export default memo(OptionsMenu);
