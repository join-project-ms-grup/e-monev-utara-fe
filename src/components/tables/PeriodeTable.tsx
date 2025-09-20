import MainTable from './MainTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import Spinner from '../inputs/Spinner';
import { MdAdd, MdDelete, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import DialogModal from '../inputs/DialogModal';
import InputButton from '../inputs/InputButton';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../lib/api';
import { getRoleId } from '../../lib/usercookie';
import {
  addPeriode,
  deletePeriode,
  getPeriode,
  updatePeriode,
  type PeriodeForm,
} from '../../services/PeriodeService';
import FormPeriode from '../forms/FormPeriode';

const PeriodeTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit' | 'Delete'>(
    'Add',
  );
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: PeriodeForm = {
    id: Number(''),
    mulai: '',
    akhir: '',
    status: false,
  };

  const [formData, setFormData] = useState<PeriodeForm>(initialFormData);
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
    queryKey: ['tabel_periode'],
    queryFn: () => getPeriode(),
  });

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: PeriodeForm) => {
      setLoadingMutation(true);
      return addPeriode(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_periode'] });
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
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: PeriodeForm;
    }) => {
      setLoadingMutation(true);
      return updatePeriode(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_periode'] });
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
      return deletePeriode(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_periode'] });
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
  const columnHelper = createColumnHelper<PeriodeForm>();

  const columns = [
    columnHelper.display({
      header: 'No',
      enableSorting: true,
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('mulai', {
      header: 'Mulai',
      meta: {
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('akhir', {
      header: 'Akhir',
      meta: {
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: (info) => (
        <span
          className={`${info.getValue() ? ' text-green-700' : 'text-red-700'}`}
        >
          {info.getValue() ? 'Aktif' : 'Nonaktif'}
        </span>
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
                setFormData(row.original);
                setOpenModal(true);
              }}
            >
              <MdEdit className='text-xl' />
            </button>
            <button
              className='p-1 transition-all rounded-full hover:bg-red-400 hover:text-[var(--text-3)] active:scale-90'
              onClick={() => {
                setModalState('Delete');
                setFormData(row.original);
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

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          {getRoleId() === 1 && (
            <button
              className='table-button w-9 h-9'
              onClick={() => {
                setModalState('Add');
                setOpenModal(true);
              }}
            >
              <MdAdd />
            </button>
          )}

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
          title='Tambah data Periode'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormPeriode
            type='Add'
            defaultValues={formData}
            onSubmit={(data: PeriodeForm) => {
              console.log('Data dari form modal:', data);
              addMutation.mutate({
                mulai: Number(data.mulai),
                akhir: Number(data.akhir),
                status: data.status,
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
          </FormPeriode>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data Periode'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormPeriode
            type='Edit'
            defaultValues={formData}
            onSubmit={({ id, payload }) => {
              console.log('Data dari form modal:', data);
              updateMutation.mutate({
                id,
                payload: {
                  mulai: Number(payload.mulai),
                  akhir: Number(payload.akhir),
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
          </FormPeriode>
        </DialogModal>
      )}
      {modalState === 'Delete' && (
        <DialogModal
          title='Hapus data Periode'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <p>
            Yakin ingin menghapus data{' '}
            <i>
              {formData.mulai} - {formData.akhir}
            </i>{' '}
            ?
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

export default PeriodeTable;
