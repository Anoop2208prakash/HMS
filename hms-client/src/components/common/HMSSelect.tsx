import React from 'react';
import { 
  InputLabel, 
  MenuItem, 
  FormControl, 
  Select,
  FormHelperText,
  type SelectChangeEvent,
} from '@mui/material';
import { ChevronDown } from 'lucide-react';
import '../../styles/components/Select.scss';

interface Option {
  value: string | number;
  label: string;
}

interface HMSSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  minWidth?: number;
  fullWidth?: boolean;
  error?: string;
}

const HMSSelect: React.FC<HMSSelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  minWidth = 120, 
  fullWidth = false,
  error
}) => {
  
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value.toString());
  };

  return (
    <FormControl 
      className="hms-select-container" 
      sx={{ m: 0, minWidth: minWidth }} 
      fullWidth={fullWidth}
      error={!!error}
    >
      <InputLabel id={`hms-select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`hms-select-label-${label}`}
        id={`hms-select-${label}`}
        value={value}
        onChange={handleChange}
        label={label}
        className="hms-custom-select"
        IconComponent={() => <ChevronDown size={18} className="select-icon" />}
        // 🚀 THE FIX: MenuProps configuration
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            className: "hms-dropdown-portal", // Target this in SCSS
          },
          // Ensures the menu opens directly below the input
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} className="hms-menu-item">
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default HMSSelect;