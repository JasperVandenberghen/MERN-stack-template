import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  useMediaQuery,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PhotoCamera, AccountCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import withAuth from '../hocs/withAuth';
import { logout, updateUser } from '../redux/sessionSlice';
import { persistor } from '../redux/store';

const Profile = () => {
  const session = useSelector((state) => state.session);
  const user = session.user;
  const idToken = session.token;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (file) => {
    if (!file) return;

    const maxSize = 1 * 1024 * 1024;

    if (file.size > maxSize) {
      setError('File size exceeds the 1MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setProfilePicture(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);
    formData.append('displayName', displayName ?? '');

    //check if data has changed, otherwise do nothing
    if (!profilePicture && !displayName) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/auth/profile`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok) {
        dispatch(updateUser(result.user));
        setSuccess(result.message);
        clearForm();
        setTimeout(() => setSuccess(null), 4000);
      } else setError(result.message);
    } catch (error) {
      console.error(error);
      setError('Error updating profile');
    }
  };

  const clearForm = () => {
    const name = document.getElementById('name').value.trim();
    if (name.length > 0) document.getElementById('name').value = '';
    setDisplayName(null);
    setProfilePicture(null);
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your account? This action is irreversible.',
    );
    if (!confirmation) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/auth/delete-account`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      const result = await response.json();
      if (response.ok) {
        persistor.purge();
        dispatch(logout());
        navigate('/login');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account.');
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
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: isMobileScreen ? '80%' : '25em',
            gap: 3,
          }}
        >
          <Box
            id="image-container"
            sx={{
              position: 'relative',
              height: 250,
              width: 250,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {imagePreview ? (
              <Box
                component="img"
                name="profile-picture"
                sx={{
                  height: 200,
                  width: 200,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                alt="Profile picture preview"
                src={imagePreview}
              />
            ) : user?.profilePicture ? (
              <Box
                component="img"
                name="profile-picture"
                sx={{
                  height: 200,
                  width: 200,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                alt="Profile picture"
                src={user?.profilePicture}
              />
            ) : (
              <AccountCircle
                sx={{
                  height: 250,
                  width: 250,
                  color:
                    theme.palette.mode === 'dark'
                      ? 'grey.main'
                      : 'primary.main',
                }}
              />
            )}
            <FormControl
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
              }}
            >
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  id="picture-upload"
                  name="file"
                  type="file"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleFileChange(selectedFile);
                    }
                  }}
                />
                <PhotoCamera
                  sx={{
                    color:
                      theme.palette.mode === 'dark'
                        ? 'grey.main'
                        : 'primary.main',
                  }}
                />
              </IconButton>
            </FormControl>
          </Box>
          <FormControl sx={{ gap: 1, width: '100%' }}>
            <FormLabel sx={{ color: theme.palette.text.primary }}>
              Email
            </FormLabel>
            <Tooltip title="Email cannot be changed" arrow>
              <TextField
                id="email"
                type="text"
                name="email"
                disabled
                placeholder={user?.email ?? ''}
                variant="outlined"
              />
            </Tooltip>
            <FormLabel
              htmlFor="name"
              sx={{ color: theme.palette.text.primary }}
            >
              Name
            </FormLabel>
            <TextField
              id="name"
              type="text"
              name="name"
              placeholder={user?.displayName ?? 'Your name'}
              fullWidth
              variant="outlined"
              onChange={(event) => setDisplayName(event.target.value)}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid ' + theme.palette.primary.main,
                },
              }}
            />
          </FormControl>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            sx={{ width: '100%' }}
          >
            Save
          </Button>
        </Box>
        <Box>
          {success && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                textAlign: 'center',
                mt: 2,
              }}
            >
              {success}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 5 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </Box>
      </Card>

      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default withAuth(Profile);
