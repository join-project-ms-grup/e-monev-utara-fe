import { useState } from 'react';
import { organisasiDummy, type Organisasi } from '../../dummy/organisasi_dummy';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

const OrganisasiTable = () => {
  const columnHelper = createColumnHelper<Organisasi>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, _setData] = useState(() => [...organisasiDummy]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = [
    columnHelper.accessor('id', {
      header: 'No',
      cell: (info) => (
        <span className='flex justify-center'>{info.getValue()}</span>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.tahun, {
      id: 'lastName',
      cell: (info) => <i>{info.getValue()}</i>,
      header: 'Tahun',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('kode_org', {
      header: 'Kode Organisasi',
      cell: (info) => info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('org', {
      header: 'Organisasi',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('bidang', {
      header: 'Bidang',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (info) => info.column.id,
    }),
  ];
  const table = useReactTable({
    data,
    columns,
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
      <div className='flex gap-2 mb-2 items-center'>
        <span>Tahun Anggaran</span>
        <select
          className='border border-[#ccc] rounded px-2 py-1 focus:border-[#FFCCCC]'
          onChange={(e) => console.log(e.target.value)}
        >
          {[2025, 2024, 2023, 2022, 2021].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
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
                          ? 'flex flex-row justify-center items-center cursor-pointer select-none'
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
          <select
            className='pagination-select'
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
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

export default OrganisasiTable;
