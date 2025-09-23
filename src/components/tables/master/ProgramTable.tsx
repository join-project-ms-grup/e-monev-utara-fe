import { useQuery } from '@tanstack/react-query';
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
import { MdArrowDropDown, MdArrowDropUp, MdRefresh } from 'react-icons/md';
import { getProgram, type Master } from '../../../services/MasterService';
import Spinner from '../../inputs/Spinner';
import { useState } from 'react';
import React from 'react';
import Pagination from '../Pagination';

const ProgramTable = () => {
  // Data fetching
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_program'],
    queryFn: getProgram,
  });

  // Kolom
  const columnHelper = createColumnHelper<Master>();
  const columns = [
    columnHelper.display({
      header: '#',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('kode', {
      header: 'Kode',
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('name', {
      header: 'Program',
    }),
  ];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    data: data || [],
    columns: columns,
    defaultColumn: {
      enableSorting: true,
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

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          <button
            className='table-button w-9 h-9'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />}
          </button>
        </div>
      </>
    );
  };

  const renderedBidang = new Set<string | undefined>();
  const renderedGroups = new Set<string | undefined>();

  return (
    <>
      <div>
        <div className='flex mb-2'>
          <TableTopbar />
        </div>
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
                            className:
                              header.column.columnDef.meta.thClassNames,
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
                const bidang = row.original.bidang;
                const urusan = row.original.urusan;
                const needBidangHeader = !renderedBidang.has(bidang);
                if (needBidangHeader) renderedBidang.add(bidang);

                const needGroupHeader = !renderedGroups.has(urusan);
                if (needGroupHeader) renderedGroups.add(urusan);

                return (
                  <React.Fragment key={row.id}>
                    {urusan && needGroupHeader && (
                      <tr className='bg-gray-200'>
                        <td colSpan={table.getAllLeafColumns().length}>
                          <span className='font-semibold uppercase'>
                            Urusan :
                          </span>{' '}
                          {urusan}
                        </td>
                      </tr>
                    )}
                    {bidang && needBidangHeader && (
                      <tr className='bg-gray-100'>
                        <td colSpan={table.getAllLeafColumns().length}>
                          <span className='font-bold uppercase'>Bidang :</span>{' '}
                          {bidang}
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
                  </React.Fragment>
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
    </>
  );
};

export default ProgramTable;
