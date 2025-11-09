import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import Spinner from '../../inputs/Spinner';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import DialogModal from '../../inputs/DialogModal';
import InputButton from '../../inputs/InputButton';
import FormSKPD from '../../forms/FormSKPD';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../lib/api';
import Tabel from '../Tabel';
import { isDev } from '../../../lib/usercookie';
import {
  addOPDDAK,
  getOPDDAK,
  updateOPDDAK,
  type OPDDAKForm,
} from '../../../services/DAK/DAKOPDService';
import FormOPDDak from '../../forms/DAK/FormOPDDak';

const OPDDakTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit' | 'Delete'>(
    'Add',
  );
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: OPDDAKForm = {
    id: Number(''),
    kode: '',
    fullname: '',
    shortname: '',
    status: Boolean(''),
  };

  const [formData, setFormData] = useState<OPDDAKForm>(initialFormData);

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
    queryKey: ['list_opd_dak'],
    queryFn: getOPDDAK,
  });

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: OPDDAKForm) => {
      setLoadingMutation(true);
      return addOPDDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_opd_dak'] });
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
    mutationFn: async (payload: OPDDAKForm) => {
      setLoadingMutation(true);
      return updateOPDDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_opd_dak'] });
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
  const columnHelper = createColumnHelper<OPDDAKForm>();
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
    columnHelper.accessor('fullname', {
      header: 'Nama',
    }),
    columnHelper.accessor('shortname', {
      header: 'Singkatan',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      meta: {
        tdClassNames: 'text-center',
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
                  fullname: row.original.fullname,
                  shortname: row.original.shortname,
                  status: row.original.status,
                });
                setOpenModal(true);
              }}
            >
              <MdEdit className='text-xl' />
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
      <Tabel data={data || []} columns={columns} />
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data OPD'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormOPDDak
            type='Add'
            defaultValues={formData}
            onSubmit={(data: OPDDAKForm) => {
              console.log('Data dari form modal:', data);
              addMutation.mutate({
                kode: data.kode,
                fullname: data.fullname,
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
          </FormOPDDak>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data OPD'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormOPDDak
            type='Edit'
            defaultValues={formData}
            onSubmit={(data: OPDDAKForm) => {
              console.log('Data dari form modal:', data);
              updateMutation.mutate({
                id: data.id,
                kode: data.kode,
                fullname: data.fullname,
                shortname: data.shortname,
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
          </FormOPDDak>
        </DialogModal>
      )}
    </div>
  );
};

export default OPDDakTable;
