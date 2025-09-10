import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
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
import { useState } from 'react';

interface MainTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
}

const MainTable = <TData,>({ data, columns }: MainTableProps<TData>) => {
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
    <div className='table-responsive'>
      <div className='inline-flex gap-2 mb-2 items-center'>
        <span>Tahun Anggaran</span>
        <InputSelectBox
          options={[2025, 2024, 2023, 2022, 2021]}
          onChange={(e) => console.log(e)}
        />
      </div>
      <table className='table-auto'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
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
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex flex-row items-center justify-between mt-2'>
        <div className='flex items-center gap-2'>
          <span className='opacity-85'>Menampilkan</span>
          <InputSelectBox
            value={table.getState().pagination.pageSize}
            options={[10, 20, 30, 40, 50]}
            onChange={(value) => table.setPageSize(value)}
          />
          <span className='opacity-85'>
            dari {table.getRowCount().toLocaleString()} data
          </span>
        </div>
        <div className='flex flex-row gap-2'>
          <button
            className='pagination-button'
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <MdKeyboardDoubleArrowLeft />
          </button>
          <button
            className='pagination-button'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <MdKeyboardArrowLeft />
          </button>
          <div className='flex items-center gap-2'>
            <input
              type='number'
              min='1'
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className='pagination-input'
            />
            <span className='opacity-85'>
              dari {table.getPageCount().toLocaleString()}
            </span>
          </div>
          <button
            className='pagination-button'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <MdKeyboardArrowRight />
          </button>
          <button
            className='pagination-button'
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <MdKeyboardDoubleArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainTable;
