import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ text = 'Loading...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 2 }}>
    <CircularProgress sx={{ color: '#e94560' }} />
    <Typography variant="body2" color="text.secondary">{text}</Typography>
  </Box>
);

export default Loader;
