import MainTable from './MainTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import type {
  RoleAdminType,
  RoleDevType,
  RoleEditType,
} from '../../types/data';
import Spinner from '../inputs/Spinner';
import { MdAdd, MdDelete, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useState } from 'react';
import DialogModal from '../inputs/DialogModal';
import InputButton from '../inputs/InputButton';
import { addRole, deleteRole, getRoleAdmin, getRoleDev, updateRole } from '../../services/RoleService';
import FormRole from '../forms/FormRole';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../lib/api';
import { getRoleId } from '../../lib/usercookie';

const RoleTable = () => {
  // Modal
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  // Form Data
  const initialFormData: RoleAdminType = {
    kode: null,
    name: '',
  };
  const initialFormEdit: RoleEditType = {
    id: 0,
    kode: null,
    name: '',
  };
  const initialFormDelete: Pick<RoleDevType, 'id' | 'name'> = {
    id: 0,
    name: '',
  };

  const [formData, setFormData] = useState<RoleAdminType>(initialFormData);
  const [formEdit, setFormEdit] = useState<
    RoleAdminType & Pick<RoleDevType, 'id'>
  >(initialFormEdit);
  const [formDelete, setFormDelete] =
    useState<Pick<RoleDevType, 'id' | 'name'>>(initialFormDelete);

  // Data fetching
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_role'],
    queryFn: () => (getRoleId() === 1 ? getRoleDev() : getRoleAdmin())
  });

  const data2 = data as RoleDevType[] | RoleAdminType[];

  const queryClient = useQueryClient();
  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: RoleAdminType) => {
      setLoadingMutation(true);
      return addRole(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_role'] });
      toast.success('Data berhasil ditambahkan');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
    },
    onSettled: () => {
      setLoadingMutation(false);
      setFormData(initialFormData);
      setOpenAdd(false);
    },
  });
  // Update
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: RoleAdminType;
    }) => {
      setLoadingMutation(true);
      return updateRole(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_role'] });
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
    },
    onSettled: () => {
      setLoadingMutation(false);
      setFormEdit(initialFormEdit);
      setOpenEdit(false);
    },
  });
  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      setLoadingMutation(true);
      return deleteRole(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_role'] });
      toast.success('Data berhasil dihapus');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(`Gagal menghapus data\n${error.response?.data.message}`);
    },
    onSettled: () => {
      setLoadingMutation(false);
      setFormDelete(initialFormDelete);
      setOpenDelete(false);
    },
  });

  // Kolom
  const devColumnHelper = createColumnHelper<RoleDevType>();
  const adminColumnHelper = createColumnHelper<RoleAdminType>();

  const devColumns = [
    devColumnHelper.display({
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    devColumnHelper.accessor('kode', {
      header: 'Kode',
    }),
    devColumnHelper.accessor('name', {
      header: 'Nama',
    }),
    devColumnHelper.display({
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <div className='inline-flex gap-1'>
            <button
              className='p-1 transition-all rounded-full hover:bg-blue-400 hover:text-[var(--text-3)] active:scale-90'
              onClick={() => {
                setFormEdit({
                  id: row.original.id,
                  kode: row.original.kode,
                  name: row.original.name,
                });
                setOpenEdit(true);
              }}
            >
              <MdEdit className='text-xl' />
            </button>
            <button
              className='p-1 transition-all rounded-full hover:bg-red-400 hover:text-[var(--text-3)] active:scale-90'
              onClick={() => {
                setFormDelete({
                  id: row.original.id,
                  name: row.original.name,
                });
                setOpenDelete(true);
              }}
            >
              <MdDelete className='text-xl' />
            </button>
          </div>
        </>
      ),
      meta: {
        tdClassNames: 'text-center',
      },
    }),
  ];

  const adminColumns = [
    adminColumnHelper.display({
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    adminColumnHelper.accessor('kode', {
      header: 'Kode',
    }),
    adminColumnHelper.accessor('name', {
      header: 'Nama',
    }),
  ];

  const columns = getRoleId() === 1 ? devColumns : adminColumns;

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          <button
            className='table-button w-9 h-9'
            onClick={() => {
              setOpenAdd(true);
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
        columns={columns as any}
        tabletop={<TableTopbar />}
      />
      <DialogModal
        title='Tambah data Role'
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
      >
        <FormRole
          type='Add'
          formData={formData}
          setFormData={setFormData}
          onSubmit={(data: RoleAdminType) => {
            console.log('Data dari form modal:', data);
            // addMutation.mutate(data);
            addMutation.mutate({
              kode: Number(data.kode),
              name: data.name,
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
        </FormRole>
      </DialogModal>
      <DialogModal
        title='Ubah data Role'
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
      >
        <FormRole
          type='Edit'
          formData={formEdit}
          setFormData={setFormEdit}
          onSubmit={(data: RoleEditType) => {
            console.log('Data dari form modal:', data);
            updateMutation.mutate({
              id: data.id,
              payload: {
                kode: Number(data.kode),
                name: data.name,
              },
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
        </FormRole>
      </DialogModal>
      <DialogModal
        title='Hapus data Role'
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <p>
          Yakin ingin menghapus data <i>{formDelete.name}</i> ?
        </p>
        <div className='flex gap-2 justify-end'>
          <InputButton
            type='button'
            className='btn btn-theme w-24'
            isLoading={loadingMutation}
            onClick={() => {
              deleteMutation.mutate(formDelete.id);
            }}
          >
            Hapus
          </InputButton>
        </div>
      </DialogModal>
    </>
  );
};

export default RoleTable;
