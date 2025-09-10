import { useState } from 'react';
import { bidangDummy } from '../../dummy/dummy_data';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import InputSelectBox from '../inputs/InputSelectBox';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import React from 'react';

const BidangTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = [
    {
      accessorKey: 'kode_urusan',
      header: 'Kode Urusan',
      enableGrouping: true,
      cell: () => null,
    },
    {
      accessorKey: 'kode_bidang',
      header: 'Kode Bidang',
    },
    {
      accessorKey: 'bidang',
      header: 'Bidang',
    },
  ];

  const table = useReactTable({
    data: bidangDummy,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onPaginationChange: setPagination,
    // state: { pagination,grouping: ['kode_urusan'] },
    // initialState: { pagination, grouping: ['kode_urusan'] },
  });

  let counter =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;

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
          <tr>
            <th>No</th>
            <th>Kode Bidang</th>
            <th>Bidang</th>
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            if (row.getIsGrouped()) {
              return (
                <React.Fragment key={row.id}>
                  <tr>
                    <td colSpan={3} className='font-bold'>
                      <p
                        style={{
                          margin: 0,
                          marginLeft: 60,
                          textIndent: -60,
                          textAlign: 'left',
                        }}
                      >
                        <big>
                          <b>Urusan : </b>[{row.groupingValue}]
                        </big>
                      </p>
                    </td>
                  </tr>
                  {row.subRows.map((subRow) => (
                    <tr key={subRow.id}>
                      <td
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {counter++}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {subRow.original.kode_bidang}
                      </td>
                      <td
                        style={{ textAlign: 'left', verticalAlign: 'middle' }}
                      >
                        {subRow.original.bidang}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            }

            // Row biasa jika tidak tergabung
            return (
              <tr key={row.id}>
                <td
                  style={{
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {counter++}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.original.kode_bidang}
                </td>
                <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>
                  {row.original.bidang}
                </td>
              </tr>
            );
          })}
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

export default BidangTable;
