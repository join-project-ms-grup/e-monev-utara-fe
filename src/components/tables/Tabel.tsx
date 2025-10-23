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
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    filterFromLeafRows: true,
    maxLeafRowFilterDepth: subLabels?.length,
    state: {
      pagination,
      expanded,
      columnFilters,
    },
  });

  const expandAllRows = (rows: any[]): ExpandedState => {
    const expanded: ExpandedState = {};
    const traverse = (rows: any[]) => {
      rows.forEach((row) => {
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

  return (
    <div className=''>
      {tabletop && (
        <>
          <div className='flex mb-2'>{tabletop}</div>
        </>
      )}
      <div className='table-responsive'>
        <table className={tableClass || undefined}>
          <thead>
            {renderHeader
              ? renderHeader(table)
              : table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <tr key={headerGroup.id} id={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const meta = header.column.columnDef.meta || {};
                        const rowSpan = meta.rowSpan ?? 1;
                        if (meta.hidden) return null;
                        return (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            rowSpan={rowSpan}
                            {...(meta.thClassNames
                              ? {
                                  className: meta.thClassNames,
                                }
                              : {})}
                          >
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'flex flex-row justify-center items-center'
                                  : '',
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
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
                  );
                })}
          </thead>
          <tbody>
            {renderBody ? (
              renderBody(table)
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const label = subLabels?.[row.depth];
                return (
                  <Fragment key={row.id}>
                    <tr>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          colSpan={cell.column.columnDef.meta?.tdColSpan}
                          key={cell.id}
                          {...(cell.column.columnDef.meta?.tdClassNames
                            ? {
                                className:
                                  cell.column.columnDef.meta.tdClassNames,
                              }
                            : {})}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && subLabels && (
                      <>
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
                              style={{
                                paddingLeft: `${row.depth * 1}rem`,
                              }}
                            >
                              <MdSubdirectoryArrowRight />
                              {label}
                            </strong>
                          </td>
                        </tr>
                      </>
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
      <Pagination table={table} />
    </div>
  );
};

export default Tabel;
