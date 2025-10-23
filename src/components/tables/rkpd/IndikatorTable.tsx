import { type ColumnDef } from '@tanstack/react-table';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import Tabel from '../Tabel';
import RowExpand from '../RowExpand';
import { type PaguForm } from '../../../services/PaguService';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../lib/usercookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../inputs/Spinner';
import RowExpandValue from '../RowExpandValue';
import { useEffect, useState } from 'react';
import DialogModal from '../../inputs/DialogModal';
import FormPagu from '../../forms/FormPagu';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';
import AksiButton from '../../inputs/AksiButton';
import {
  addIndikator,
  getIndikator,
  type Indikator,
  type IndikatorForm,
  type IndikatorMaster,
  type IndikatorMasterTree,
} from '../../../services/IndikatorService';
import { getSKPDPeriode } from '../../../services/PeriodeService';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import FormIndikator from '../../forms/FormIndikator';

const tableHead = () => {
  const mulai = Number(getPeriodeMulaiFromCookie()!);
  const akhir = Number(getPeriodeAkhirFromCookie()!);

  const periode = Array.from(
    { length: akhir - mulai + 1 },
    (_, i) => mulai + i,
  );
  return (
    <>
      <tr>
        <th rowSpan={2}></th>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Kode</th>
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
        <th rowSpan={2}>Indikator</th>
        <th rowSpan={2}>Satuan</th>
        <th rowSpan={1} colSpan={5}>
          Target
        </th>
        <th rowSpan={2}>Aksi</th>
      </tr>
      <tr>
        {periode.map((thn) => (
          <th key={thn} rowSpan={1}>
            {thn}
          </th>
        ))}
      </tr>
    </>
  );
};

