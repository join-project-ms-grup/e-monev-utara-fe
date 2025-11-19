import { useState } from 'react';
import { MdRefresh } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { formatRibu, formatUang } from '../../../../lib/helper';
import {
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getPeriodeAkhirFromCookie,
  getUserSKPDID,
  isDev,
  isAdmin,
} from '../../../../lib/usercookie';
import {
  addAnggaranRENSTRA,
  addCapaianRENSTRA,
  addPerhitunganRENSTRA,
  flatRealisasiRENSTRA,
  getRealisasiRENSTRA,
  type AnggaranRenstraForm,
  type CapaianRenstraForm,
  type FlatRealisasiRENSTRA,
  type PerhitunganRenstraRKPDForm,
} from '../../../../services/RealisasiService';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import Spinner from '../../../inputs/Spinner';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import Tabel from '../../Tabel';
import { getSKPDPerRENSTRA } from '../../../../services/PeriodeService';
import InputText from '../../../inputs/InputText';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../../lib/api';

const RENSTRA_RealisasiTable = () => {
  const queryClient = useQueryClient();
  const idPeriodeCookie = Number(getPeriodeIDFromCookie());
  const [tahunKe, setTahunKe] = useState('');

  //#region SKPD
  const userSKPDID = getUserSKPDID();
  const [selectedSKPD, setSelectedSKPD] = useState(userSKPDID ?? '');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_renstra_skpd_periode'],
    queryFn: async () => {
      const data = await getSKPDPerRENSTRA(idPeriodeCookie);
      return data;
    },
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  //#region Data
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['renstra_list_renja', tahunKe, selectedSKPD],
    queryFn: async () => {
      const rawData = await getRealisasiRENSTRA({
        skpd_periode_id: Number(selectedSKPD),
        tahun_ke: Number(tahunKe),
      });
      const flatData = flatRealisasiRENSTRA(rawData);
      console.log(flatData);
      
      return flatData;
    },
    enabled: !!(selectedSKPD && tahunKe),
  });
  //#endregion

  const [paguValues, setPaguValues] = useState<Record<number, string>>({});

  const handleChange = (rowId: number, val: string) => {
    setPaguValues((prev) => ({
      ...prev,
      [rowId]: val,
    }));
  };

  //#region MUTASI
  const [loadingMutation, setLoadingMutation] = useState(false);
  const capaianMutation = useMutation({
    mutationFn: async (payload: CapaianRenstraForm) => {
      setLoadingMutation(true);
      return addCapaianRENSTRA(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra_list_renja'] });
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
  const anggaranMutation = useMutation({
    mutationFn: async (payload: AnggaranRenstraForm) => {
      setLoadingMutation(true);
      return addAnggaranRENSTRA(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra_list_renja'] });
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
  const perhitunganMutation = useMutation({
    mutationFn: async (payload: PerhitunganRenstraRKPDForm) => {
      setLoadingMutation(true);
      return addPerhitunganRENSTRA(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renstra_list_renja'] });
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
  const columns: ColumnDef<FlatRealisasiRENSTRA>[] = [
    {
      accessorKey: 'kode',
    },
    {
      header: 'Nama',
      meta: {
        tdClassNames: 'whitespace-break-spaces',
      },
      accessorFn: (row) =>
        (row.nama ?? '') +
        '\n' +
        (row.outcome_name ? `(${row.outcome_name})` : ''),
    },
    {
      accessorKey: 'indikator_name',
    },
    {
      header: 'perhitungan',
      cell: ({ row }) => {
        const [localPer, setLocalPer] = useState(row.original.perhitungan ?? '');

        if (row.original.type === 'subkegiatan') {
          return (
            <form
              id={`${row.index}`}
              onSubmit={(e) => {
                e.preventDefault();

                if (localPer) {
                  perhitunganMutation.mutate({
                    id_indikator: Number(row.original.indikator_id),
                    perhitungan: localPer,
                    type: row.original.type === 'program' ? 'outcome' : null,
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
      accessorKey: 'indikator_satuan',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      header: 'Target_K',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.target_capaian_o_target ?? row.target_capaian_i_target,
    },
    {
      accessorKey: 'pagu_target',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ row, getValue }) => {
        if (row.original.type !== 'urusan' && row.original.type !== 'bidang') {
          if (!getValue()) {
            return '-';
          } else {
            return formatUang(Number(getValue()));
          }
        }
      },
    },
    {
      accessorKey: 'target_capaian_i_capaian',
      cell: ({ row, getValue }) => {
        if (!row.original.target_capaian_i_id) return null;
        const rincianId = row.original.target_capaian_i_id;
        const [value, setValue] = useState(getValue() as string);

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          capaianMutation.mutate({
            id_rincian: rincianId,
            capaian: Number(value),
          });
        };
        if (row.original.type === 'subkegiatan') {
          return (
            <>
              <form onSubmit={handleSubmit}>
                <InputText
                  id={`id_rincian${row.original.target_capaian_i_id}`}
                  inputMode='numeric'
                  type='text'
                  placeholder='0'
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  withButton={!!(value !== getValue())}
                  buttonType='submit'
                  isRibu
                  tooltip={formatRibu(Number(value))}
                />
              </form>
            </>
          );
        }
      },
    },
    {
      accessorKey: 'pagu_realisasi',
      cell: ({ row, getValue }) => {
        if (!row.original.pagu_id) return null;
        const paguId = row.original.pagu_id;
        const [value, setValue] = useState(getValue() as string);

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          anggaranMutation.mutate({
            id_pagu: paguId,
            realisasi: Number(value),
          });
        };
        if (row.original.type === 'subkegiatan') {
          return (
            <>
              <form onSubmit={handleSubmit}>
                <InputText
                  id={`id_pagu_${row.original.pagu_id}`}
                  inputMode='numeric'
                  type='text'
                  placeholder='0'
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  withButton={!!(value !== getValue())}
                  buttonType='submit'
                  isRibu
                  Iconlabel='Rp.'
                  tooltip={formatUang(Number(value))}
                />
              </form>
            </>
          );
        }
      },
    },
    {
      header: 'Persen_K',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.target_capaian_o_persen ?? row.target_capaian_i_persen,
    },
    {
      accessorKey: 'pagu_persen_realisasi',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ row, getValue }) => {
        if (row.original.type !== 'urusan' && row.original.type !== 'bidang') {
          if (!getValue()) {
            return '-';
          } else {
            return (getValue() as number).toFixed(2) + ' %';
          }
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
            Perhitungan
          </th>
          <th rowSpan={2} className='w-[150px]'>
            Satuan
          </th>
          <th colSpan={2}>Target</th>
          <th colSpan={2}>Realisasi</th>
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
    </div>
  );
};

export default RENSTRA_RealisasiTable;
