import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type PaginationState,
  type RowData,
} from '@tanstack/react-table';
import {
  MdArrowDropUp,
  MdArrowDropDown,
  MdSubdirectoryArrowRight,
} from 'react-icons/md';
import { Fragment, useEffect, useState, type ReactNode } from 'react';
import Pagination from './Pagination';
import clsx from 'clsx';

interface MainTableProps<TData> {
  sorting?: boolean;
  data: TData[];
  subRows?: (row: TData) => TData[] | undefined;
  subLabels?: string[];
  subLabelPosition?: number;
  columns: ColumnDef<TData, any>[];
  renderHeader?: (
    table: ReturnType<typeof useReactTable<TData>>,
  ) => React.ReactNode;
  renderBody?: (
    table: ReturnType<typeof useReactTable<TData>>,
  ) => React.ReactNode;
  tabletop?: ReactNode;
  searchFilters?: { field: string; value: string }[];
  tblClassName?: string;
  initialExpanded?: boolean;
  disablePagination?: boolean;
  customTableClass?: string;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    tdClassNames?: string;
    thClassNames?: string;
    tdColSpan?: number;
    rowSpan?: number;
    hidden?: boolean;
  }
}

const Tabel = <TData,>({
  sorting = true,
  data,
  columns,
  renderHeader,
  renderBody,
  tabletop,
  subRows,
  subLabels,
  subLabelPosition,
  searchFilters,
  tblClassName,
  initialExpanded = false,
  disablePagination = false,
  customTableClass,
}: MainTableProps<TData & { group?: string }>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    if (searchFilters && searchFilters.length > 0) {
      const filters = searchFilters
        .filter((f) => f.value)
        .map((f) => ({ id: f.field, value: f.value }));
      setColumnFilters(filters);
    } else {
      setColumnFilters([]);
    }
    setExpanded({});
  }, [searchFilters]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      enableSorting: sorting,
    },
    onExpandedChange: setExpanded,
    getSubRows: subRows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(disablePagination
      ? {}
      : {
          getPaginationRowModel: getPaginationRowModel(),
          onPaginationChange: setPagination,
        }),
    onColumnFiltersChange: setColumnFilters,
    filterFromLeafRows: true,
    maxLeafRowFilterDepth: subLabels?.length,
    state: {
      expanded,
      columnFilters,
      ...(disablePagination ? {} : { pagination }),
    },
  });

  const expandAllRows = (rows: any[]): ExpandedState => {
    const expanded: ExpandedState = {};
    const traverse = (rws: any[]) => {
      rws.forEach((row) => {
        expanded[row.id] = true;
        if (row.subRows?.length) traverse(row.subRows);
      });
    };
    traverse(rows);
    return expanded;
  };

  useEffect(() => {
    if (initialExpanded) {
      setExpanded(expandAllRows(table.getRowModel().rows));
    }
  }, [data, initialExpanded, table]);

  const tableClass = clsx(tblClassName, 'w-full');

  // ✅ pilih model baris sesuai pagination
  const rowModel = disablePagination
    ? table.getPrePaginationRowModel() // semua data
    : table.getRowModel(); // data per halaman

  const baseTableClass = 'table-responsive';

  return (
    <div>
      {tabletop && <div className='flex mb-2'>{tabletop}</div>}

      <div className={clsx(!customTableClass && baseTableClass, customTableClass)}>
        <table className={tableClass || undefined}>
          <thead>
            {renderHeader
              ? renderHeader(table)
              : table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta || {};
                      if (meta.hidden) return null;
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          rowSpan={meta.rowSpan ?? 1}
                          className={meta.thClassNames}
                        >
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'flex flex-row justify-center items-center cursor-pointer'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: <MdArrowDropUp />,
                              desc: <MdArrowDropDown />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
          </thead>

          <tbody>
            {renderBody ? (
              renderBody(table)
            ) : rowModel.rows.length > 0 ? (
              rowModel.rows.map((row) => {
                const label = subLabels?.[row.depth];
                return (
                  <Fragment key={row.id}>
                    <tr>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          colSpan={cell.column.columnDef.meta?.tdColSpan}
                          className={cell.column.columnDef.meta?.tdClassNames}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && subLabels && (
                      <tr>
                        <td
                          colSpan={
                            table.getAllLeafColumns().length -
                            (subLabelPosition ?? 1)
                          }
                        ></td>
                        <td colSpan={subLabelPosition}>
                          <strong
                            className='inline-flex'
                            style={{ paddingLeft: `${row.depth * 1}rem` }}
                          >
                            <MdSubdirectoryArrowRight />
                            {label}
                          </strong>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={table.getAllLeafColumns().length}
                  className='text-center py-4'
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ pagination hanya tampil jika aktif */}
      {!disablePagination && <Pagination table={table} />}
    </div>
  );
};

export default Tabel;
