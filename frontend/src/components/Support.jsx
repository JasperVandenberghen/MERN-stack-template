import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import emailjs from '@emailjs/browser';
import {
  Card,
  Button,
  TextField,
  Box,
  Collapse,
  Alert,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const ReCAPTCHA = lazy(() => import('react-google-recaptcha'));

const Support = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    severity: '',
    open: false,
  });

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const captchaKey = `captcha-${isDarkMode ? 'dark' : 'light'}`;

  useEffect(() => {
    import.meta.env.VITE_EMAILJS_APP_PUBLIC_KEY
      ? emailjs.init(import.meta.env.VITE_EMAILJS_APP_PUBLIC_KEY)
      : console.error('EmailJS public key is not defined.');
  }, []);

  const handleCaptchaChange = useCallback((value) => {
    setCaptchaValue(value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setAlert({
        message: 'Please complete the CAPTCHA.',
        severity: 'error',
        open: true,
      });
      return;
    }

    const { name, email, message } = form;

    if (validateEmail() && name && email && message) {
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_APP_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_APP_TEMPLATE_ID,
          { user_name: name, user_email: email, message },
        );
        setAlert({
          message: 'Your message has been sent successfully!',
          severity: 'success',
          open: true,
        });
        setForm({ name: '', email: '', message: '' });
        setCaptchaVisible(false);
        handleCloseAlert();
      } catch (error) {
        console.error('Error sending email:', error);
        setAlert({
          message:
            'Something went wrong sending email. Please try again later.',
          severity: 'error',
          open: true,
        });
      }
    } else {
      setAlert({
        message: 'Something went wrong sending email. Please try again later.',
        severity: 'error',
        open: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    if (form.name && form.email && form.message) {
      setCaptchaVisible(true);
    }
  };

  const handleCloseAlert = () => {
    setTimeout(() => {
      setAlert({ message: '', severity: '', open: false });
    }, 5000);
  };

  const validateEmail = () =>
    form.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) : false;

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
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isMobileScreen ? '100%' : '25em',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mt: 2 }}
            >
              Have a question, feedback, or collaboration idea? We&apos;d love
              to hear from you! Fill out the form below, and we&apos;ll get back
              to you as soon as possible.
            </Typography>
          </Box>
          {alert && (
            <Collapse in={alert.open} sx={{ m: 0 }}>
              <Alert severity={alert.severity} onClose={handleCloseAlert}>
                {alert.message}
              </Alert>
            </Collapse>
          )}
          <TextField
            label="name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            sx={{ mt: 2 }}
          />
          <TextField
            label="email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />

          <TextField
            label="message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            name="message"
            value={form.message}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
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
            disabled={!form.email || !form.name || !form.message}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              Send
            </Typography>
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Support;
