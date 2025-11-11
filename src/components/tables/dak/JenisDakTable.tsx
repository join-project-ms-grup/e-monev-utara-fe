import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { useJenisDakData } from '../../../hooks/DAK/TabelDataDak';
import {
  addSubjenisDAK,
  updateSubJenisDAK,
  type SubJenisDAK,
  type SubJenisDAKForm,
} from '../../../services/DAK/DAKJenisService';
import FormSubJenisDak from '../../forms/DAK/FormSubJenisDak';
import InputSearchBox from '../../inputs/InputSearchBox';

const JenisDakTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit' | 'Delete'>(
    'Add',
  );
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: SubJenisDAKForm = {
    id: Number(''),
    nama: '',
    keterangan: '',
    kode_jenis: '',
    status: true,
  };

  const [formData, setFormData] = useState<SubJenisDAKForm>(initialFormData);
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
  const [jenisDak, setJenisDak] = useState('1');
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data, refetch, isFetching } = useJenisDakData(Number(jenisDak));

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: SubJenisDAKForm) => {
      setLoadingMutation(true);
      return addSubjenisDAK({
        ...payload,
        kode_jenis: Number(payload.kode_jenis),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_sub_jenis_dak'] });
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
    mutationFn: async (payload: SubJenisDAKForm) => {
      setLoadingMutation(true);
      console.log(payload);
      return updateSubJenisDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_sub_jenis_dak'] });
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
  const columns: ColumnDef<SubJenisDAK>[] = [
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
      header: 'Jenis',
      meta: {
        thClassNames: 'w-[150px]',
        tdClassNames: 'text-center',
      },
      accessorKey: 'jenis_dak',
      cell: ({ getValue }) => (getValue() === 1 ? 'Fisik' : 'Non-Fisik'),
    },
    {
      accessorKey: 'nama',
      meta: {
        thClassNames: 'w-[450px]',
      },
      header: 'Nama',
    },
    {
      accessorKey: 'keterangan',
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: 'status',
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
    },
    {
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
                  id: row.original.id ?? 0,
                  nama: row.original.nama ?? '',
                  keterangan: row.original.keterangan ?? '',
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
    },
  ];

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex flex-1 gap-2 justify-start'>
          <div>
            <label htmlFor='jenisDAK'>Jenis DAK</label>
            <InputSearchBox
              id='jenisDAK'
              placeholder='Pilih Jenis DAK'
              className='h-9 w-32'
              value={jenisDak}
              options={[
                { label: 'Fisik', value: '1' },
                { label: 'Non-Fisik', value: '2' },
              ]}
              onChange={(val) => setJenisDak(val)}
            />
          </div>
        </div>
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
          title='Tambah data Sub Jenis'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormSubJenisDak
            type='Add'
            defaultValues={formData}
            onSubmit={(data: SubJenisDAKForm) => {
              addMutation.mutate(data);
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
          </FormSubJenisDak>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data Sub Jenis'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormSubJenisDak
            type='Edit'
            defaultValues={formData}
            onSubmit={(payload) => {
              updateMutation.mutate(payload);
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
          </FormSubJenisDak>
        </DialogModal>
      )}
    </div>
  );
};

export default JenisDakTable;
