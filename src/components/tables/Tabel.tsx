import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type PaginationState,
  type RowData,
} from '@tanstack/react-table';
import {
  MdArrowDropUp,
  MdArrowDropDown,
  MdSubdirectoryArrowRight,
} from 'react-icons/md';
import { Fragment, useState, type ReactNode } from 'react';
import Pagination from './Pagination';
import { motion, AnimatePresence } from 'framer-motion';

interface MainTableProps<TData> {
  sorting?: boolean;
  data: TData[];
  subRows?: (row: TData) => TData[] | undefined;
  columns: ColumnDef<TData, any>[];
  tabletop?: ReactNode;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    tdClassNames?: string;
    thClassNames?: string;
  }
}

const Tabel = <TData,>({
  sorting = true,
  data,
  columns,
  tabletop,
  subRows,
}: MainTableProps<TData & { group?: string }>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const table = useReactTable({
    data: data,
    columns: columns,
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
    filterFromLeafRows: true,
    maxLeafRowFilterDepth: 4,
    // debugTable: true,
    // debugRows: true,
    state: {
      pagination,
      expanded,
    },
  });

  return (
    <div className='py-2'>
      {tabletop && (
        <>
          <div className='flex mb-2'>{tabletop}</div>
        </>
      )}
      <table className='table-auto table-responsive'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    {...(header.column.columnDef.meta?.thClassNames
                      ? {
                          className: header.column.columnDef.meta.thClassNames,
                        }
                      : {})}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'flex flex-row justify-center items-center'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const label =
                row.depth === 0
                  ? 'BIDANG :'
                  : row.depth === 1
                    ? 'PROGRAM :'
                    : row.depth === 2
                      ? 'KEGIATAN :'
                      : 'SUB KEGIATAN :';

              return (
                <Fragment key={row.id}>
                  <tr>
                    {row.getVisibleCells().map((cell) => (
                      <td
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

                  {row.getIsExpanded() && (
                    <>
                      <tr>
                        <td colSpan={3}></td>
                        <td>
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
      <Pagination table={table} />
    </div>
  );
};

export default Tabel;
