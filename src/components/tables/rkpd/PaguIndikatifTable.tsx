import { type ColumnDef } from '@tanstack/react-table';
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
import { getPeriodeFromCookie } from '../../../lib/usercookie';
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
import type { IconBaseProps } from 'react-icons/lib';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2}></th>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Kode</th>
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
        <th rowSpan={1} colSpan={2}>
          Pagu
        </th>
        <th rowSpan={2}>Aksi</th>
      </tr>
      <tr>
        <th rowSpan={1}>Tahun Ke</th>
        <th rowSpan={1}>Pagu</th>
      </tr>
    </>
  );
};

const PaguIndikatifTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit'>('Add');
  const [openModal, setOpenModal] = useState(false);
  // Form Data
  const initialFormData: PaguForm = {
    skpd_periode_id: Number(getPeriodeFromCookie()),
    master_id: '',
    target: [{ pagu: '', tahun_ke: '' }],
  };
  const [formData, setFormData] = useState<PaguForm>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      console.log('PaguIndikatifTable.tsx', formData);
    }
  }, [openModal]);

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: PaguForm) => {
      setLoadingMutation(true);
      return addPagu({
        master_id: Number(payload.master_id),
        skpd_periode_id: Number(payload.skpd_periode_id),
        target: [
          {
            pagu: Number(payload.target?.[0].pagu),
            tahun_ke: Number(payload.target?.[0].tahun_ke),
          },
        ],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_pagu'] });
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
      return updatePagu(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_pagu'] });
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

  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_pagu'],
    queryFn: () => getPagu(Number(getPeriodeFromCookie())),
  });

  const subRows = (row: PaguMasterTree) =>
    row.bidang ?? row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const columns: ColumnDef<PaguMaster>[] = [
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
      enableSorting: false,
      filterFn: 'equalsString',
      meta: {
        tdClassNames: 'capitalize',
      },
      cell: (ctx) => (
        <>
          <span>{`[id:${ctx.row.original.id}] `}</span>
          <RowExpandValue {...ctx} />
        </>
      ),
    },
    {
      header: 'Pagu',
      meta: {
        tdClassNames: 'text-center',
      },
      columns: [
        {
          id: 'tahun_ke',
          accessorFn: (row) => row.pagu?.[0].tahun_ke,
          header: 'Tahun Ke',
          meta: {
            tdClassNames: 'text-center',
          },
        },
        {
          id: 'pagu',
          accessorFn: (row) => row.pagu?.[0].pagu,
          header: 'Pagu',
          meta: {
            tdClassNames: 'text-center',
          },
        },
      ],
    },
    {
      header: 'Aksi',
      cell: (ctx) => {
        if (ctx.row.original.pagu) {
          const data = ctx.row.original;
          return (
            <>
              <AksiButton
                Icon={MdEdit}
                tooltip='Ubah'
                onClick={() => {
                  setFormData({
                    master_id: data.id,
                    skpd_periode_id: Number(getPeriodeFromCookie()),
                    target: [
                      {
                        pagu: data.pagu?.[0].pagu,
                        tahun_ke: data.pagu?.[0].tahun_ke,
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
        subLabelPosition={4}
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

export default PaguIndikatifTable;
