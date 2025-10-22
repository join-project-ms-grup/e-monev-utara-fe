import { type ColumnDef, type RowData } from '@tanstack/react-table';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import Tabel from '../Tabel';
import RowExpand from '../RowExpand';
import {
  addPagu,
  getPagu,
  updatePagu,
  type PaguForm,
  type PaguMaster,
  type PaguMasterTree,
} from '../../../services/PaguService';
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
  getIndikator,
  type Indikator,
  type IndikatorForm,
  type IndikatorMaster,
  type IndikatorMasterTree,
} from '../../../services/IndikatorService';

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
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_indikator'],
    queryFn: () => getIndikator(8),
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
    target: [{ target: '', tahun_ke: '' }],
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
    mutationFn: async (payload: PaguForm) => {
      setLoadingMutation(true);
      return console.log(payload);
      // return addPagu({
      //   master_id: Number(payload.master_id),
      //   skpd_periode_id: Number(payload.skpd_periode_id),
      //   target: [
      //     {
      //       pagu: Number(payload.target?.[0].pagu),
      //       tahun_ke: Number(payload.target?.[0].tahun_ke),
      //     },
      //   ],
      // });
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
    mutationFn: async (payload: PaguForm) => {
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
        if (!indikatorList || indikatorList.length === 0) return <span>-</span>;

        return (
          <>
            {indikatorList.map((item, index) => (
              <tr>
                <td key={item.id}>
                  {item.name}
                </td>
              </tr>
            ))}
          </>
        );
      },
    },
    {
      accessorFn: (row) => row.indikator,
      header: 'Satuan',
      meta: {
        tdClassNames: 'p-0!',
      },
      cell: ({ getValue }) => {
        const indikatorList = getValue() as Indikator[];
        if (!indikatorList || indikatorList.length === 0) return <span>-</span>;

        return (
          <>
            {indikatorList.map((item, index) => (
              <tr>
                <td key={item.id}>
                  {item.satuan}
                </td>
              </tr>
            ))}
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
              {indikatorList.map((indikator: any, idx: number) => {
                const targetValue = indikator.target?.find(
                  (t: any) => t.tahun_ke === tahun,
                )?.target;
                return (
                  <tr key={indikator.id}>
                    <td className='align-top'>{targetValue ?? '-'}</td>
                  </tr>
                );
              })}
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
      <div className='flex items-end justify-end'>
        <div className='flex justify-between gap-2 items-end'>
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
        subLabelPosition={8}
        renderHeader={tableHead}
      />
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data Pagu'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormPagu
            type='Add'
            defaultValues={formData}
            onSubmit={(data: PaguForm) => {
              console.log('Data dari form modal:', data);
              addMutation.mutate({
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
          </FormPagu>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data Pagu'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormPagu
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
          </FormPagu>
        </DialogModal>
      )}
    </div>
  );
};

export default IndikatorTable;
