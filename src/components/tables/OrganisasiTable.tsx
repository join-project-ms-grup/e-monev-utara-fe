import { useState } from 'react';
import { organisasiDummy, type OrganisasiType } from '../../dummy/dummy_data';
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
import InputSelectBox from '../inputs/InputSelectBox';

const OrganisasiTable = () => {
  const columnHelper = createColumnHelper<OrganisasiType>();
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
      cell: (info) => info.getValue(),
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
      cell: (info) => (
        <span
          className={`${info.getValue().includes('Aktif') ? ' text-green-700' : 'text-red-700'}`}
        >
          {info.getValue()}
        </span>
      ),
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
      <div className='inline-flex gap-2 mb-2 items-center'>
        <span>Tahun Anggaran</span>
        <InputSelectBox options={[2025, 2024, 2023, 2022, 2021]} onChange={(e) => console.log(e)} />
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
          <InputSelectBox value={table.getState().pagination.pageSize} options={[10, 20, 30, 40, 50]} onChange={(value) => table.setPageSize(value)} />
          <span className='opacity-85'>
            dari {table.getRowCount().toLocaleString()} data
          </span>
        </div>
        <div className='flex flex-row gap-2'>
          <button
            className='table-button'
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <MdKeyboardDoubleArrowLeft />
          </button>
          <button
            className='table-button'
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
            className='table-button'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <MdKeyboardArrowRight />
          </button>
          <button
            className='table-button'
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
