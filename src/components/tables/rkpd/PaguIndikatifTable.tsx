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
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../lib/usercookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../inputs/Spinner';
import { useEffect, useState } from 'react';
import DialogModal from '../../inputs/DialogModal';
import FormPagu from '../../forms/FormPagu';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';
import AksiButton from '../../inputs/AksiButton';

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
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
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

const PaguIndikatifTable = () => {
  const queryClient = useQueryClient();
  //#region Modal, FormData & Tabel Data
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_pagu'],
    queryFn: () => getPagu(Number(getPeriodeIDFromCookie())),
  });
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit'>('Add');
  const [openModal, setOpenModal] = useState(false);
  // Form Data
  const initialFormData: PaguForm = {
    skpd_periode_id: Number(getPeriodeIDFromCookie()),
    master_id: '',
    master_name: '',
    target: [
      { tahun_ke: '1', pagu: '' },
      { tahun_ke: '2', pagu: '' },
      { tahun_ke: '3', pagu: '' },
      { tahun_ke: '4', pagu: '' },
      { tahun_ke: '5', pagu: '' },
    ],
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
  //#endregion

  //#region Mutasi
  const [loadingMutation, setLoadingMutation] = useState(false);
  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: PaguForm) => {
      setLoadingMutation(true);
      return addPagu({
        master_id: Number(payload.master_id),
        skpd_periode_id: Number(payload.skpd_periode_id),
        target: payload.target?.slice(0, 5).map((t) => ({
          pagu: Number(t.pagu),
          tahun_ke: Number(t.tahun_ke),
        })),
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
      // return updatePagu(payload);
      return updatePagu({
        master_id: Number(payload.master_id),
        skpd_periode_id: Number(payload.skpd_periode_id),
        target: payload.target?.slice(0, 5).map((t) => ({
          pagu: Number(t.pagu),
          tahun_ke: Number(t.tahun_ke),
        })),
      });
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
  //#endregion

  // #region Kolom Tabel
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
      cell: ({ row }) => (
        <div
          className='inline-flex items-start'
          style={{
            paddingLeft: `${row.depth * 1}rem`,
          }}
        >
          {row.index + 1}
        </div>
      ),
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'name',
      header: 'Urusan / Bidang / Program / Kegiatan / Sub Kegiatan',
      cell: ({ row, getValue }) => {
        let currentRow: any = row;
        const kodeArray: string[] = [];
        while (currentRow) {
          kodeArray.unshift(currentRow.original.kode); // unshift supaya root duluan
          currentRow = currentRow.getParentRow?.();
        }

        return (
          <div className='' style={{ paddingLeft: `${row.depth * 1}rem` }}>
            <span className='font-bold'>{`[${kodeArray.join('.')}] `}</span>
            {getValue<string>()}
          </div>
        );
      },
    },
    {
      header: 'Target',
      meta: {
        tdClassNames: 'text-center',
      },
      columns: [1, 2, 3, 4, 5].map((tahun) => ({
        id: `pagu${tahun}`,
        header: `Pagu ${tahun}`,
        meta: { tdClassNames: 'text-center p-0!' },
        accessorFn: (row) => {
          const item = row.pagu?.find((p) => p.tahun_ke === tahun);
          return item ? item.pagu : null;
        },
      })),
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
                  const mappedPagu = formData.target?.map(({ tahun_ke }) => {
                    const found = data.pagu?.find(
                      (p) => Number(p.tahun_ke) === Number(tahun_ke),
                    );
                    return {
                      tahun_ke,
                      pagu: found?.pagu || 0,
                    };
                  });
                  setFormData({
                    master_id: data.id,
                    master_name: data.name,
                    skpd_periode_id: Number(getPeriodeIDFromCookie()),
                    target: mappedPagu,
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
        // subLabels={['Bidang', 'Program', 'Kegiatan', 'SubKegiatan']}
        // subLabelPosition={4}
        renderHeader={tableHead}
        tblClassName='lg:min-w-[1500px]'
        initialExpanded
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
