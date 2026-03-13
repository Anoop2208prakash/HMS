import React from 'react';
import { CircularProgress, Box, Backdrop } from '@mui/material';
import '../../styles/components/Loader.scss';

interface HMSLoaderProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';
  fullScreen?: boolean; // If true, blurs the whole background
}

const HMSLoader: React.FC<HMSLoaderProps> = ({ 
  size = 40, 
  color = 'primary', 
  fullScreen = false 
}) => {
  const loader = (
    <Box className="hms-loader-box">
      <CircularProgress 
        size={size} 
        color={color} 
        thickness={4} // Makes it look a bit more bold/modern
      />
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        open={true}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(4px)'
        }}
      >
        {loader}
      </Backdrop>
    );
  }

  return loader;
};

export default HMSLoader;