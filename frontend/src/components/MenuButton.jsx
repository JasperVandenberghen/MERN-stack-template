import PropTypes from 'prop-types';
import { Badge, IconButton } from '@mui/material';

const MenuButton = ({ showBadge = false, ...props }) => (
  <Badge
    color="error"
    variant="dot"
    invisible={!showBadge}
    sx={{ '& .MuiBadge-badge': { right: 2, top: 2 } }}
  >
    <IconButton size="small" {...props} />
  </Badge>
);

MenuButton.propTypes = {
  showBadge: PropTypes.bool,
};

export default MenuButton;
