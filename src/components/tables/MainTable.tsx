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
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import InputSelectBox from '../inputs/InputSelectBox';
import { useState, type ReactNode } from 'react';
import InputButton from '../inputs/InputButton';

interface MainTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  tabletop?: ReactNode;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    tdClassNames?: string;
    thClassNames?: string;
  }
}

const MainTable = <TData,>({
  data,
  columns,
  tabletop,
}: MainTableProps<TData>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className='table-responsive py-2'>
      {tabletop && (
        <>
          <div className='flex mb-2'>{tabletop}</div>
        </>
      )}
      <table className='table-auto'>
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  {...(cell.column.columnDef.meta?.tdClassNames
                    ? { className: cell.column.columnDef.meta.tdClassNames }
                    : {})}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex flex-row items-center justify-between mt-2'>
        <div className='flex items-center gap-2'>
          <span className='opacity-85'>Tampilkan</span>
          <InputSelectBox
            className='h-9'
            value={table.getState().pagination.pageSize.toString()}
            options={[
              { label: '10', value: '10' },
              { label: '20', value: '20' },
              { label: '30', value: '30' },
              { label: '40', value: '40' },
              { label: '50', value: '50' },
            ]}
            onChange={(value) => table.setPageSize(Number(value))}
          />
          <span className='opacity-85'>
            dari {table.getRowCount().toLocaleString()} data
          </span>
        </div>
        <div className='flex flex-row gap-2'>
          <InputButton
            className='w-9 h-9'
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <MdKeyboardDoubleArrowLeft />
          </InputButton>
          <InputButton
            className='w-9 h-9'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <MdKeyboardArrowLeft />
          </InputButton>
          <div className='flex items-center gap-2'>
            <input
              type='number'
              min='1'
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              // onChange={(e) => {
              //   const page = e.target.value ? Number(e.target.value) - 1 : 0;
              //   table.setPageIndex(page);
              // }}
              onChange={(e) => {
                let page = Number(e.target.value) - 1;

                if (isNaN(page)) page = 0;
                if (page < 0) page = 0;
                if (page >= table.getPageCount())
                  page = table.getPageCount() - 1;

                table.setPageIndex(page);
              }}
              className='pagination-input h-9'
            />
            <span className='opacity-85'>
              dari {table.getPageCount().toLocaleString()}
            </span>
          </div>
          <InputButton
            className='w-9 h-9'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <MdKeyboardArrowRight />
          </InputButton>
          <InputButton
            className='w-9 h-9'
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <MdKeyboardDoubleArrowRight />
          </InputButton>
        </div>
      </div>
    </div>
  );
};

export default MainTable;
