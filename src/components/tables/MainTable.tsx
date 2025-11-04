import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type RowData,
} from '@tanstack/react-table';
import {
  MdArrowDropUp,
  MdArrowDropDown,
} from 'react-icons/md';
import { Fragment, useState, type ReactNode } from 'react';
import Pagination from './Pagination';

interface MainTableProps<TData> {
  sorting?: boolean;
  data: TData[];
  columns: ColumnDef<TData, any>[];
  tabletop?: ReactNode;
  groupHeader?: string;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    tdClassNames?: string;
    thClassNames?: string;
  }
}

const MainTable = <TData,>({
  sorting = true,
  data,
  columns,
  tabletop,
  groupHeader
}: MainTableProps<TData & {group?: string}>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    data: data,
    columns: columns,
    defaultColumn: {
      enableSorting: sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const renderedGroups = new Set<string | undefined>();

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
                      ? { className: header.column.columnDef.meta.thClassNames }
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
              const group = row.original.group;
              const needGroupHeader = !renderedGroups.has(group);
              if (needGroupHeader) {
                renderedGroups.add(group);
              }

              return (
                <Fragment key={row.id}>
                  {group && needGroupHeader && (
                    <tr>
                      <td
                        colSpan={table.getAllLeafColumns().length}
                      >
                        <span className='font-semibold uppercase'>{groupHeader} : </span>{group}
                      </td>
                    </tr>
                  )}
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
                </Fragment>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={table.getAllLeafColumns().length}
                className='text-center py-4'
              >
                TIDAK ADA DATA
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination table={table} />
    </div>
  );
};

export default MainTable;
