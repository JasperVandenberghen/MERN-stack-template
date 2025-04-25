import {
  Box,
  Button,
  Checkbox,
  Card,
  FormControlLabel,
  Divider,
  FormLabel,
  useMediaQuery,
  FormControl,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Link,
} from '@mui/material';
import { Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useTheme } from '@mui/material/styles';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usePromiseModal } from '@prezly/react-promise-modal';

import { auth } from '../services/firebase';
import { handleGoogleSignIn } from '../utils/authUtils';
import { login, updateRememberMe } from '../redux/sessionSlice';
import PasswordDialog from './PasswordDialog';

const ReCAPTCHA = lazy(() => import('react-google-recaptcha'));

const Login = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [googleErrorMessage, setGoogleErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaValue, setCaptchaValue] = useState(null);

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const captchaKey = `captcha-${isDarkMode ? 'dark' : 'light'}`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rememberMeFromStore = useSelector((state) => state.session.rememberMe);

  const passwordDialog = usePromiseModal((props) => (
    <PasswordDialog {...props} />
  ));

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/');
    }
    setRememberMe(rememberMeFromStore);
  }, [navigate, rememberMeFromStore]);

  const handleRememberMeChange = (event) => {
    const isChecked = event.target.checked;
    setRememberMe(isChecked);
    dispatch(updateRememberMe(isChecked));
  };

  const handleCaptchaChange = useCallback((value) => {
    setCaptchaValue(value);
  }, []);

  /**
   * Handles login with email and password.
   * Prevents default form submission and validates user input.
   * If the input is valid, it signs in the user with their email and password.
   * If the sign in is successful, it dispatches a login action to the Redux store
   * and navigates to the home page.
   * If the sign in fails, it sets an error message.
   * @param {Event} event - The form submission event.
   * @returns {Promise<void>} - A promise that resolves when the login is complete.
   */
  const handleLoginWithCredentials = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const passwordValue = data.get('password');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        passwordValue,
      );
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      const result = await response.json();
      const user = result.user;

      const payload = {
        token: idToken,
        user,
      };

      if (response.ok) {
        dispatch(login(payload));
        navigate('/');
      } else {
        setErrorMessage('Login failed, please try again or register.');
        setFailedAttempts((prev) => prev + 1);
        setTimeout(() => setErrorMessage(null), 10000);
      }
    } catch {
      setErrorMessage('Login failed, please try again or register.');
      setFailedAttempts((prev) => prev + 1);
      setTimeout(() => setErrorMessage(null), 10000);
    }
  };

  const handleGoogleSignInWrapper = async () => {
    const result = await handleGoogleSignIn(
      passwordDialog,
      setGoogleErrorMessage,
    );
    if (result.error) {
      setGoogleErrorMessage(result.error);
      return;
    }

    const { idToken, googleToken } = result;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${googleToken}`,
          },
        },
      );

      const result = await response.json();

      const payload = {
        token: idToken,
        user: result.user,
      };

      if (response.ok) {
        dispatch(login(payload));
        navigate('/');
      } else {
        setErrorMessage('Login failed, please try again or register.');
        setTimeout(() => setErrorMessage(null), 10000);
        navigate('/');
      }
    } catch {
      setErrorMessage('Login failed, please try again or register.');
      setTimeout(() => setErrorMessage(null), 10000);
    }
  };

  /* TODO: consider creating a custom hook for form validation
   or centralized util function that can handle all validation to prevent code duplication
   also decide between using document.getElementById or useRef/useState for form inputs
   consider using yup for form validation in a refactor */
  /**
   * Validates the email and password inputs for the login form.
   * Checks that the email is a valid email address and that the password is at least 6 characters long.
   * Updates the error states for the email and password inputs and returns true if both are valid, false otherwise.
   * @returns {boolean} - true if both email and password inputs are valid, false otherwise
   */
  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const isValidEmail = email.value && /\S+@\S+\.\S+/.test(email.value);
    const isValidPassword = password.value && password.value.length >= 6;

    setEmailError(!isValidEmail);
    setEmailErrorMessage(
      isValidEmail ? '' : 'Please enter a valid email address.',
    );
    setPasswordError(!isValidPassword);
    setPasswordErrorMessage(
      isValidPassword ? '' : 'Password must be at least 6 characters long.',
    );

    return isValidEmail && isValidPassword;
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
            onSubmit={handleLoginWithCredentials}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 1,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: theme.palette.grey.main }}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>
            {errorMessage && (
              <Typography
                variant="body2"
                sx={{ color: theme.palette.error.main, textAlign: 'center' }}
              >
                {errorMessage}
              </Typography>
            )}
            {failedAttempts >= 3 && (
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  sx={{
                    color: theme.palette.grey.main,
                    '&.Mui-checked': {
                      color:
                        theme.palette.mode === 'dark'
                          ? theme.palette.text.primary
                          : theme.palette.primary.main,
                    },
                  }}
                />
              }
              label="Remember me"
              sx={{ color: theme.palette.text.primary }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!captchaValue && failedAttempts >= 3}
            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              <Link
                href="/reset-password"
                variant="body2"
                sx={{ alignSelf: 'center', color: theme.palette.text.primary }}
              >
                Forgot your password?
              </Link>
            </Typography>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGoogleSignInWrapper}
              startIcon={<Google />}
              sx={{ color: '#fff' }}
            >
              Sign in with Google
            </Button>
            {googleErrorMessage && (
              <Typography
                variant="body2"
                sx={{ color: theme.palette.error.main, textAlign: 'center' }}
              >
                {googleErrorMessage}
              </Typography>
            )}
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
          {passwordDialog.modal}
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
