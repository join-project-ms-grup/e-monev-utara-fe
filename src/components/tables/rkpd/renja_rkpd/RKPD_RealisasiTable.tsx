import { useEffect, useState } from 'react';
import { MdInput, MdRefresh } from 'react-icons/md';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { formatUang } from '../../../../lib/helper';
import {
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getPeriodeAkhirFromCookie,
} from '../../../../lib/usercookie';
import {
  type RealisasiForm,
  flatRealisasi,
  type FlatRealisasiRKPD,
  getRealisasiRKPD,
} from '../../../../services/RealisasiService';
import FormRealisasi from '../../../forms/FormRealisasi';
import AksiButton from '../../../inputs/AksiButton';
import DialogModal from '../../../inputs/DialogModal';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import Spinner from '../../../inputs/Spinner';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import Tabel from '../../Tabel';
import { getSKPDPerRKPD } from '../../../../services/PeriodeService';

const RKPD_RealisasiTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: RealisasiForm = {
    rekening_kode: '',
    rekening_name: '',
    indikator_name: '',
    id_pagu: 0,
    id_rincian: 0,
    realisasi: [
      { triwulan: 1, realisasi: 0 },
      { triwulan: 2, realisasi: 0 },
      { triwulan: 3, realisasi: 0 },
      { triwulan: 4, realisasi: 0 },
    ],
    capaian: [
      { triwulan: 1, capaian: 0 },
      { triwulan: 2, capaian: 0 },
      { triwulan: 3, capaian: 0 },
      { triwulan: 4, capaian: 0 },
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
    }
  }, [openModal]);

  const [triwulanKe, setTriwulanKe] = useState('');
  const triwulanList = [
    { label: 'Triwulan I', value: '1' },
    { label: 'Triwulan II', value: '2' },
    { label: 'Triwulan III', value: '3' },
    { label: 'Triwulan IV', value: '4' },
  ];
  const idPeriodeCookie = Number(getPeriodeIDFromCookie());
  const [tahunKe, setTahunKe] = useState('');

  //#region SKPD
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_rkpd_skpd_periode'],
    queryFn: async () => getSKPDPerRKPD(idPeriodeCookie),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  //#region Data
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['rkpd_list_renja', tahunKe, selectedSKPD],
    queryFn: async () => {
      const rawData = await getRealisasiRKPD({
        skpd_periode_id: Number(selectedSKPD),
        tahun_ke: Number(tahunKe),
      });
      const flatData = await flatRealisasi(rawData, '');
      return flatData;
    },
    enabled: !!(selectedSKPD && tahunKe),
  });
  //#endregion

  // #region Kolom Tabel
  const columns: ColumnDef<FlatRealisasiRKPD>[] = [
    {
      header: 'Kode',
      accessorFn: (row) => {
        const parts = [
          row.kode_urusan,
          row.kode_bidang,
          row.kode_program,
          row.kode_kegiatan,
          row.kode_subKegiatan,
        ].filter(Boolean);

        return parts.join('.');
      },
    },
    {
      accessorKey: 'rekening',
    },
    {
      accessorKey: 'indikator_kinerja',
    },
    {
      accessorKey: 'satuan',
    },
    {
      accessorKey: 'target',
      cell: ({ row, getValue }) => {
        if (row.original.type === 'urusan' || row.original.type === 'bidang') {
          return '';
        }
        return <>{getValue() ?? '' + ' ' + row.original.satuan}</>;
      },
    },
    {
      accessorKey: 'target_anggaran',
      cell: ({ row, getValue }) => {
        if (row.original.type === 'urusan' || row.original.type === 'bidang') {
          return '';
        }
        if (getValue()) {
          return <>{formatUang(Number(getValue()))}</>;
        }
      },
    },
    {
      accessorKey: 'total_capaian',
    },
    {
      accessorKey: 'total_realisasi',
      cell: ({ row, getValue }) => {
        if (row.original.type === 'urusan' || row.original.type === 'bidang') {
          return '';
        }
        if (getValue()) {
          return <>{formatUang(Number(getValue()))}</>;
        } else {
          return '0';
        }
      },
    },
    {
      accessorKey: 'persen_capaian',
    },
    {
      accessorKey: 'persen_realisasi',
      cell: ({ row, getValue }) => {
        if (row.original.type === 'urusan' || row.original.type === 'bidang') {
          return '';
        }
        if (getValue()) {
          getValue() + ' %';
        } else {
          return '0 %';
        }
      },
    },
    {
      header: 'Aksi',
      cell: ({ row }) => {
        if (row.original.level === 'sub_kegiatan') {
          const data = row.original;
          return (
            <>
              <AksiButton
                Icon={MdInput}
                onClick={() => {
                  setFormData({
                    rekening_kode: `${data.kode_urusan}.${data.kode_bidang}.${data.kode_program}.${data.kode_kegiatan}.${data.kode_subKegiatan}`,
                    rekening_name: data.rekening,
                    indikator_name: data.indikator_kinerja,
                    id_pagu: data.id_pagu,
                    id_rincian: data.id_rincian,
                    capaian: [
                      { triwulan: 1, capaian: data.capaian_triwulan_I },
                      { triwulan: 2, capaian: data.capaian_triwulan_II },
                      { triwulan: 3, capaian: data.capaian_triwulan_III },
                      { triwulan: 4, capaian: data.capaian_triwulan_IV },
                    ],
                    realisasi: [
                      { triwulan: 1, realisasi: data.realisasi_triwulan_I },
                      { triwulan: 2, realisasi: data.realisasi_triwulan_II },
                      { triwulan: 3, realisasi: data.realisasi_triwulan_III },
                      { triwulan: 4, realisasi: data.realisasi_triwulan_IV },
                    ],
                  });
                  setOpenModal(true);
                }}
              />
            </>
          );
        }
      },
    },
  ];
  // #endregion

  //#region Table Head
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2} className='w-[50px]'>
            Kode
          </th>
          <th rowSpan={2} className='w-[20%]'>
            Urusan / Bidang / Program / Kegiatan / Sub Kegiatan
          </th>
          <th rowSpan={2} className='w-[25%]'>
            Indikator
          </th>
          <th rowSpan={2} className='w-[150px]'>
            Satuan
          </th>
          <th colSpan={2}>Target</th>
          <th colSpan={2}>Total</th>
          <th colSpan={2}>(%)</th>
          <th rowSpan={2} className='w-[50px]'>
            Aksi
          </th>
        </tr>
        <tr>
          <th className='w-[150px]'>K</th>
          <th className='w-[150px]'>Rp</th>
          <th className='w-[150px]'>K</th>
          <th className='w-[150px]'>Rp</th>
          <th className='w-[150px]'>K</th>
          <th className='w-[150px]'>Rp</th>
        </tr>
      </>
    );
  };
  //#endregion

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
      <div className='flex gap-2 justify-between'>
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
        <div className='flex justify-end items-end gap-2'>
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
        columns={columns || []}
        renderHeader={tableHead}
        tblClassName={`${selectedSKPD && data && 'lg:min-w-[2500px]'}`}
        pesanDataKosong={
          <PesanSKPDTabel
            selectedSKPD={selectedSKPD}
            tahun={tahunKe}
            butuhTahun
          />
        }
      />
      <DialogModal
        widthLevel={7}
        title='Realisasi'
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
            console.log(data);
            // addMutation.mutate({
            //   mulai: Number(data.mulai),
            //   akhir: Number(data.akhir),
            //   status: data.status,
            // });
          }}
        >
          <div className='flex gap-2 justify-end'>
            <InputButton
              type='submit'
              className='btn btn-theme w-24'
              // isLoading={loadingMutation}
            >
              Simpan
            </InputButton>
          </div>
        </FormRealisasi>
      </DialogModal>
    </div>
  );
};

export default RKPD_RealisasiTable;
