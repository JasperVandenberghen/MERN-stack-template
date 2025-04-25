import { useState } from 'react';
import { Box, TextField, Button, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const PasswordDialog = ({ title, description, onSubmit, onDismiss }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const theme = useTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInput()) return;

    if (!password) {
      setError('Password is required');
    } else {
      setError('');
      onSubmit(password);
      setIsOpen(false);
    }
  };

  const validateInput = () => {
    const isValidPassword = password && password.length >= 6;

    if (!isValidPassword)
      setError('Password must be at least 6 characters long.');

    return isValidPassword;
  };

  return (
    <Modal open={isOpen}>
      <Box type="form" sx={style}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: '12px', color: theme.palette.text.tertiary }}
        >
          {description}
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{ mt: 2, gap: 4 }} display="flex" justifyContent="center">
          <Button
            variant="contained"
            sx={{
              width: '100px',
              backgroundColor: theme.palette.background.default,
              color: theme.palette.primary.main,
            }}
            size="medium"
            onClick={onDismiss}
          >
            Cancel
          </Button>
          <Button
            sx={{ width: '100px' }}
            variant="contained"
            size="medium"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

PasswordDialog.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default PasswordDialog;
