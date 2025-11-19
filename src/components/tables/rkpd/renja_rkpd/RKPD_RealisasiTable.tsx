import { useEffect, useState } from 'react';
import { MdInput, MdRefresh } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { formatUang } from '../../../../lib/helper';
import {
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getPeriodeAkhirFromCookie,
  getUserSKPDID,
  isDev,
  isAdmin,
} from '../../../../lib/usercookie';
import {
  addAnggaranRKPD,
  type AddAnggaranRKPDForm,
  addCapaianRKPD,
  type AddCapaianRKPDForm,
  addPerhitunganRKPD,
  flatRealisasi,
  type FlatRealisasiRKPD,
  getRealisasiRKPD,
  type PerhitunganRenstraRKPDForm,
  type RealisasiFormRKPD,
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
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../../lib/api';

const RKPD_RealisasiTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: RealisasiFormRKPD = {
    rekening_kode: '',
    rekening_name: '',
    indikator_name: '',
    id_pagu: 0,
    id_rincian: 0,
    target: 0,
    target_anggaran: 0,
    total_capaian: 0,
    total_anggaran: 0,
    persen_capaian: 0,
    persen_anggaran: 0,
    realisasi_1: 0,
    realisasi_2: 0,
    realisasi_3: 0,
    realisasi_4: 0,
    capaian_1: 0,
    capaian_2: 0,
    capaian_3: 0,
    capaian_4: 0,
  };

  const [formData, setFormData] = useState<RealisasiFormRKPD>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [openModal]);

  const idPeriodeCookie = Number(getPeriodeIDFromCookie());
  const [tahunKe, setTahunKe] = useState('');

  //#region SKPD
  const userSKPDID = getUserSKPDID();
  const [selectedSKPD, setSelectedSKPD] = useState(userSKPDID ?? '');
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
      header: 'Input',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ row }) => {
        if (row.original.level === 'sub_kegiatan') {
          const data = row.original;
          return (
            <>
              <AksiButton
                Icon={MdInput}
                className='hover:bg-[var(--color-2)]!'
                tooltip='Input Realisasi'
                onClick={() => {
                  setFormData({
                    rekening_kode: `${data.kode_urusan}.${data.kode_bidang}.${data.kode_program}.${data.kode_kegiatan}.${data.kode_subKegiatan}`,
                    rekening_name: data.rekening,
                    indikator_name: data.indikator_kinerja,
                    id_pagu: data.id_pagu,
                    id_rincian: data.id_rincian,
                    satuan: data.satuan,
                    target: data.target as number,
                    target_anggaran: data.target_anggaran as number,
                    persen_capaian: data.persen_capaian as number,
                    persen_anggaran: data.persen_realisasi as number,
                    total_capaian: data.total_capaian as number,
                    total_anggaran: data.total_realisasi as number,
                    realisasi_1: data.realisasi_triwulan_I as number,
                    realisasi_2: data.realisasi_triwulan_II as number,
                    realisasi_3: data.realisasi_triwulan_III as number,
                    realisasi_4: data.realisasi_triwulan_IV as number,
                    capaian_1: data.capaian_triwulan_I as number,
                    capaian_2: data.capaian_triwulan_II as number,
                    capaian_3: data.capaian_triwulan_III as number,
                    capaian_4: data.capaian_triwulan_IV as number,
                  });
                  setOpenModal(true);
                }}
              />
            </>
          );
        }
      },
    },
    {
      header: 'perhitungan',
      cell: ({ row }) => {
        const [localPer, setLocalPer] = useState(
          row.original.perhitungan ?? '',
        );

        if (!row.original.type) {
          return (
            <form
              id={`${row.index}`}
              onSubmit={(e) => {
                e.preventDefault();

                if (localPer) {
                  perhitunganMutation.mutate({
                    id_indikator: Number(row.original.id_indikator),
                    perhitungan: localPer,
                    type: row.original.level === 'program' ? 'outcome' : null,
                  });
                } else {
                  toast.error('Perhitungan belum dipilih');
                }
              }}
            >
              <div className='space-y-2'>
                <InputSearchBox
                  id='perhitungan'
                  placeholder='Perhitungan'
                  className='w-[150px]'
                  value={localPer}
                  options={[
                    { label: 'Akumulatif', value: 'akumulatif' },
                    { label: 'Negatif', value: 'negatif' },
                    { label: 'Tetap', value: 'tetap' },
                  ]}
                  onChange={(val) => setLocalPer(val)}
                  // onClear={() => setLocalPer('')}
                />
                <InputButton className='w-[150px] h-9' disabled={!localPer}>
                  Konfirmasi
                </InputButton>
              </div>
            </form>
          );
        }
      },
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
        return <>{getValue() ?? '0'}</>;
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
          <th rowSpan={2} className='w-[50px]'>
            Realisasi
          </th>
          <th rowSpan={2} className='w-[50px]'>
            Perhitungan
          </th>
          <th rowSpan={2} className='w-[150px]'>
            Satuan
          </th>
          <th colSpan={2}>Target</th>
          <th colSpan={2}>Total</th>
          <th colSpan={2}>(%)</th>
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

  //#region MUTASI
  const [loadingMutation, setLoadingMutation] = useState(false);
  const addCapaian = useMutation({
    mutationFn: async (payload: AddCapaianRKPDForm) => {
      setLoadingMutation(true);
      return addCapaianRKPD(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rkpd_list_renja'] });
      refetch();
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      console.error('Gagal menambahkan capaian:', error);
    },
    onSettled: () => {
      setOpenModal(false);
      setLoadingMutation(false);
    },
  });

  const addAnggaran = useMutation({
    mutationFn: async (payload: AddAnggaranRKPDForm) => {
      setLoadingMutation(true);
      return addAnggaranRKPD(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rkpd_list_renja'] });
      refetch();
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      console.error('Gagal menambahkan anggaran:', error);
    },
    onSettled: () => {
      setOpenModal(false);
      setLoadingMutation(false);
    },
  });

  const perhitunganMutation = useMutation({
    mutationFn: async (payload: PerhitunganRenstraRKPDForm) => {
      setLoadingMutation(true);
      return addPerhitunganRKPD(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rkpd_list_renja'] });
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

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          {(isDev() || isAdmin()) && (
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
          )}
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
            selectedSKPD={selectedSKPD.toString()}
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
          setOpenModal(false);
          const timeout = setTimeout(() => {
            setFormData(initialFormData);
          }, 200);
          return () => {
            clearTimeout(timeout);
          };
        }}
      >
        <FormRealisasi
          defaultValues={formData}
          onSubmit={async (data: RealisasiFormRKPD) => {
            console.log('Data dari form modal:', data);

            try {
              let hasMutation = false;
              setLoadingMutation(true);

              await addAnggaran.mutateAsync({
                id_pagu: Number(data.id_pagu),
                realisasi: [
                  { triwulan: 1, realisasi: Number(data.realisasi_1) },
                  { triwulan: 2, realisasi: Number(data.realisasi_2) },
                  { triwulan: 3, realisasi: Number(data.realisasi_3) },
                  { triwulan: 4, realisasi: Number(data.realisasi_4) },
                ],
              });
              await addCapaian.mutateAsync({
                id_rincian: Number(data.id_rincian),
                capaian: [
                  { triwulan: 1, capaian: Number(data.capaian_1) },
                  { triwulan: 2, capaian: Number(data.capaian_2) },
                  { triwulan: 3, capaian: Number(data.capaian_3) },
                  { triwulan: 4, capaian: Number(data.capaian_4) },
                ],
              });

              // if (data.id_pagu) {
              //   hasMutation = true;
              //   await addAnggaran.mutateAsync({
              //     id_pagu: Number(data.id_pagu),
              //     realisasi: [
              //       { triwulan: 1, realisasi: Number(data.realisasi_1) },
              //       { triwulan: 2, realisasi: Number(data.realisasi_2) },
              //       { triwulan: 3, realisasi: Number(data.realisasi_3) },
              //       { triwulan: 4, realisasi: Number(data.realisasi_4) },
              //     ],
              //   });
              // }

              // if (data.id_rincian) {
              //   hasMutation = true;
              //   await addCapaian.mutateAsync({
              //     id_rincian: Number(data.id_rincian),
              //     capaian: [
              //       { triwulan: 1, capaian: Number(data.capaian_1) },
              //       { triwulan: 2, capaian: Number(data.capaian_2) },
              //       { triwulan: 3, capaian: Number(data.capaian_3) },
              //       { triwulan: 4, capaian: Number(data.capaian_4) },
              //     ],
              //   });
              // }

              if (hasMutation) toast.success('Data berhasil ditambahkan');
            } catch (err) {
              const error = err as AxiosError<ApiResponse<unknown>>;
              if (error.status === 400) {
                toast.error(
                  `Gagal menambahkan data\n${error.response?.data.message}`,
                );
              } else {
                toast.error('Terjadi kesalahan saat menyimpan data');
              }
            } finally {
              setOpenModal(false);
              setLoadingMutation(false);
            }
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

export default RKPD_RealisasiTable;
