import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material'; 
import { Calendar } from 'lucide-react';
import '../../styles/components/DatePicker.scss';

interface HMSDatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

const HMSDatePicker: React.FC<HMSDatePickerProps> = ({ 
  label, 
  value, 
  onChange, 
  error, 
  helperText,
  fullWidth = true 
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="hms-datepicker-group">
        {label && <label className="hms-input-label">{label}</label>}
        
        <DatePicker
          value={value}
          onChange={onChange}
          // 🚀 FIX: Using 'slots' for the icon and 'slotProps' for the styling
          slots={{
            openPickerIcon: () => <Calendar size={18} className="picker-icon" />
          }}
          slotProps={{
            textField: {
              fullWidth: fullWidth,
              error: error,
              helperText: helperText,
              className: "hms-custom-datepicker-input",
              // We remove InputProps entirely to avoid the 'any' conflict
            },
            popper: {
              className: "hms-calendar-popper"
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default HMSDatePicker;