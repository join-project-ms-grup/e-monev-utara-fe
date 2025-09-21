import MainTable from './MainTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import {
  addUser,
  deleteUser,
  getUsers,
  setStatusUser,
  updateUser,
  type UserForm,
  type UserType,
} from '../../services/UserService';
import Spinner from '../inputs/Spinner';
import { MdAdd, MdDelete, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import DialogModal from '../inputs/DialogModal';
import InputButton from '../inputs/InputButton';
import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../lib/api';
import { FormUser } from '../forms/FormUser';
import InputToggle from '../inputs/InputToggle';

const UserTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit' | 'Delete'>(
    'Add',
  );
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: UserForm = {
    id: Number(''),
    email: '',
    fullname: '',
    name: '',
    password: '',
    role_id: '',
    skpd_id: '',
  };

  const [formData, setFormData] = useState<UserForm>(initialFormData);

  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      console.log(formData);
    }
  }, [openModal]);

  // Data fetching
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_user'],
    queryFn: getUsers,
  });

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: UserForm) => {
      setLoadingMutation(true);
      return addUser(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_user'] });
      setOpenModal(false);
      toast.success('Data berhasil ditambahkan');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  // Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UserForm }) => {
      setLoadingMutation(true);
      return updateUser(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_user'] });
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  // Update Status
  const setStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      setLoadingMutation(true);
      return setStatusUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_user'] });
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      setLoadingMutation(true);
      return deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_user'] });
      toast.success('Data berhasil dihapus');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menghapus data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
      setOpenModal(false);
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
        tdClassNames: 'text-center',
      },
      cell: ({ cell, row }) => (
        <>
          <InputToggle
            checked={cell.getValue()!}
            defaultChecked={cell.getValue()!}
            onToggle={() => {
              setStatusMutation.mutate(row.original.id!);
            }}
            onLabel={'Aktif'}
            offLabel={'Nonaktif'}
          />
        </>
      ),
    }),
    columnHelper.display({
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <div className='inline-flex gap-1'>
          <button
            className='p-1 transition-all rounded-full hover:bg-blue-400 hover:text-[var(--text-3)] active:scale-90'
            onClick={() => {
              setModalState('Edit');
              setFormData({
                id: row.original.id,
                email: row.original.email,
                fullname: row.original.fullname,
                name: row.original.name,
                password: '',
                role_id: row.original.role_id,
                skpd_id: row.original.skpd_id,
              });
              setOpenModal(true);
            }}
          >
            <MdEdit className='text-xl' />
          </button>
          <button
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
            onClick={() => {
              setModalState('Add');
              setOpenModal(true);
            }}
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
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data User'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormUser
            type='Add'
            defaultValues={formData}
            onSubmit={(data: UserForm) => {
              console.log('Data dari form modal:', data);
              addMutation.mutate({
                email: data.email,
                fullname: data.fullname,
                name: data.name,
                password: data.password,
                role_id: data.role_id,
                skpd_id: data.skpd_id,
              });
            }}
          >
            <div className='flex gap-2 justify-end'>
              <InputButton
                type='submit'
                className='btn btn-theme w-24'
                isLoading={loadingMutation}
              >
                Simpan
              </InputButton>
            </div>
          </FormUser>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data User'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormUser
            type='Edit'
            defaultValues={formData}
            onSubmit={({ id, payload }) => {
              console.log('Data dari form modal:', data);
              updateMutation.mutate({
                id,
                payload,
              });
            }}
          >
            <div className='flex gap-2 justify-end'>
              <InputButton
                type='submit'
                className='btn btn-theme w-24'
                isLoading={loadingMutation}
              >
                Simpan
              </InputButton>
            </div>
          </FormUser>
        </DialogModal>
      )}
      {modalState === 'Delete' && (
        <DialogModal
          title='Hapus data User'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <p>
            Yakin ingin menghapus data <i>{formData.fullname}</i> ?
          </p>
          <div className='flex gap-2 justify-end'>
            <InputButton
              type='button'
              className='btn btn-theme w-24'
              isLoading={loadingMutation}
              onClick={() => {
                deleteMutation.mutate(formData.id!);
              }}
            >
              Hapus
            </InputButton>
          </div>
        </DialogModal>
      )}
    </>
  );
};

export default UserTable;
