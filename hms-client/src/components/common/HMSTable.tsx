import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridValidRowModel } from '@mui/x-data-grid';
import { Paper, Box, Typography, type SxProps } from '@mui/material';
// 🚀 Import SxProps and Theme for TypeScript safety
import '../../styles/components/Table.scss';
import type { Theme } from '@emotion/react';

interface HMSTableProps {
  title?: string;
  rows: GridValidRowModel[]; 
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  checkboxSelection?: boolean;
  rowHeight?: number; 
  // 🚀 ADD THIS: Allows passing custom MUI styles
  sx?: SxProps<Theme>; 
}

const HMSTable: React.FC<HMSTableProps> = ({ 
  title, 
  rows, 
  columns, 
  loading = false, 
  pageSize = 5,
  checkboxSelection = false,
  rowHeight = 52,
  sx // 🚀 Destructure the new prop
}) => {
  const paginationModel: GridPaginationModel = { page: 0, pageSize };

  return (
    <Box className="hms-table-container">
      {title && (
        <Typography variant="h6" className="table-title">{title}</Typography>
      )}
      <Paper className="hms-table-paper">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowHeight={rowHeight} 
          initialState={{ 
            pagination: { paginationModel } 
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          autoHeight
          className="hms-data-grid"
          // 🚀 FIX: Merge default styles with the passed 'sx' prop
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(248, 250, 252, 0.5)',
              borderBottom: '1px solid #e2e8f0',
            },
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            ...sx // Apply custom styles here
          }}
        />
      </Paper>
    </Box>
  );
};

export default HMSTable;