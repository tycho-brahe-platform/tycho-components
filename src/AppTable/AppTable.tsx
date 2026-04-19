import cx from "classnames";
import { ThemeProvider } from "@emotion/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import AppPagination from "../AppPagination";
import { tableTheme } from "./AppTableTheme";
import "./styles.scss";
import { AppPage } from "./types/AppPage";

type Props = {
  columns: any;
  data: AppPage<any>;
  pagination: PaginationState;
  setPagination: (p: PaginationState) => void;
  sorting: SortingState;
  setSorting: (s: SortingState) => void;
  className?: string;
  onClickRow?: (row: any, col: any) => void;
  onMouseEnter?: (row: any) => void;
  onMouseLeave?: (row: any) => void;
  hiddenColumns?: string[];
  numItens?: number[];
};

export default function AppTable({
  columns,
  data,
  pagination,
  setPagination,
  sorting,
  setSorting,
  className,
  onClickRow,
  onMouseEnter,
  onMouseLeave,
  hiddenColumns,
  numItens,
}: Props) {
  const { content, totalPages, totalElements } = data;

  const columnVisibility = hiddenColumns?.reduce(
    (acc, col) => {
      acc[col] = false;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  const table = useReactTable({
    data: content || [],
    columns,
    pageCount: totalPages,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updaterOrValue) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      if (
        newSorting &&
        sorting &&
        JSON.stringify(newSorting) !== JSON.stringify(sorting)
      ) {
        setSorting(newSorting);
      }
    },
  });

  const tableClass = cx("ds-table", {
    [className || ""]: className || "",
  });

  return (
    <ThemeProvider theme={tableTheme}>
      <div className={tableClass}>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const toggleSortingHandler =
                      header.column.getToggleSortingHandler();

                    return (
                      <TableCell
                        key={header.id}
                        onClick={(event) => {
                          if (toggleSortingHandler) {
                            toggleSortingHandler(event);
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          width: `${header.column.columnDef.size}%`,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted()
                          ? header.column.getIsSorted() === "desc"
                            ? " 🔽"
                            : " 🔼"
                          : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onMouseEnter={() => onMouseEnter && onMouseEnter(row)}
                  onMouseLeave={() => onMouseLeave && onMouseLeave(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() =>
                        onClickRow && onClickRow(row.original, cell.column)
                      }
                      className={
                        cell.id.includes("__") ? cell.id.split("__")[1] : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AppPagination
          totalElements={totalElements}
          pagination={pagination}
          setPagination={setPagination}
          numItens={numItens}
        />
      </div>
    </ThemeProvider>
  );
}
