import { useQuery } from '@tanstack/react-query';
import { getOPDDAK } from '../../services/DAK/DAKOPDService';
import Tabel from './Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import InputSearchBox from '../inputs/InputSearchBox';
import { useEffect, useState } from 'react';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3}>
          <big>Ranking</big>
        </th>
        <th rowSpan={3}>
          <big>Nama SKPD</big>
        </th>
        <th rowSpan={3}>
          <big>
            Jumlah
            <br />
            Paket
          </big>
        </th>
        <th rowSpan={3}>
          <big>
            Jumlah
            <br />
            Anggaran
            <br />
            (Rp.)
          </big>
        </th>
        <th colSpan={5}>
          <big>Realisasi (%)</big>
        </th>
      </tr>
      <tr>
        <th colSpan={2}>
          <big>DAK Fisik</big>
        </th>
        <th colSpan={2}>
          <big>DAK Non-Fisik</big>
        </th>
        <th rowSpan={2}>
          <big>
            Persentase
            <br />
            Rata-Rata
          </big>
        </th>
      </tr>
      <tr>
        <th>
          <big>Fisik</big>
        </th>
        <th>
          <big>Keuangan</big>
        </th>
        <th>
          <big>Fisik</big>
        </th>
        <th>
          <big>Keuangan</big>
        </th>
      </tr>
    </>
  );
};

const DashDAKTable = () => {

  const [triwulan, setTriwulan] = useState('1');
  const [tahunKe, setTahunKe] = useState('1');
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const { data } = useQuery({
    queryKey: ['list_opd_dak'],
    queryFn: getOPDDAK,
  });
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

  const columns: ColumnDef<any>[] = [
    {
      header: 'Ranking',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
    {
      accessorKey: 'fullname',
    },
    {
      header: 'Paket',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
    {
      header: 'Jumlah Anggaran',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
    {
      header: 'DAK Fisik Fisik',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
    {
      header: 'Dak Fisik Keuangan',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
    {
      header: 'DAK Non Fisik Fisik',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
    {
      header: 'Dak Non Fisik Keuangan',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
    {
      header: 'Persentase',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => `-`,
    },
  ];

  const now = new Date();

  const defaultValue = {
    tahun: now.getFullYear().toString(),
    triwulan: Math.ceil((now.getMonth() + 1) / 3),
  };


  useEffect(() => {
    const tahunNow = listTahunKe.find((e) => e.label = defaultValue.tahun)?.value.toString() ?? "1"
    setTahunKe(tahunNow);

    const twEval = defaultValue.triwulan - 1;
    setTriwulan(twEval.toString());
  }, []);

  return (
    <div className='space-y-2'>

      <h4 className='text-center'>
        Tabel Ranking Kinerja Kegiatan DAK per SKPD Kabupaten Bengkulu Utara
        {/* dari
        <br />
        Tertinggi ke sampai dengan Bulan November
        <br />
        Tahun Anggaran 2025 */}
      </h4>
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
      <div className='flex items-end justify-between'>
        {/* <div className='inline-flex gap-2'>
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
              onClear={() => {
                setTahunKe('');
                setTriwulan('');
              }}
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
              options={[
                { label: 'I', value: 'I' },
                { label: 'II', value: 'II' },
                { label: 'III', value: 'III' },
                { label: 'IV', value: 'IV' },
              ]}
              onClear={() => setTriwulan('')}
              disabled={!tahunKe}
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
          <InputButton
            tooltip='Print'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              toast.success('Printing...');
              exportRankingRKPD([], tahunMulai.toString());
            }}
          >
            <MdPrint />
          </InputButton>
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
          </InputButton>
        </div> */}
      </div>
      <Tabel data={data || []} columns={columns} renderHeader={tableHead} />
    </div>
  );
};

export default DashDAKTable;
