import React from 'react';
import { Skeleton, Stack } from '@mui/material';
import '../../styles/components/Skeleton.scss';

interface HMSSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number; // 🚀 Useful for generating multiple lines
  animation?: 'pulse' | 'wave' | false;
  className?: string;
}

const HMSSkeleton: React.FC<HMSSkeletonProps> = ({ 
  variant = 'rounded', 
  width, 
  height, 
  count = 1, 
  animation = 'wave',
  className = ''
}) => {
  // Generate an array based on the count prop
  const skeletons = Array.from({ length: count });

  return (
    <Stack spacing={1} className={`hms-skeleton-stack ${className}`}>
      {skeletons.map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
          animation={animation}
          className="hms-custom-skeleton"
          sx={{
            // 🚀 Matches your 16px-24px rounded design
            borderRadius: variant === 'circular' ? '50%' : '16px',
            backgroundColor: 'rgba(79, 100, 255, 0.05)', // Subtle blue tint
          }}
        />
      ))}
    </Stack>
  );
};

export default HMSSkeleton;