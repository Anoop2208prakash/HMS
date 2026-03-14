import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridValidRowModel } from '@mui/x-data-grid';
import { Paper, Box, Typography } from '@mui/material';
import '../../styles/components/Table.scss';

interface HMSTableProps {
  title?: string;
  rows: GridValidRowModel[]; 
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  checkboxSelection?: boolean;
  // 🚀 ADD THIS LINE:
  rowHeight?: number; 
}

const HMSTable: React.FC<HMSTableProps> = ({ 
  title, 
  rows, 
  columns, 
  loading = false, 
  pageSize = 5,
  checkboxSelection = false,
  // 🚀 ADD THIS LINE:
  rowHeight = 52 
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
          // 🚀 PASS THE PROP DOWN TO THE MUI DATAGRID:
          rowHeight={rowHeight} 
          initialState={{ 
            pagination: { paginationModel } 
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          autoHeight
          className="hms-data-grid"
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(248, 250, 252, 0.5)',
              borderBottom: '1px solid #e2e8f0',
            },
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default HMSTable;