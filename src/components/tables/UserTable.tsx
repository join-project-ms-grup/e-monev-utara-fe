import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import {
  deleteUser,
  getUsers,
  setStatusUser,
  type UserType,
} from '../../services/UserService';
import Spinner from '../inputs/Spinner';
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdKey,
  MdRefresh,
} from 'react-icons/md';
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
import { initUserPassSF, initUserSF } from '../forms/Konfigurasi/User/FH_User';
import AksiButton from '../inputs/AksiButton';
import { F_UserPass } from '../forms/Konfigurasi/User/F_UserPass';

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
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_user'] });
      setModal('');
      setSelectedDataPass(initUserPassSF);
      toast.success('Data berhasil dihapus');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menghapus data\n${error.response?.data.message}`);
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
      cell: ({ cell, row }) => {
        return (
          <div className='w-30'>
            <InputToggle
              onLabel='Aktif'
              offLabel='Nonaktif'
              checked={cell.getValue()}
              onToggle={() => setStatusMutation.mutate(row.original.id!)}
            />
          </div>
        );
      },
    }),
    columnHelper.display({
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <div className='inline-flex gap-1'>
          <AksiButton
            tooltip='Ubah data'
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
          <AksiButton
            Icon={MdKey}
            tooltip='Ubah password'
            onClick={() => {
              setSelectedDataPass({
                id: row.original.id,
                fullname: row.original.fullname,
                password: '',
                passwordConfirm: '',
              });
              setModal('Password');
            }}
          />
          <AksiButton
            Icon={MdDelete}
            tooltip='Hapus user'
            onClick={() => {
              setSelectedDataPass({
                id: row.original.id,
                fullname: row.original.fullname,
                password: '',
                passwordConfirm: '',
              });
              setModal('Delete');
            }}
          />
        </div>
      ),
      meta: {
        tdClassNames: 'text-center',
      },
    }),
  ];

  const [selectedData, setSelectedData] = useState(initUserSF);
  const [selectedDataPass, setSelectedDataPass] = useState(initUserPassSF);
  const [modal, setModal] = useState<'' | 'Add' | 'Password' | 'Delete'>('');

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
      {modal === 'Add' && (
        <DialogModal
          title={`${selectedData.id ? 'Ubah' : 'Tambah'} data User`}
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
      {modal === 'Password' && (
        <DialogModal
          title={`Ubah password User`}
          isOpen={modal === 'Password'}
          onClose={() => {
            setModal('');
            setSelectedData(initUserSF);
          }}
        >
          <F_UserPass
            data={selectedDataPass}
            onSuccess={() => {
              setModal('');
              setSelectedDataPass(initUserPassSF);
            }}
          />
        </DialogModal>
      )}
      {modal === 'Delete' && (
        <DialogModal
          title={`Yakin hapus User ?`}
          isOpen={modal === 'Delete'}
          onClose={() => {
            setModal('');
            setSelectedDataPass(initUserPassSF);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedDataPass.id) {
                deleteMutation.mutate(selectedDataPass.id);
              }
            }}
          >
            <div>
              <p>
                Anda akan menghapus user{' '}
                <b>
                  <i>{selectedDataPass.fullname}</i>
                </b>
              </p>
              <div className='float-end'>
                <InputButton className='px-2' type='submit'>
                  Hapus
                </InputButton>
              </div>
            </div>
          </form>
        </DialogModal>
      )}
    </div>
  );
};

export default UserTable;
