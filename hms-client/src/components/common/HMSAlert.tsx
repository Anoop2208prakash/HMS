import React from 'react';
import { Alert, AlertTitle, IconButton, Collapse, Box } from '@mui/material';
import { X } from 'lucide-react';
import '../../styles/components/Alert.scss';

interface HMSAlertProps {
  severity: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const HMSAlert: React.FC<HMSAlertProps> = ({ severity, title, message, isOpen, onClose }) => {
  return (
    // Box adds fixed positioning so it stays on top of the form
    <Box sx={{ 
      position: 'fixed', 
      top: 20, 
      right: 20, 
      zIndex: 9999, 
      minWidth: '300px',
      maxWidth: '400px' 
    }}>
      <Collapse in={isOpen}>
        <Alert
          severity={severity}
          variant="filled" // "filled" makes the colors more visible like a toast
          action={
            <IconButton color="inherit" size="small" onClick={onClose}>
              <X size={18} />
            </IconButton>
          }
          sx={{ borderRadius: '12px', fontWeight: 600 }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default HMSAlert;