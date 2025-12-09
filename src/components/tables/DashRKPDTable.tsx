import Tabel from './Tabel';
import { type ColumnDef } from '@tanstack/react-table';
import InputSearchBox from '../inputs/InputSearchBox';
import { useState } from 'react';
import {
  getPeriodeMulaiFromCookie,
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
} from '../../lib/usercookie';
import { useGetDashRankRKPD } from '../../hooks/RKPD/TabelDataRkpd';
import type { DashboardRankingResult } from '../../services/DashRKPDService';
import InputButton from '../inputs/InputButton';
import { MdPrint } from 'react-icons/md';
import toast from 'react-hot-toast';
import { exportRanking } from '../../services/Excel/ExcelRanking';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3}>Ranking</th>
        <th rowSpan={3}>Perangkat Daerah</th>
        <th colSpan={4}>Rata - Rata Capaian Kinerja</th>
        <th colSpan={4}>Rata - Rata Capaian Anggaran</th>
        <th colSpan={2}>Realisasi Anggaran</th>
      </tr>
      <tr>
        <th colSpan={2}>Triwulan</th>
        <th colSpan={2}>s/d Triwulan</th>
        <th colSpan={2}>Triwulan</th>
        <th colSpan={2}>s/d Triwulan</th>
        <th>Triwulan</th>
        <th>s/d Triwulan</th>
      </tr>
      <tr>
        <th>(%)</th>
        <th>P</th>
        <th>(%)</th>
        <th>P</th>
        <th>(%)</th>
        <th>P</th>
        <th>(%)</th>
        <th>P</th>
        <th>Rp</th>
        <th>Rp</th>
      </tr>
    </>
  );
};

