import {
  Box,
  Button,
  Card,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

const ReCAPTCHA = lazy(() => import('react-google-recaptcha'));

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaVisible, setCaptchaVisible] = useState(false);

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const captchaKey = `captcha-${isDarkMode ? 'dark' : 'light'}`;

  const navigate = useNavigate();

  const handleCaptchaChange = useCallback((value) => {
    setCaptchaValue(value);
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [navigate]);

  const validateInputs = () => {
    const isValidEmail = email && /\S+@\S+\.\S+/.test(email);
    const isValidPassword = password && password.length >= 6;
    const isValidName = name && name.length >= 1;

    setEmailError(!isValidEmail);
    setPasswordError(!isValidPassword);
    setNameError(!isValidName);

    return isValidEmail && isValidPassword && isValidName;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setCaptchaVisible(true);

    if (!captchaValue) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setCaptchaVisible(false);
        localStorage.setItem('idToken', result.token);
        navigate('/login');
      } else {
        setError(
          'Registration failed. Please try again or check your email for more info if you already have an account.',
        );
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again.');
    }
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
            width: isMobileScreen ? '80%' : '25em',
            gap: 3,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                value={name}
                error={nameError}
                helperText={nameError ? 'Name is required.' : ''}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={email}
                error={emailError}
                helperText={
                  emailError ? 'Please enter a valid email address.' : ''
                }
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                value={password}
                error={passwordError}
                helperText={
                  passwordError
                    ? 'Password must be at least 6 characters long.'
                    : ''
                }
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
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
              fullWidth
              variant="contained"
              disabled={
                !email ||
                !password ||
                !name ||
                (captchaVisible && !captchaValue)
              }
              onClick={(e) => {
                if (!validateInputs()) e.preventDefault();
              }}
            >
              Sign up
            </Button>
          </Box>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/login" variant="body2" sx={{ alignSelf: 'center' }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Register;
