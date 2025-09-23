import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProgram } from '../../../services/MasterService';
import {
  type ColumnDef,
  type PaginationState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import Pagination from '../Pagination';

type RowData =
  | { type: 'urusan'; label: string }
  | { type: 'bidang'; label: string }
  | { type: 'program'; no: number; kode: string; name: string };

export default function ProgramExpandTable() {
  const { data } = useQuery({
    queryKey: ['tabel_program'],
    queryFn: getProgram,
  });

  // Transform data API ke bentuk RowData flat
  const flatData: RowData[] = useMemo(() => {
    if (!data) return [];
    const rows: RowData[] = [];
    let counter = 1;

    data.forEach((urusan) => {
      rows.push({ type: 'urusan', label: urusan.group });
      urusan.bidang.forEach((bid) => {
        rows.push({ type: 'bidang', label: bid.group });
        bid.program.forEach((prog) => {
          rows.push({
            type: 'program',
            no: counter++,
            kode: prog.kode,
            name: prog.name,
          });
        });
      });
    });

    return rows;
  }, [data]);

  // Definisi kolom
  const columns: ColumnDef<RowData>[] = [
    {
      accessorKey: 'no',
      header: '#',
      cell: (info) =>
        info.row.original.type === 'program' ? info.row.original.no : null,
    },
    {
      accessorKey: 'kode',
      header: 'Kode',
      cell: (info) =>
        info.row.original.type === 'program' ? info.row.original.kode : null,
    },
    {
      accessorKey: 'name',
      header: 'Program',
      cell: (info) => {
        const row = info.row.original;
        if (row.type === 'program') return row.name;
        if (row.type === 'urusan')
          return <span className='font-bold'>Urusan: {row.label}</span>;
        if (row.type === 'bidang')
          return <span className='italic pl-6'>↳ Bidang: {row.label}</span>;
      },
    },
  ];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className='p-4'>
      <table className='table-auto w-full'>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className='border p-2 text-center'
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className='flex items-center justify-center'>
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
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const original = row.original;
              return (
                <tr
                  key={row.id}
                  className={
                    original.type === 'program' ? 'hover:bg-gray-50' : ''
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      colSpan={
                        original.type !== 'program'
                          ? table.getAllLeafColumns().length
                          : undefined
                      }
                      className={`border p-2 ${
                        original.type === 'urusan'
                          ? 'bg-gray-200 font-bold'
                          : original.type === 'bidang'
                            ? 'bg-gray-100 italic'
                            : ''
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
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
      <Pagination table={table } />
    </div>
  );
}
