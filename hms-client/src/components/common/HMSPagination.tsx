import React from 'react';
import { Pagination, Stack, Box } from '@mui/material';
import '../../styles/components/Pagination.scss';

interface HMSPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  color?: 'primary' | 'secondary' | 'standard';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const HMSPagination: React.FC<HMSPaginationProps> = ({ 
  count, 
  page, 
  onChange, 
  color = 'primary', 
  size = 'medium',
  disabled = false 
}) => {
  return (
    <Box className="hms-pagination-wrapper">
      <Stack spacing={2} alignItems="center">
        <Pagination 
          count={count} 
          page={page} 
          onChange={onChange} 
          color={color} 
          size={size}
          disabled={disabled}
          className="hms-custom-pagination"
          // Show first and last buttons for better UX in large lists
          showFirstButton 
          showLastButton 
        />
      </Stack>
    </Box>
  );
};

export default HMSPagination;