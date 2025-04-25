import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Menu,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  NotificationsRounded as NotificationsRoundedIcon,
  PersonAdd,
  SportsSoccer,
  Message,
  Scoreboard,
  EmojiPeople,
} from '@mui/icons-material';

import MenuButton from './MenuButton';

const NotificationsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const notifications = [
    {
      text: 'You have a new friend request!',
      icon: (
        <PersonAdd
          sx={{
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.text.tertiary
                : theme.palette.primary.main,
          }}
        />
      ),
    },
    {
      text: 'You have a new message!',
      icon: (
        <Message
          sx={{
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.text.tertiary
                : theme.palette.primary.main,
          }}
        />
      ),
    },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MenuButton
        aria-label="Open notifications"
        onClick={handleClick}
        sx={{ borderColor: 'transparent', color: 'white' }}
      >
        <NotificationsRoundedIcon />
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
            width: '25em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: '4em !important',
            right: 0,

            borderRadius: '10px',
          },
        }}
      >
        <List>
          {notifications.map((item, index) => (
            <>
              <ListItemButton key={index} sx={{ borderRadius: '10px' }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </ListItemButton>
              {index < notifications.length - 1 && (
                <Divider
                  color={theme.palette.text.tertiary}
                  width="100%"
                  sx={{ opacity: 0.5 }}
                />
              )}
            </>
          ))}
        </List>
      </Menu>
    </>
  );
};

export default NotificationsMenu;
