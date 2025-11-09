import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import Spinner from '../../inputs/Spinner';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import DialogModal from '../../inputs/DialogModal';
import InputButton from '../../inputs/InputButton';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../lib/api';
import { getRoleId } from '../../../lib/usercookie';
import Tabel from '../Tabel';
import {
  addTahunDAK,
  getTahunDAK,
  toggleTahunDAK,
  updateTahunDAK,
  type TahunDAKForm,
} from '../../../services/DAK/DAKTahunService';
import FormTahunDak from '../../forms/DAK/FormTahunDak';
import InputToggle from '../../inputs/InputToggle';
import AksiButton from '../../inputs/AksiButton';

const TahunDakTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit'>('Add');
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: TahunDAKForm = {
    id: 0,
    keterangan: '',
    tahun: '',
  };

  const [formData, setFormData] = useState<TahunDAKForm>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [openModal]);

  // Data fetching
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['list_tahun_dak'],
    queryFn: () => getTahunDAK(),
  });

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: TahunDAKForm) => {
      setLoadingMutation(true);
      return addTahunDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_tahun_dak'] });
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
    mutationFn: async (payload: TahunDAKForm) => {
      setLoadingMutation(true);
      return updateTahunDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_tahun_dak'] });
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
  const setStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      setLoadingMutation(true);
      return toggleTahunDAK(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_tahun_dak'] });
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

  // Kolom
  const columns: ColumnDef<TahunDAKForm>[] = [
    {
      header: 'No',
      enableSorting: true,
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'tahun',
      header: 'Tahun',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'keterangan',
      header: 'Keterangan',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ getValue }) => getValue() ?? '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        tdClassNames: 'text-center w-[50px]',
      },
      cell: ({ cell, row }) => (
        <div className='w-30'>
          <InputToggle
            onLabel='Aktif'
            offLabel='Nonaktif'
            checked={!!cell.getValue()}
            onToggle={() => setStatusMutation.mutate(row.original.id!)}
          />
        </div>
      ),
      //   cell: (info) => (
      //     <span
      //       className={`${info.getValue() ? ' text-green-700' : 'text-red-700'}`}
      //     >
      //       {info.getValue() ? 'Aktif' : 'Nonaktif'}
      //     </span>
      //   ),
    },
    {
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <div className='inline-flex gap-1'>
            <AksiButton
              Icon={MdEdit}
              tooltip='Ubah data'
              onClick={() => {
                setModalState('Edit');
                setFormData(row.original);
                setOpenModal(true);
              }}
            />
          </div>
        </>
      ),
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center',
      },
    },
  ];

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          {getRoleId() === 1 && (
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
      <Tabel data={data || []} columns={columns} />
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data Tahun'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormTahunDak
            type='Add'
            defaultValues={formData}
            onSubmit={(data: TahunDAKForm) => {
              console.log('Data dari form modal:', data);
              addMutation.mutate({
                keterangan: data.keterangan,
                tahun: Number(data.tahun),
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
          </FormTahunDak>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data Tahun'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormTahunDak
            type='Edit'
            defaultValues={formData}
            onSubmit={(data: TahunDAKForm) => {
              console.log('Data dari form modal:', data);
              if (data.id) {
                updateMutation.mutate({
                  id: data.id,
                  keterangan: data.keterangan,
                  tahun: Number(data.tahun),
                });
              }
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
          </FormTahunDak>
        </DialogModal>
      )}
    </div>
  );
};

export default TahunDakTable;
