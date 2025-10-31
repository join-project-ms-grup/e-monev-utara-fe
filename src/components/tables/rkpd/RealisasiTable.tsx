import { useEffect, useState, type ReactNode } from 'react';
import Tabel from '../Tabel';
import { MdEdit, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import { type ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import {
  addRealisasi,
  getRealisasiFlat,
  type RealisasiForm,
  type RealisasiMaster,
} from '../../../services/RealisasiService';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../lib/usercookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AksiButton from '../../inputs/AksiButton';
import Spinner from '../../inputs/Spinner';
import DialogModal from '../../inputs/DialogModal';
import FormRealisasi from '../../forms/FormRealisasi';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../lib/api';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import { formatUang } from '../../../lib/helper';
import { getSKPDPeriode } from '../../../services/PeriodeService';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2} colSpan={5}>
          Kode
        </th>
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
        <th rowSpan={2}>Pagu</th>
        <th rowSpan={1} colSpan={5}>
          Triwulan
        </th>
        <th rowSpan={2}>Aksi</th>
      </tr>
      <tr>
        <th>I</th>
        <th>II</th>
        <th>III</th>
        <th>IV</th>
        <th>Total</th>
      </tr>
    </>
  );
};

const RealisasiTable = () => {
  const queryClient = useQueryClient();
  //#region SKPD dan Tahun ke
  const [tahunKe, setTahunKe] = useState('');
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
  //#endregion

  //#region Modal, FormData & Tabel Data
  // const { data, refetch, isFetching } = useQuery({
  //   queryKey: ['tabel_realisasi', selectedSKPD, tahunKe],
  //   queryFn: () => getRealisasi(Number(selectedSKPD), Number(tahunKe)),
  //   enabled: !!(selectedSKPD && tahunKe),
  // });
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_realisasi', selectedSKPD, tahunKe],
    queryFn: async () => getRealisasiFlat(Number(selectedSKPD), Number(tahunKe)),
    enabled: !!(selectedSKPD && tahunKe),
  });
  // Modal
  const [openModal, setOpenModal] = useState(false);
  // Form Data
  const initialFormData: RealisasiForm = {
    master_name: '',
    id_pagu: 0,
    realisasi: [
      { triwulan: '1', realisasi: '' },
      { triwulan: '2', realisasi: '' },
      { triwulan: '3', realisasi: '' },
      { triwulan: '4', realisasi: '' },
    ],
  };
  const [formData, setFormData] = useState<RealisasiForm>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      console.log('RealisasiTable.tsx', formData);
    }
  }, [openModal]);
  //#endregion

  //#region Mutasi
  const [loadingMutation, setLoadingMutation] = useState(false);
  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: RealisasiForm) => {
      setLoadingMutation(true);
      return addRealisasi({
        id_pagu: Number(payload.id_pagu),
        realisasi: payload.realisasi?.slice(0, 4).map((t) => ({
          realisasi: Number(t.realisasi),
          triwulan: Number(t.triwulan),
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_realisasi'] });
      setFormData(initialFormData);
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
  // const subRows = (row: RealisasiMasterTree) =>
  //   row.bidang ?? row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const columns: ColumnDef<RealisasiMaster>[] = [
    {
      id: 'kode',
      columns: ['Urusan', 'Bidang', 'Program', 'Kegiatan', 'Sub Kegiatan'].map(
        (label, index) => ({
          id: `kode_${label}`,
          meta: {
            tdClassNames: 'w-[30px]',
          },
          accessorFn: (row) => row.kodeFull?.[index],
          cell: ({ getValue }) => {
            const value = getValue();
            return value ?? '';
          },
        }),
      ),
    },
    {
      accessorKey: 'name',
      cell: ({ getValue, row }) => {
        const typeBold = ['urusan', 'bidang']
        const isBold = !!typeBold.find(item => item === row.original.type);
        return (
          <>
            <span className={isBold ? 'font-bold' : undefined}>
              {getValue() as ReactNode}
            </span>
          </>
        );
      },
    },
    {
      accessorKey: 'pagu',
      header: 'Pagu',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ getValue }) =>
        `${getValue() ? formatUang(Number(getValue())) : ''}`,
    },
    {
      header: 'Triwulan',
      meta: {
        tdClassNames: 'text-center',
      },
      columns: [1, 2, 3, 4].map((triwulan) => ({
        id: `realisasi_per_triwulan${triwulan}`,
        header: `Realisasi Per Triwulan ${triwulan}`,
        meta: { tdClassNames: 'text-center' },
        accessorFn: (row) => {
          const item = row.realisasi_per_triwulan?.find(
            (p) => p.triwulan === triwulan,
          );
          return item ? formatUang(Number(item.realisasi)) : null;
        },
      })),
    },
    {
      accessorKey: 'realisasi',
      header: 'Total',
      meta: {
        tdClassNames: 'text-center font-bold',
      },
      cell: ({ getValue }) =>
        `${getValue() ? formatUang(Number(getValue())) : ''}`,
    },
    {
      header: 'Aksi',
      cell: (ctx) => {
        if (
          ctx.row.original.pagu &&
          ctx.row.original.type?.includes('subKegiatan')
        ) {
          const data = ctx.row.original;
          return (
            <>
              <AksiButton
                Icon={MdEdit}
                tooltip='Ubah'
                onClick={() => {
                  const mappedRealisasi = formData.realisasi?.map(
                    ({ triwulan }) => {
                      const found = data.realisasi_per_triwulan?.find(
                        (p) => Number(p.triwulan) === Number(triwulan),
                      );
                      return {
                        triwulan,
                        realisasi: found?.realisasi || 0,
                      };
                    },
                  );
                  setFormData({
                    master_name: data.name,
                    id_pagu: data.id_pagu,
                    realisasi: mappedRealisasi,
                  });
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

  //#region List data periode
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${i + 1}`,
    }),
  );
  //#endregion

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='skpd'>SKPD</label>
            <InputSearchBox
              id='skpd'
              className='w-72 h-9'
              btnclassName='bg-white'
              placeholder='Pilih SKPD...'
              value={selectedSKPD.toString()}
              options={listSKPDPeriode as OptionItem[]}
              onChange={(val) => setSelectedSKPD(val)}
              onClear={() => {
                setSelectedSKPD('');
                setTahunKe('');
              }}
              withSearch
            />
          </div>
          <div>
            <label htmlFor='tahun_ke'>Tahun ke</label>
            <InputSearchBox
              id='tahun_ke'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Tahun ke...'
              value={tahunKe}
              options={listTahunKe}
              onChange={(val) => setTahunKe(val)}
              onClear={() => setTahunKe('')}
              disabled={!selectedSKPD}
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
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
        tblClassName='lg:min-w-[1500px]'
        data={data || []}
        columns={columns}
        // subRows={subRows}
        renderHeader={tableHead}
        // initialExpanded
      />
      <DialogModal
        title='Ubah data Realisasi'
        isOpen={openModal}
        onClose={() => {
          setFormData(initialFormData);
          setOpenModal(false);
        }}
      >
        <FormRealisasi
          defaultValues={formData}
          onSubmit={(data: RealisasiForm) => {
            console.log('Data dari form modal:', data);
            addMutation.mutate({
              id_pagu: data.id_pagu,
              realisasi: data.realisasi,
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
        </FormRealisasi>
      </DialogModal>
    </div>
  );
};

export default RealisasiTable;
