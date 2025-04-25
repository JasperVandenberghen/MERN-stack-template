import { Card, CardContent, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CardAlert = () => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        mx: 2,
        my: 1,
        p: 1,
        borderRadius: 3,
        backgroundColor: theme.palette.background.default + '!important',
      }}
    >
      <CardContent>
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          Upgrade to Premium
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Get two weeks for free!
        </Typography>
        <Button variant="contained" size="small" fullWidth>
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardAlert;