const DashRKPDTable = () => {
  //#region SKPD dan Tahun ke
  const periodeId = getPeriodeIDFromCookie();
  const [triwulan, setTriwulan] = useState('1');
  const [tahunKe, setTahunKe] = useState('1');
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${i + 1}`,
    }),
  );
  const listTriwulan = [
    { label: 'I', value: '1' },
    { label: 'II', value: '2' },
    { label: 'III', value: '3' },
    { label: 'IV', value: '4' },
  ];
  const { data } = useGetDashRankRKPD({
    periode_id: Number(periodeId),
    tahun_ke: Number(tahunKe),
    triwulan: Number(triwulan),
  });
  //#endregion

  const columns: ColumnDef<DashboardRankingResult>[] = [
    {
      header: 'Ranking',
      accessorKey: 'rangking',
      meta: {
        tdClassNames: 'text-center border-x border-gray-400',
      },
    },
    {
      header: 'Perangkat Daerah',
      accessorKey: 'name',
      meta: {
        tdClassNames: 'border-x border-gray-400',
      },
    },
    {
      header: 'rata_rata_kinerja',
      columns: [
        {
          header: 'rata_rata_kinerja_1',
          accessorFn: (row) => row.rata_rata_triwulan,
          cell: ({ getValue }) => {
            const { capaian } = getValue();
            return (
              <div className='text-center'>
                <span>{capaian}</span>
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-l border-gray-400',
          },
        },
        {
          header: 'rata_rata_kinerja_2',
          accessorFn: (row) => row.rata_rata_triwulan,
          cell: ({ getValue }) => {
            const { c_predikat } = getValue();
            return (
              <div className='text-center'>
                <code className='font-bold'>{c_predikat}</code>{' '}
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-r border-gray-400',
          },
        },
        {
          header: 'rata_rata_kinerja_3',
          accessorFn: (row) => row.rata_rata_kumulatif,
          cell: ({ getValue }) => {
            const { capaian } = getValue();
            return (
              <div className='text-center'>
                <span>{capaian}</span>
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-l  border-gray-400',
          },
        },
        {
          header: 'rata_rata_kinerja_4',
          accessorFn: (row) => row.rata_rata_kumulatif,
          cell: ({ getValue }) => {
            const { c_predikat } = getValue();
            return (
              <div className='text-center'>
                <code className='font-bold'>{c_predikat}</code>{' '}
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-r  border-gray-400',
          },
        },
      ],
    },
    {
      header: 'rata_rata_anggaran',
      columns: [
        {
          header: 'rata_rata_anggaran_1',
          accessorFn: (row) => row.rata_rata_triwulan,
          cell: ({ getValue }) => {
            const { realisasi } = getValue();
            return (
              <div className='text-center'>
                <span>{realisasi}</span>
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-l  border-gray-400',
          },
        },
        {
          header: 'rata_rata_anggaran_2',
          accessorFn: (row) => row.rata_rata_triwulan,
          cell: ({ getValue }) => {
            const { r_predikat } = getValue();
            return (
              <div className='text-center'>
                <code className='font-bold'>{r_predikat}</code>{' '}
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-r  border-gray-400',
          },
        },
        {
          header: 'rata_rata_angaran_3',
          accessorFn: (row) => row.rata_rata_kumulatif,
          cell: ({ getValue }) => {
            const { realisasi } = getValue();
            return (
              <div className='text-center'>
                <span>{realisasi}</span>
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-l  border-gray-400',
          },
        },
        {
          header: 'rata_rata_anggaran_4',
          accessorFn: (row) => row.rata_rata_kumulatif,
          cell: ({ getValue }) => {
            const { r_predikat } = getValue();
            return (
              <div className='text-center'>
                <code className='italic font-bold'>{r_predikat}</code>{' '}
              </div>
            );
          },
          meta: {
            tdClassNames: 'text-center border-r  border-gray-400',
          },
        },
      ],
    },
    {
      header: 'total_realisasi',
      columns: [
        {
          header: 'total_realisasi.triwulan',
          accessorFn: (row) => row.total_realisasi.triwulan,
          meta: {
            tdClassNames: 'text-center border-x  border-gray-400',
          },
        },
        {
          header: 'total_realisasi.kumulatif',
          accessorFn: (row) => row.total_realisasi.kumulatif,
          meta: {
            tdClassNames: 'text-center border-x  border-gray-400',
          },
        },
      ],
    },
  ];

  return (
    <>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='tahun_ke'>Tahun</label>
            <InputSearchBox
              id='tahun_ke'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Tahun...'
              value={tahunKe}
              options={listTahunKe}
              onChange={(val) => setTahunKe(val)}
            />
          </div>
          <div>
            <label htmlFor='triwulan'>s.d Triwulan</label>
            <InputSearchBox
              id='triwulan'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Triwulan...'
              value={triwulan}
              onChange={(e) => setTriwulan(e)}
              options={listTriwulan}
              disabled={!tahunKe}
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
          <InputButton
            tooltip='Cetak Ranking'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              if (data) {
                toast.promise(
                  exportRanking(
                    data.result,
                    listTahunKe.find((item) => item.value === tahunKe)?.label ??
                      '',
                    listTriwulan.find((item) => item.value === triwulan)
                      ?.label ?? '',
                  ),
                  {
                    loading: 'Sedang mengunduh, harap tunggu...',
                    success: <b>Berhasil mengunduh.</b>,
                    error: (err) => {
                      return <b>Gagal mengunduh.</b>;
                    },
                  },
                );
              }
            }}
          >
            <MdPrint />
          </InputButton>
        </div>
      </div>
      <Tabel
        data={data?.result || []}
        columns={columns}
        renderHeader={tableHead}
      />
      <div>
        <span>Keterangan Predikat:</span>
        <div className='grid grid-cols-[auto_1fr] space-x-2'>
          <p>ST</p>
          <p>SANGAT TINGGI {`(>90 dan <=100)`}</p>
          <p>T</p>
          <p>TINGGI {`(>75 dan <=90)`}</p>
          <p>S</p>
          <p>SEDANG {`(>65 dan <=75)`}</p>
          <p>R</p>
          <p>RENDAH {`(>50 dan <=65)`}</p>
          <p>SR</p>
          <p>SANGAT RENDAH {`(<=50)`}</p>
          <p>UNK</p>
          <p>UNKNOWN {`(<0 atau >100)`}</p>
        </div>
      </div>
    </>
  );
};

export default DashRKPDTable;
