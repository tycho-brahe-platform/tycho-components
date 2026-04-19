import { createTheme } from '@mui/material/styles';

export const tableTheme = (outerTheme: any) =>
  createTheme({
    ...outerTheme,
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: 'none',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            minWidth: 650,
            border: 0,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: '#F9FAFB',
            fontWeight: 'bold',
            padding: '4px 0px 4px 12px',
            height: '48px',
          },
          body: {
            cursor: 'pointer',
            padding: '4px 0px 4px 12px',
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            display: 'flex',
            justifyContent: 'flex-end',
          },
        },
      },
    },
  });
