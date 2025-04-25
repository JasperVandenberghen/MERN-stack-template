import { useDispatch, useSelector } from 'react-redux';
import { Switch, FormControlLabel } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import PropTypes from 'prop-types';

import { toggleDarkMode } from '../redux/themeSlice';

const DarkModeSwitch = ({ showLabel = true }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleSwitchChange = (event) => {
    const { checked } = event.target;
    dispatch(toggleDarkMode(checked));
  };

  return (
    <FormControlLabel
      control={
        <Switch
          disableRipple
          color="primary"
          icon={<LightMode color={'info'} />}
          checkedIcon={<DarkMode color={'info'} />}
          name="dark-mode"
          checked={isDarkMode}
          onChange={handleSwitchChange}
          sx={{
            '.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#F1C40F !important',
            },
            '.MuiSwitch-switchBase:hover': {
              backgroundColor: 'transparent',
            },
            '& .MuiSvgIcon-root': {
              position: 'absolute',
              top: '40%',
              left: '50%',
              zIndex: 1,
              fontSize: '23px',
              backgroundColor: 'background.default',
              borderRadius: '50%',
              boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
            },
          }}
        />
      }
      label={showLabel ? (isDarkMode ? 'Dark Mode' : 'Light Mode') : ''}
    />
  );
};

DarkModeSwitch.propTypes = {
  showLabel: PropTypes.bool,
};

export default DarkModeSwitch;
