import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addMaster,
  getRekening,
  updateMaster,
  type Master,
  type MasterTree,
  type MasterUrusan,
} from '../../../services/MasterService';
import { type ColumnDef } from '@tanstack/react-table';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import Tabel from '../Tabel';
import Spinner from '../../inputs/Spinner';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import { useEffect, useState } from 'react';
import InputText from '../../inputs/InputText';
import RowExpand from '../RowExpand';
import RowExpandValue from '../RowExpandValue';
import { getRoleId } from '../../../lib/usercookie';
import DialogModal from '../../inputs/DialogModal';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';
import FormRekening from '../../forms/FormRekening';
import AksiButton from '../../inputs/AksiButton';

const RekeningTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit' | 'Delete'>(
    'Add',
  );
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: Master = {
    id: Number(''),
    kode: '',
    name: '',
    parent: '',
    rekening: '',
  };

  const [formData, setFormData] = useState<Master>(initialFormData);
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
    queryKey: ['tabel_rekening'],
    queryFn: async () => {
      try {
        const result = await getRekening();
        return result;
      } catch (err) {
        console.error('Terjadi error:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: Master) => {
      setLoadingMutation(true);
      console.log(payload)
      // return addMaster(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_rekening'] });
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
    mutationFn: async ({ id, payload }: { id: number; payload: Master }) => {
      setLoadingMutation(true);
      return updateMaster(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_rekening'] });
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
      console.log(id);
      // return deletePeriode(id);
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

  const subRows = (row: MasterTree) =>
    row.bidang ?? row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const [searchFields, setSearchFields] = useState({
    name: '',
    kode: '',
    rekening: '',
  });
  const [filters, setFilters] = useState<{ field: string; value: string }[]>(
    [],
  );

  useEffect(() => {
    const newFilters = Object.entries(searchFields)
      .filter(([_, value]) => value)
      .map(([field, value]) => ({ field, value }));
    setFilters(newFilters);
  }, [searchFields]);

  const columns: ColumnDef<MasterUrusan>[] = [
    {
      header: ' ',
      cell: (ctx) => <RowExpand {...ctx} />,
      meta: {
        thClassNames: 'w-[60px]',
        tdClassNames: 'text-center',
      },
    },
    {
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[60px]',
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'kode',
      header: 'Kode',
      meta: {
        thClassNames: 'w-[150px]',
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'rekening',
      header: 'Rekening',
      enableSorting: false,
      filterFn: 'equalsString',
      meta: {
        thClassNames: 'w-[200px]',
        tdClassNames: 'text-center capitalize',
      },
    },
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: (ctx) => <RowExpandValue {...ctx} />,
    },
    {
      header: 'Aksi',
      cell: ({ row }) => (
        <>
          <AksiButton
            Icon={MdEdit}
            onClick={() => {
              setModalState('Edit');
              setFormData(row.original);
              setOpenModal(true);
            }}
          />
        </>
      ),
      meta: {
        // thClassNames: 'w-[200px]',
        tdClassNames: 'text-center',
      },
    },
  ];

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='nama'>Nama</label>
            <InputText
              id='nama'
              placeholder='Cari nama...'
              wrapperClassname='bg-white'
              value={searchFields.name}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className='w-28'>
            <label htmlFor='kode'>Kode</label>
            <InputText
              id='kode'
              inputMode='numeric'
              maxLength={9}
              placeholder='Cari kode...'
              wrapperClassname='bg-white'
              value={searchFields.kode}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, kode: e.target.value }))
              }
            />
          </div>
          <div>
            <label htmlFor='rekening'>Rekening</label>
            <InputSearchBox
              id='rekening'
              className='w-44 h-9'
              btnclassName='bg-white'
              placeholder='Pilih rekening...'
              value={searchFields.rekening}
              options={[
                { label: 'Urusan', value: 'urusan' },
                { label: 'Bidang', value: 'bidang' },
                { label: 'Program', value: 'program' },
                { label: 'Kegiatan', value: 'kegiatan' },
                { label: 'Sub Kegiatan', value: 'sub kegiatan' },
              ]}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, rekening: e }))
              }
              onClear={() =>
                setSearchFields((prev) => ({ ...prev, rekening: '' }))
              }
              withClear
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
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
            {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />}
          </InputButton>
        </div>
      </div>
      <Tabel
        data={data || []}
        columns={columns}
        subRows={subRows}
        subLabels={['Bidang', 'Program', 'Kegiatan', 'SubKegiatan']}
        searchFilters={filters}
        subLabelPosition={2}
      />
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data Rekening'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormRekening
            type='Add'
            defaultValues={formData}
            onSubmit={(data) => {
              console.log('Data dari form modal:', data);
              // addMutation.mutate({
              //   kode: data.kode,
              //   name: data.name,
              //   type: data.rekening,
              //   parent: data.parent
              // });
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
          </FormRekening>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data Rekening'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormRekening
            type='Edit'
            defaultValues={formData as any}
            onSubmit={({ id, payload }) => {
              console.log('Data dari form modal:', payload);
              updateMutation.mutate({
                id,
                payload: {
                  kode: payload.kode,
                  name: payload.name,
                  type: payload.rekening,
                  parent: payload.parent! ?? null,
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
          </FormRekening>
        </DialogModal>
      )}
      {modalState === 'Delete' && (
        <DialogModal
          title='Hapus data Rekening'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <p>
            Yakin ingin menghapus data{' '}
            <i>
              {formData.kode}
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
    </div>
  );
};

export default RekeningTable;
