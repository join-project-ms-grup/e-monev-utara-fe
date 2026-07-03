import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { MdAdd, MdRefresh, MdSubdirectoryArrowRight } from 'react-icons/md';
import { useEffect, useState, type JSX } from 'react';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../../lib/api';
import { isDev } from '../../../../lib/usercookie';
import {
  type Master,
  getRekeningFlat,
  type MasterUrusan,
  updateMaster,
  getRekeningRKPD,
} from '../../../../services/RekeningService';
import FormRekening from '../../../forms/FormRekening';
import DialogModal from '../../../inputs/DialogModal';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox from '../../../inputs/InputSearchBox';
import InputText from '../../../inputs/InputText';
import Spinner from '../../../inputs/Spinner';
import Tabel from '../../Tabel';

const tableHead = () => {
  return (
    <tr>
      <th className='w-[50px]'>No</th>
      <th>Kode</th>
      <th>Nama</th>
    </tr>
  );
};

const RKPD_RekeningTable = () => {
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
    }
  }, [openModal]);

  // Data fetching
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['renja_rkpd_rekening'],
    queryFn: async () => {
      const renstra = await getRekeningRKPD();
      return getRekeningFlat(renstra);
    },
  });

  const tableBody = ({
    table,
    selectedRekening,
  }: {
    table: Table<MasterUrusan & { depth: number }>;
    selectedRekening: string;
  }) => {
    if (!data)
      return (
        <tr>
          <td colSpan={7}>TIDAK ADA DATA</td>
        </tr>
      );

    const levels = ['urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan'];
    const levelIndex = selectedRekening ? levels.indexOf(selectedRekening) : -1;

    // Filter berdasarkan selectedRekening
    let filteredData =
      levelIndex >= 0
        ? data.filter((item) => item.rekening === selectedRekening)
        : data;

    // Filter kode
    const kodeFilter = searchFields.kode?.trim();
    if (kodeFilter) {
      filteredData = filteredData.filter((item) =>
        (item.kodeFull || []).join('.').startsWith(kodeFilter),
      );
    }

    // Filter nama
    const nameFilter = searchFields.name?.trim().toLowerCase();
    if (nameFilter) {
      filteredData = filteredData.filter((item) =>
        item.name?.toLowerCase().includes(nameFilter),
      );
    }

    // Pagination
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const paginatedData = filteredData.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize,
    );

    // Mapping kodeFull ke item untuk header parent
    const parentMap: Record<string, MasterUrusan> = {};
    data.forEach((item) => {
      const key = item.kodeFull?.join('.') || '-';
      parentMap[key] = item;
    });

    const rows: JSX.Element[] = [];

    paginatedData.forEach((item, idx) => {
      if (levelIndex >= 0) {
        // Tambahkan header parent dari Urusan sampai parent level terpilih
        const parentCodes = item.kodeFull?.slice(0, levelIndex) || [];
        parentCodes.forEach((_code, i) => {
          const key = parentCodes.slice(0, i + 1).join('.');
          const nameItem = parentMap[key];
          if (nameItem) {
            const exists = rows.some(
              (r) => (r.key as string) === `header-${key}`,
            );
            if (!exists) {
              rows.push(
                <tr key={`header-${key}`} className='bg-gray-200 font-bold'>
                  <td colSpan={7}>
                    <div
                      className='inline-flex items-center gap-1'
                      style={{ paddingLeft: `${i * 16}px` }}
                    >
                      {i > 0 && <MdSubdirectoryArrowRight />}
                      <span>
                        [{parentCodes.slice(0, i + 1).join('.')}]{' '}
                        {nameItem.name}
                      </span>
                    </div>
                  </td>
                </tr>,
              );
            }
          }
        });
      }

      // Baris data level terpilih
      rows.push(
        <tr key={`row-${idx}`}>
          <td className='text-center'>{idx + 1}</td>
          <td className='text-left w-[50px]'>
            {item.kodeFull?.join('.') ?? ''}
          </td>
          <td>{item.name}</td>
        </tr>,
      );
    });

    return <>{rows}</>;
  };

  // Add
  // const addMutation = useMutation({
  //   mutationFn: async (payload: Master) => {
  //     setLoadingMutation(true);
  //     // return addMaster(payload);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['renja_rkpd_rekening'] });
  //     setFormData(initialFormData);
  //     setOpenModal(false);
  //     toast.success('Data berhasil ditambahkan');
  //   },
  //   onError: (error: AxiosError<ApiResponse<unknown>>) => {
  //     if (error.status === 400) {
  //       toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
  //     }
  //   },
  //   onSettled: () => {
  //     setLoadingMutation(false);
  //   },
  // });
  // Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Master }) => {
      setLoadingMutation(true);
      return updateMaster(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renja_rkpd_rekening'] });
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

  const columns: ColumnDef<MasterUrusan & { depth: number }>[] = [
    {
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'rekening',
      header: 'Rekening',
      enableSorting: false,
      filterFn: 'equalsString',
      meta: {
        tdClassNames: 'capitalize',
      },
      cell: ({ getValue }) =>
        getValue() === 'subKegiatan' ? 'Sub Kegiatan' : getValue(),
    },
    {
      id: 'kode',
      columns: ['Urusan', 'Bidang', 'Program', 'Kegiatan', 'Sub Kegiatan'].map(
        (label, index) => ({
          id: `kode_${label}`,
          // meta: {
          //   tdClassNames: 'w-[30px]',
          // },
          accessorFn: (row) => row.kodeFull?.[index],
          cell: ({ getValue }) => {
            const value = getValue();
            return value ?? '';
          },
        }),
      ),
      filterFn: (row, _columnId, filterValue) => {
        const kodeArray = row.original.kodeFull || [];
        const joined = kodeArray.join('.');
        const search = String(filterValue).trim();
        return joined.startsWith(search);
      },
    },
    {
      accessorKey: 'name',
      header: 'Nama',
    },
    // {
    //   header: 'Aksi',
    //   cell: ({ row }) => (
    //     <>
    //       <AksiButton
    //         Icon={MdEdit}
    //         onClick={() => {
    //           setModalState('Edit');
    //           setFormData(row.original);
    //           setOpenModal(true);
    //         }}
    //       />
    //     </>
    //   ),
    //   meta: {
    //     tdClassNames: 'text-center',
    //   },
    // },
  ];

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div className='w-96'>
            <label htmlFor='nama'>Nama</label>
            <InputText
              id='nama'
              placeholder='Cari nama...'
              wrapperClassname='bg-white'
              value={searchFields.name}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, name: e.target.value }))
              }
              onClear={() => setSearchFields((prev) => ({ ...prev, name: '' }))}
            />
          </div>
          <div className='w-42'>
            <label htmlFor='kode'>Kode</label>
            <InputText
              id='kode'
              inputMode='numeric'
              maxLength={20}
              placeholder='Cari kode...'
              wrapperClassname='bg-white'
              value={searchFields.kode}
              onChange={(e) => {
                setSearchFields((prev) => ({ ...prev, kode: e.target.value }));
              }}
              onClear={() => setSearchFields((prev) => ({ ...prev, kode: '' }))}
            />
          </div>
          <div>
            <label htmlFor='rekening'>Rekening</label>
            <InputSearchBox
              id='rekening'
              className='h-9'
              btnclassName='bg-white'
              placeholder='Pilih rekening...'
              value={searchFields.rekening}
              options={[
                { label: 'Urusan', value: 'urusan' },
                { label: 'Bidang', value: 'bidang' },
                { label: 'Program', value: 'program' },
                { label: 'Kegiatan', value: 'kegiatan' },
                { label: 'Sub Kegiatan', value: 'subKegiatan' },
              ]}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, rekening: e }))
              }
              onClear={() =>
                setSearchFields((prev) => ({ ...prev, rekening: '' }))
              }
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
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
      <Tabel
        data={data || []}
        columns={columns}
        searchFilters={filters}
        renderHeader={tableHead}
        renderBody={(table) =>
          tableBody({ table, selectedRekening: searchFields.rekening })
        }
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
            onSubmit={(_data) => {
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
    </div>
  );
};

export default RKPD_RekeningTable;
