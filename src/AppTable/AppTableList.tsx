import cx from 'classnames';
import { ThemeProvider } from '@emotion/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { tableTheme } from './AppTableTheme';
import './styles.scss';
import { useEffect } from 'react';

type Props = {
  columns: ColumnDef<any, any>[]; // Define properly if needed
  data: any[];
  className?: string;
  onClickRow?: (row: any) => void;
  onMouseEnter?: (row: any) => void;
  onMouseLeave?: (row: any) => void;
  hiddenColumns?: string[];
  filter?: [string, string];
};

export default function AppTableList({
  columns,
  data,
  className = '',
  onClickRow,
  onMouseEnter,
  onMouseLeave,
  hiddenColumns,
  filter,
}: Props) {
  const columnVisibility = hiddenColumns?.reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as Record<string, boolean>
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleClickRow = (row: Row<any>) => {
    if (onClickRow) onClickRow(row.original);
  };

  useEffect(() => {
    if (!filter) return;
    if (filter[1]) {
      table.getColumn(filter[0])?.setFilterValue(filter[1]);
    } else {
      table.getColumn(filter[0])?.setFilterValue(undefined);
    }
  }, [filter]);

  const tableClass = cx('ds-table', {
    [className || '']: className || '',
  });

  return (
    <ThemeProvider theme={tableTheme}>
      <div className={tableClass}>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleClickRow(row)}
                  onMouseEnter={() => onMouseEnter?.(row)}
                  onMouseLeave={() => onMouseLeave?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </ThemeProvider>
  );
}
