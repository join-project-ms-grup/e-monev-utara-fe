import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import {
  getUsers,
  setStatusUser,
  type UserType,
} from '../../services/UserService';
import Spinner from '../inputs/Spinner';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import DialogModal from '../inputs/DialogModal';
import InputButton from '../inputs/InputButton';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../lib/api';
import InputToggle from '../inputs/InputToggle';
import Tabel from './Tabel';
import { getRoleId, isAdmin, isDev } from '../../lib/usercookie';
import { F_User } from '../forms/Konfigurasi/User/F_User';
import { initUserSF } from '../forms/Konfigurasi/User/FH_User';
import AksiButton from '../inputs/AksiButton';

const UserTable = () => {
  // Data fetching
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_user', getRoleId()],
    queryFn: getUsers,
  });

  // Update Status
  const queryClient = useQueryClient();
  const setStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      return setStatusUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_user'] });
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
      }
    },
  });

  // Kolom
  const columnHelper = createColumnHelper<UserType>();
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
    }),
    columnHelper.accessor('name', {
      header: 'Username',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('userRole.name', {
      header: 'Role',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: false,
      meta: {
        thClassNames: 'w-[15%]',
        tdClassNames: 'flex items-center justify-center',
      },
      cell: ({ cell, row }) => (
        <div className='w-30'>
          <InputToggle
            onLabel='Aktif'
            offLabel='Nonaktif'
            checked={cell.getValue()}
            onToggle={() => setStatusMutation.mutate(row.original.id!)}
          />
        </div>
      ),
    }),
    columnHelper.display({
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <div className='inline-flex gap-1'>
          <AksiButton
            Icon={MdEdit}
            onClick={() => {
              setSelectedData({
                id: row.original.id,
                email: row.original.email ?? '',
                fullname: row.original.fullname ?? '',
                name: row.original.name ?? '',
                password: '',
                passwordConfirm: '',
                role_id: row.original.role_id ?? '',
                skpd_id: row.original.skpd_id ?? '',
              });
              setModal('Add');
            }}
          />
          {/* <button
            className='p-1 transition-all rounded-full hover:bg-red-400 hover:text-[var(--text-3)] active:scale-90'
            onClick={() => {
              setModalState('Delete');
              setFormData({
                id: row.original.id,
                fullname: row.original.fullname,
              });
              setOpenModal(true);
            }}
          >
            <MdDelete className='text-xl' />
          </button> */}
        </div>
      ),
      meta: {
        tdClassNames: 'text-center',
      },
    }),
  ];

  const [selectedData, setSelectedData] = useState(initUserSF);
  const [modal, setModal] = useState<'' | 'Add' | 'Delete'>('');

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          {(isDev() || isAdmin()) && (
            <InputButton
              tooltip='Tambah data'
              className='btn btn-theme w-9 h-9'
              onClick={() => setModal('Add')}
            >
              <MdAdd />
            </InputButton>
          )}
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
          </InputButton>
        </div>
      </div>
      <Tabel data={data || []} columns={columns} />
      {modal && (
        <DialogModal
          title='Tambah data User'
          isOpen={modal === 'Add'}
          onClose={() => {
            setModal('');
            setSelectedData(initUserSF);
          }}
        >
          <F_User
            data={selectedData}
            onSuccess={() => {
              setModal('');
              setSelectedData(initUserSF);
            }}
          />
        </DialogModal>
      )}
    </div>
  );
};

export default UserTable;
