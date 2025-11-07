import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import Spinner from '../../inputs/Spinner';
import { MdAdd, MdDelete, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import {
  getSKPD,
  addSKPD,
  deleteSKPD,
  updateSKPD,
  type SKPDForm,
} from '../../../services/SKPDService';
import { useEffect, useState } from 'react';
import DialogModal from '../../inputs/DialogModal';
import InputButton from '../../inputs/InputButton';
import FormSKPD from '../../forms/FormSKPD';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../lib/api';
import Tabel from '../Tabel';
import { isDev } from '../../../lib/usercookie';

const SKPDTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit' | 'Delete'>(
    'Add',
  );
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: SKPDForm = {
    id: Number(''),
    kode: '',
    name: '',
    shortname: '',
    status: Boolean(''),
  };

  const [formData, setFormData] = useState<SKPDForm>(initialFormData);

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
    queryKey: ['tabel_skpd'],
    queryFn: getSKPD,
  });

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: SKPDForm) => {
      setLoadingMutation(true);
      return addSKPD(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_skpd'] });
      setFormData(initialFormData);
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
    mutationFn: async ({ id, payload }: { id: number; payload: SKPDForm }) => {
      setLoadingMutation(true);
      return updateSKPD(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_skpd'] });
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
      return deleteSKPD(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_skpd'] });
      toast.success('Data berhasil dihapus');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(`Gagal menghapus data\n${error.response?.data.message}`);
    },
    onSettled: () => {
      setLoadingMutation(false);
      setOpenModal(false);
    },
  });

  // Kolom
  const columnHelper = createColumnHelper<SKPDForm>();
  const columns = [
    columnHelper.display({
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('kode', {
      header: 'Kode',
    }),
    columnHelper.accessor('name', {
      header: 'Nama',
    }),
    columnHelper.accessor('shortname', {
      header: 'Singkatan',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      meta: {
        tdClassNames: 'text-center'
      },
      cell: (info) => (
        <>
          {Number(info.getValue()) === 1 ? (
            <span className='text-green-700'>Aktif</span>
          ) : (
            <span className='text-red-700'>Nonaktif</span>
          )}
        </>
      ),
    }),
    columnHelper.display({
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <div className='inline-flex gap-1'>
            <button
              className='p-1 transition-all rounded-full hover:bg-blue-400 hover:text-[var(--text-3)] active:scale-90'
              onClick={() => {
                setModalState('Edit');
                setFormData({
                  id: row.original.id,
                  kode: row.original.kode,
                  name: row.original.name,
                  shortname: row.original.shortname,
                  status: row.original.status,
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
                  id: row.original.id!,
                  name: row.original.name,
                });
                setOpenModal(true);
              }}
            >
              <MdDelete className='text-xl' />
            </button>
          </div>
        </>
      ),
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center',
      },
    }),
  ];

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          {isDev() && (
            <InputButton
              tooltip='Tambah data'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                setModalState('Add');
                setOpenModal(true);
              }}
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
      <Tabel data={data || []} columns={columns}  />
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data SKPD'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormSKPD
            type='Add'
            defaultValues={formData}
            onSubmit={(data: SKPDForm) => {
              console.log('Data dari form modal:', data);
              addMutation.mutate({
                kode: Number(data.kode),
                name: data.name,
                shortname: data.shortname,
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
          </FormSKPD>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data SKPD'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormSKPD
            type='Edit'
            defaultValues={formData}
            onSubmit={({ id, payload }) => {
              console.log('Data dari form modal:', data);
              updateMutation.mutate({
                id,
                payload: {
                  kode: Number(payload.kode),
                  name: payload.name,
                  shortname: payload.shortname,
                  status: payload.status,
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
          </FormSKPD>
        </DialogModal>
      )}
      {modalState === 'Delete' && (
        <DialogModal
          title='Hapus data SKPD'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <p>
            Yakin ingin menghapus data <i>{formData.name}</i> ?
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
    </div>
  );
};

export default SKPDTable;
