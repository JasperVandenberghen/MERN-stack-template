import Box from '@mui/material/Box';

import withAuth from '../hocs/withAuth';

const Home = () => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box component="main"></Box>
      </Box>
    </>
  );
};

export default withAuth(Home);
