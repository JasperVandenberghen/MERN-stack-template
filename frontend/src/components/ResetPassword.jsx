import { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  FormControl,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';

const ReCAPTCHA = lazy(() => import('react-google-recaptcha'));

const ResetPassword = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaVisible, setCaptchaVisible] = useState(false);

  const isAuthenticated = useSelector((state) => !!state.session.token);
  const user = useSelector((state) => state.session.user);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const captchaKey = `captcha-${isDarkMode ? 'dark' : 'light'}`;

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmailValue(user.email);
    }
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    if (error || infoMessage) {
      const timer = setTimeout(
        () => (error ? setError(null) : setInfoMessage(null)),
        10000,
      );
      return () => clearTimeout(timer);
    }
  }, [error, infoMessage]);

  const handleCaptchaChange = useCallback((value) => {
    setCaptchaValue(value);
    setError('');
  }, []);

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setCaptchaVisible(true);

    if (!captchaValue) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    if (!validateEmail()) return;

    const email = isAuthenticated
      ? user?.email
      : new FormData(event.currentTarget).get('email');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok || response.status === '204') {
        setInfoMessage(
          'If an account exists for this email, a password reset link has been sent. Check your spam folder as well.',
        );
      } else {
        setError(
          response.status === 429
            ? 'You can only reset your password once every 5 minutes.'
            : 'Error resetting password. Please check your input or try again later.',
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  //TODO: refactor to centralized validation later
  const validateEmail = () => {
    const email = document.getElementById('email');
    const isValidEmail = email.value && /\S+@\S+\.\S+/.test(email.value);

    setEmailError(!isValidEmail);
    setEmailErrorMessage(
      isValidEmail ? '' : 'Please enter a valid email address.',
    );

    return isValidEmail;
  };

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
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 3,
          }}
        >
          <Box
            component="form"
            onSubmit={handlePasswordReset}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <FormControl>
              <Tooltip title="You cannot change your email address." arrow>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={isAuthenticated ? user?.email : emailValue}
                  onChange={
                    isAuthenticated
                      ? undefined
                      : (e) => setEmailValue(e.target.value)
                  }
                  disabled={isAuthenticated}
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                />
              </Tooltip>
            </FormControl>
            {captchaVisible && (
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
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={captchaVisible && !captchaValue}
            >
              Reset Password
            </Button>
            {infoMessage && !error && (
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.main, textAlign: 'center' }}
              >
                {infoMessage}
              </Typography>
            )}
            {error && (
              <Typography
                variant="body2"
                sx={{ color: theme.palette.error.main, textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ResetPassword;
