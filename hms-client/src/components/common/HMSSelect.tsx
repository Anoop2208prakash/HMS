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
  label?: string; // 🚀 Changed to optional (?)
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  minWidth?: number;
  fullWidth?: boolean;
  error?: string;
  placeholder?: string;
}

const HMSSelect: React.FC<HMSSelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  minWidth = 120, 
  fullWidth = false,
  error,
  placeholder
}) => {
  
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value as string);
  };

  // Generate a unique ID fallback if no label is provided
  const selectId = label ? `hms-select-${label.replace(/\s+/g, '-').toLowerCase()}` : 'hms-select-custom';

  return (
    <FormControl 
      className="hms-select-container" 
      sx={{ m: 0, minWidth: minWidth }} 
      fullWidth={fullWidth}
      error={!!error}
    >
      {/* 🚀 Only render InputLabel if label prop exists */}
      {label && <InputLabel id={`${selectId}-label`}>{label}</InputLabel>}
      
      <Select
        labelId={label ? `${selectId}-label` : undefined}
        id={selectId}
        value={value}
        onChange={handleChange}
        label={label} // MUI uses this for the notched outline gap
        className="hms-custom-select"
        IconComponent={() => <ChevronDown size={18} className="select-icon" />}
        displayEmpty
        MenuProps={{
          PaperProps: {
            className: "hms-dropdown-menu-paper",
          },
          disableScrollLock: true,
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          transformOrigin: { vertical: 'top', horizontal: 'left' },
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
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