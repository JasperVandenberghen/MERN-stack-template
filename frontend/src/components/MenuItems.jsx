import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  HomeRounded,
  FavoriteRounded,
  SettingsRounded,
  HelpRounded,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

export const routes = [
  { text: 'Home', icon: <HomeRounded />, route: '/' },
];

export const secondaryRoutes = [
  { text: 'Settings', icon: <SettingsRounded />, route: '/settings' },
  { text: 'Support', icon: <HelpRounded />, route: '/support' },
];

const MenuItems = () => {
  const location = useLocation();

  return (
    <Stack
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}
    >
      <List sx={{ paddingTop: 0 }}>
        {routes.map((item, index) => (
          <ListItem key={index} sx={{ display: 'block', padding: 0 }}>
            <ListItemButton
              component={Link}
              to={item.route}
              sx={{
                backgroundColor:
                  location.pathname === item.route
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'transparent',
                boxShadow:
                  location.pathname === item.route
                    ? '0px 0px 10px rgba(0, 0, 0, 0.3)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <ListItemIcon
                className="icon"
                sx={{
                  color:
                    location.pathname === item.route
                      ? '#fff !important'
                      : 'inherit',
                  '.MuiSvgIcon-root': {
                    fontSize:
                      location.pathname === item.route ? '1.7rem' : 'normal',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '.MuiTypography-root': {
                    fontWeight:
                      location.pathname === item.route ? '600' : 'inherit',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryRoutes.map((item, index) => (
          <ListItem key={index} sx={{ padding: 0 }}>
            <ListItemButton
              component={Link}
              to={item.route}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <ListItemIcon className="icon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default MenuItems;
