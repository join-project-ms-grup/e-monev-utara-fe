import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import {
  deleteUser,
  getUsers,
  setStatusUser,
  type UserType,
} from '../../services/UserService';
import Spinner from '../inputs/Spinner';
import { MdAdd, MdDelete, MdEdit, MdKey, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import DialogModal from '../inputs/DialogModal';
import InputButton from '../inputs/InputButton';
import { useCallback, useState } from 'react';
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

  const [selectedData, setSelectedData] = useState(initUserSF);
  const [selectedDataPass, setSelectedDataPass] = useState(initUserPassSF);
  const [modal, setModal] = useState<'' | 'Add' | 'Password' | 'Delete'>('');

  //#region Tabel
  const columns: ColumnDef<UserType>[] = [
    {
      header: 'No',
    },
    {
      header: 'Nama',
    },
    {
      header: 'Username',
    },
    {
      header: 'Email',
    },
    {
      header: 'Role',
    },
    {
      header: 'Status',
    },
    {
      header: 'Aksi',
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center',
      },
    },
  ];

  const tableBody = useCallback(
    (table: Table<UserType>) => {
      const rows = table.getRowModel().rows;
      return (
        <>
          {rows.map((row) => {
            const user = row.original;

            return (
              <tr key={user.id} className='odd gradeX'>
                <td className='text-center'>{row.index + 1}</td>

                <td>{user.fullname}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.userRole?.name}</td>

                <td className='flex items-center justify-center'>
                  <div className='w-30'>
                    <InputToggle
                      onLabel='Aktif'
                      offLabel='Nonaktif'
                      checked={user.status}
                      onToggle={() => setStatusMutation.mutate(user.id!)}
                    />
                  </div>
                </td>

                <td className='text-center'>
                  <div className='inline-flex gap-1'>
                    <AksiButton
                      tooltip='Ubah data'
                      Icon={MdEdit}
                      onClick={() => {
                        setSelectedData({
                          id: user.id,
                          email: user.email ?? '',
                          fullname: user.fullname ?? '',
                          name: user.name ?? '',
                          password: '',
                          passwordConfirm: '',
                          role_id: user.role_id ?? '',
                          skpd_id: user.skpd_id ?? '',
                        });
                        setModal('Add');
                      }}
                    />

                    <AksiButton
                      Icon={MdKey}
                      tooltip='Ubah password'
                      onClick={() => {
                        setSelectedDataPass({
                          id: user.id,
                          fullname: user.fullname,
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
                          id: user.id,
                          fullname: user.fullname,
                          password: '',
                          passwordConfirm: '',
                        });
                        setModal('Delete');
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </>
      );
    },
    [setStatusMutation, setSelectedData, setSelectedDataPass, setModal],
  );
  //#endregion

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
      <Tabel
        data={data || []}
        columns={columns}
        renderBody={(table) => tableBody(table)}
      />
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