const IndikatorTable = () => {
  const queryClient = useQueryClient();
  // #region Modal & FormData & Tabel Data
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPeriode(Number(getPeriodeIDFromCookie())),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `[${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_indikator', selectedSKPD],
    queryFn: () => getIndikator(Number(selectedSKPD)),
  });
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit'>('Add');
  const [openModal, setOpenModal] = useState(false);
  // Form Data
  const initialFormData: IndikatorForm = {
    skpd_periode_id: '',
    master_id: '',
    name: '',
    satuan: '',
    target: [
      { tahun_ke: '1', target: '' },
      { tahun_ke: '2', target: '' },
      { tahun_ke: '3', target: '' },
      { tahun_ke: '4', target: '' },
      { tahun_ke: '5', target: '' },
    ],
  };
  const [formData, setFormData] = useState<IndikatorForm>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      console.log('IndikatorTable.tsx', formData);
    }
  }, [openModal]);
  // #endregion

  // #region Mutasi
  const [loadingMutation, setLoadingMutation] = useState(false);
  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: IndikatorForm) => {
      setLoadingMutation(true);
      return addIndikator({
        ...payload,
        skpd_periode_id: Number(payload.skpd_periode_id),
        master_id: Number(payload.master_id),
        target: payload.target?.slice(0, 5).map((t) => ({
          target: Number(t.target),
          tahun_ke: Number(t.tahun_ke),
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_indikator'] });
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
    mutationFn: async (payload: IndikatorForm) => {
      setLoadingMutation(true);
      return console.log(payload);
      // return updatePagu(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_indikator'] });
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
  // #endregion

  // #region Kolom Tabel
  const subRows = (row: IndikatorMasterTree) =>
    row.bidang ?? row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const columns: ColumnDef<IndikatorMaster>[] = [
    {
      header: ' ',
      cell: (ctx) => <RowExpand {...ctx} />,
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'kode',
      header: 'Kode',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'name',
      header: 'Urusan / Bidang / Program / Kegiatan / Sub Kegiatan',
      cell: (ctx) => (
        <>
          <RowExpandValue {...ctx} />
        </>
      ),
    },
    {
      accessorFn: (row) => row.indikator,
      header: 'Indikator',
      meta: {
        tdClassNames: 'p-0!',
      },
      cell: ({ getValue }) => {
        const indikatorList = getValue() as Indikator[];
        if (!indikatorList || indikatorList.length === 0) return null;

        return (
          <>
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((item, index) => (
                    <tr key={item.id}>
                      <td className='block overflow-y-auto h-[70px]'>
                        {item.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      },
    },
    {
      accessorFn: (row) => row.indikator,
      header: 'Satuan',
      meta: {
        tdClassNames: 'p-0! flex flex-col',
      },
      cell: ({ getValue }) => {
        const indikatorList = getValue() as Indikator[];
        if (!indikatorList || indikatorList.length === 0) return null;

        return (
          <>
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((item, index) => (
                    <tr key={item.id}>
                      <td className='block overflow-y-auto h-[70px]'>
                        {item.satuan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      },
    },
    {
      header: 'Target',
      meta: { tdClassNames: 'text-center' },
      columns: [1, 2, 3, 4, 5].map((tahun) => ({
        id: `tahun_ke_${tahun}`,
        header: `Target ${tahun}`,
        meta: { tdClassNames: 'text-center p-0!' },
        cell: ({ row }: any) => {
          const indikatorList = row.original.indikator ?? [];
          if (!indikatorList.length) return '\u00A0';

          return (
            <>
              <div>
                <table className='w-full'>
                  <tbody className='border-0!'>
                    {indikatorList.map((indikator: any, idx: number) => {
                      const targetValue = indikator.target?.find(
                        (t: any) => t.tahun_ke === tahun,
                      )?.target;
                      return (
                        <tr key={indikator.id}>
                          <td className='block overflow-y-auto h-[70px]'>
                            {targetValue ?? '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        },
      })),
    },
    {
      header: 'Aksi',
      cell: (ctx) => {
        if (ctx.row.original.indikator) {
          const data = ctx.row.original;
          return (
            <>
              <AksiButton
                Icon={MdEdit}
                tooltip='Ubah'
                onClick={() => {
                  setFormData({
                    master_id: data.id,
                    skpd_periode_id: Number(getPeriodeIDFromCookie()),
                    target: [
                      {
                        target: data.indikator?.[0].target?.[0].target,
                        tahun_ke: data.indikator?.[0].target?.[0].tahun_ke,
                      },
                    ],
                  });
                  setModalState('Edit');
                  setOpenModal(true);
                }}
              />
            </>
          );
        }
      },
      meta: {
        tdClassNames: 'text-center',
      },
    },
  ];
  // #endregion

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='skpd'>SKPD</label>
            <InputSearchBox
              id='skpd'
              className='w-64 h-9'
              btnclassName='bg-white'
              placeholder='Pilih SKPD...'
              value={selectedSKPD.toString()}
              options={listSKPDPeriode as OptionItem[]}
              onChange={(val) => setSelectedSKPD(val)}
              onClear={() => setSelectedSKPD('')}
              withSearch
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
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
        subLabelPosition={9}
        renderHeader={tableHead}
        tblClassName='md:min-w-[1600px]'
      />
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data Indikator'
          isOpen={openModal}
          widthLevel={6}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormIndikator
            type='Add'
            defaultValues={formData}
            onSubmit={(data: IndikatorForm) => {
              console.log('Data dari form modal:', data);
              addMutation.mutate({
                skpd_periode_id: data.skpd_periode_id,
                master_id: data.master_id,
                name: data.name,
                satuan: data.satuan,
                target: data.target,
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
          </FormIndikator>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data Indikator'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <></>
          {/* <FormPagu
            type='Edit'
            defaultValues={formData}
            onSubmit={(data: PaguForm) => {
              console.log('Data dari form modal:', data);
              updateMutation.mutate({
                skpd_periode_id: data.skpd_periode_id,
                master_id: data.master_id,
                target: data.target,
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
          </FormPagu> */}
        </DialogModal>
      )}
    </div>
  );
};

export default IndikatorTable;
