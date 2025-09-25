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
} from 'react-icons/md';
import InputSearchBox from '../inputs/InputSearchBox';
import Pagination from './Pagination';

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

  const [tahun, setTahun] = useState('2025');

  return (
    <>
      <div className='inline-flex gap-2 mb-2 items-center'>
        <label htmlFor='tahun'>Tahun</label>
        <InputSearchBox
          id='tahun'
          className='w-24'
          btnclassName='bg-white'
          value={tahun}
          onChange={(e) => setTahun(e)}
          options={[
            { label: '2026', value: '2026' },
            { label: '2025', value: '2025' },
            { label: '2024', value: '2024' },
            { label: '2023', value: '2023' },
            { label: '2022', value: '2022' },
          ]}
        />
      </div>
      <table className='table-auto table-responsive'>
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
      <Pagination table={table} />
    </>
  );
};

export default OrganisasiTable;
