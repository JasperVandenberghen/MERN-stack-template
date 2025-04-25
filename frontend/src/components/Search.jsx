import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import useMediaQuery from '@mui/material/useMediaQuery';

const Search = () => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <FormControl
        sx={{ width: isMobileScreen ? '80%' : '30rem' }}
        variant="outlined"
      >
        <OutlinedInput
          size="small"
          id="search"
          placeholder="Search…"
          sx={{
            flexGrow: 1,
            bgcolor: theme.palette.background.default,
            borderRadius: '15px',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" className="icon" />
            </InputAdornment>
          }
          inputProps={{
            'aria-label': 'search',
          }}
        />
      </FormControl>
    </>
  );
};

export default Search;
