import MainTable from './MainTable';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { getUsers } from '../../services/UserService';
import type { DataUserType } from '../../types/data';
import Spinner from '../inputs/Spinner';
import { MdAdd, MdDelete, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';

const UserTable = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const columnHelper = createColumnHelper<DataUserType>();
  const columns = [
    columnHelper.display({
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('fullname', {
      header: 'Nama',
      // meta: {
      //   tdClassNames: 'text-center',
      // },
    }),
    columnHelper.accessor('name', {
      header: 'Username',
      // meta: {
      //   tdClassNames: 'text-center',
      // },
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      // meta: {
      //   tdClassNames: 'text-center',
      // },
    }),
    columnHelper.accessor('userRole.name', {
      header: 'Role',
      // meta: {
      //   tdClassNames: 'text-center',
      // },
    }),
    columnHelper.display({
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <div className='inline-flex gap-1'>
          <button
            className='p-1 transition-all rounded-full hover:bg-blue-400 hover:text-[var(--text-3)] active:scale-90'
            onClick={() => toast.success(`Edit, ${row.original.fullname}`)}
          >
            <MdEdit className='text-xl' />
          </button>
          <button
            className='p-1 transition-all rounded-full hover:bg-red-400 hover:text-[var(--text-3)] active:scale-90'
            onClick={() => toast.success(`Hapus, ${row.original.fullname}`)}
          >
            <MdDelete className='text-xl' />
          </button>
        </div>
      ),
      meta: {
        tdClassNames: 'text-center',
      },
    }),
  ];

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          <button
            className='table-button w-9 h-9'
            onClick={() => toast.success('Tambah data')}
          >
            <MdAdd />
          </button>

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

  return (
    <>
      <MainTable
        data={data || []}
        columns={columns}
        tabletop={<TableTopbar />}
      />
    </>
  );
};

export default UserTable;
