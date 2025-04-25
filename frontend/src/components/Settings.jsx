import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import {
  Box,
  Button,
  Card,
  List,
  ListItem,
  TextField,
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Google,
  NotificationsActive,
  NotificationsOff,
  Visibility,
  VisibilityOff,
  Link,
  LinkOff,
} from '@mui/icons-material';
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  unlink,
} from 'firebase/auth';
import { usePromiseModal } from '@prezly/react-promise-modal';

import LanguageSwitch from './LanguageSwitch';
import DarkModeSwitch from './DarkModeSwitch';
import packageJson from '../../package.json';
import withAuth from '../hocs/withAuth';
import ResetPassword from './ResetPassword';
import { handleGoogleSignIn } from '../utils/authUtils';
import PasswordDialog from './PasswordDialog';

const ReCAPTCHA = lazy(() => import('react-google-recaptcha'));

const Settings = () => {
  const [isNotified, setIsNotified] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGoogleLinked, setIsGoogleLinked] = useState(
    localStorage.getItem('isGoogleLinked') === 'true',
  );
  const [googleErrorMessage, setGoogleErrorMessage] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePwCaptchaValue, setChangePwCaptchaValue] = useState(null);

  const auth = getAuth();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const captchaKey = `captcha-${isDarkMode ? 'dark' : 'light'}`;

  const passwordDialog = usePromiseModal((props) => (
    <PasswordDialog {...props} />
  ));

  useEffect(() => {
    setIsGoogleLinked(localStorage.getItem('isGoogleLinked') === 'true');
    setIsCheckingAuth(false);
  }, []);

  const handleCaptchaChange = useCallback((value) => {
    setChangePwCaptchaValue(value);
  }, []);

  const handleSwitchChange = (event) => {
    const { checked } = event.target;
    setIsNotified(checked);
  };

  const handleChangePassword = async () => {
    if (newPassword === oldPassword) {
      setError('The old and new password input cannot be the same');
      setTimeout(() => {
        setError('');
      }, 10000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setTimeout(() => {
        setError('');
      }, 10000);
      return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully');
      setTimeout(() => {
        setSuccess('');
      }, 4000);
      setError('');
    } catch {
      setError(
        'Error updating password. Please check your input and try again',
      );
      setSuccess('');
    }
  };

  const handleLinkGoogle = async () => {
    const result = await handleGoogleSignIn(
      passwordDialog,
      setGoogleErrorMessage,
    );
    if (result.error) {
      setGoogleErrorMessage(
        'Something went wrong while linking your Google account, please try again',
      );
      setTimeout(() => {
        setGoogleErrorMessage('');
      }, 10000);
      return;
    }

    setSuccess('Google account linked successfully');
    localStorage.setItem('isGoogleLinked', true);
    setIsGoogleLinked(true);
    setTimeout(() => {
      setSuccess('');
    }, 10000);
    setError('');
  };

  const handleUnlinkGoogle = async () => {
    try {
      await unlink(auth.currentUser, 'google.com');
      setSuccess('Google account unlinked successfully');
      localStorage.setItem('isGoogleLinked', false);
      setTimeout(() => {
        setSuccess('');
      }, 10000);
      setIsGoogleLinked(false);
      setError('');
    } catch {
      setError('Something went wrong, please try again');
      setSuccess('');
    }
  };

  const Captcha = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          key={captchaKey}
          onChange={handleCaptchaChange}
          theme={isDarkMode ? 'dark' : 'light'}
        />
      </Suspense>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          boxShadow: 'none',
          padding: '0 2em 0 2em',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isMobileScreen ? '100%' : '25em',
            gap: 3,
            marginTop: 2,
          }}
        >
          <FormGroup>
            <DarkModeSwitch />
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  name="notifications"
                  icon={<NotificationsOff />}
                  checkedIcon={<NotificationsActive />}
                  onChange={handleSwitchChange}
                  sx={{
                    marginLeft: 0.2,
                    '.Mui-checked + .MuiSwitch-track': {
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? '#F1C40F !important'
                          : 'primary.main',
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
                      color: isNotified
                        ? theme.palette.mode === 'dark'
                          ? 'blue.main'
                          : 'primary.main'
                        : 'error.main',
                      backgroundColor: 'background.default',
                      borderRadius: '50%',
                      boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                />
              }
              label={
                isNotified ? 'Receive Notifications' : 'Block Notifications'
              }
            />
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                type={showOldPassword ? 'text' : 'password'}
                name="old-password"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoFocus
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowOldPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: theme.palette.grey.main }}
                        >
                          {showOldPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                type={showNewPassword ? 'text' : 'password'}
                name="new-password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: theme.palette.grey.main }}
                        >
                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm-password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          edge="end"
                          sx={{ color: theme.palette.grey.main }}
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {oldPassword && newPassword && confirmPassword && <Captcha />}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!changePwCaptchaValue}
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </FormControl>
          </FormGroup>
          <ResetPassword />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success">{success}</Typography>}
          </Box>
          <Box>
            <List
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <ListItem
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Google
                  sx={{ color: isGoogleLinked ? 'primary.main' : 'grey.main' }}
                />
                <Tooltip
                  title={
                    isGoogleLinked
                      ? 'Unlink Google Account'
                      : 'Link Google Account'
                  }
                >
                  <Box>
                    <Button
                      variant="contained"
                      sx={{
                        width: '100%',
                        backgroundColor: isGoogleLinked
                          ? 'primary.main'
                          : 'grey.main',
                        color: isGoogleLinked
                          ? 'text.secondary'
                          : 'text.primary',
                      }}
                      onClick={
                        isGoogleLinked ? handleUnlinkGoogle : handleLinkGoogle
                      }
                      disabled={isCheckingAuth}
                    >
                      {isGoogleLinked ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography>Linked</Typography>
                          <Link />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography>Unlinked</Typography>
                          <LinkOff />
                        </Box>
                      )}
                    </Button>
                  </Box>
                </Tooltip>
              </ListItem>
              <Typography color="error">{googleErrorMessage}</Typography>
            </List>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LanguageSwitch />
            <Typography variant="body2">
              App Version: v{packageJson.version}
            </Typography>
          </Box>
        </Box>
      </Card>
      {passwordDialog.modal}
    </Box>
  );
};

export default withAuth(Settings);
