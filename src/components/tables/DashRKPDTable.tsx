import Tabel from './Tabel';
import { type ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { MdPrint, MdRefresh } from 'react-icons/md';
import InputButton from '../inputs/InputButton';
import { exportRankingRKPD } from '../../services/ExcelService';
import InputSearchBox from '../inputs/InputSearchBox';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeMulaiFromCookie,
  getPeriodeAkhirFromCookie,
} from '../../lib/usercookie';
import { getSKPD } from '../../services/SKPDService';
import Spinner from '../inputs/Spinner';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2}>Ranking</th>
        <th rowSpan={2}>Perangkat Daerah</th>
        <th colSpan={2}>Rata - Rata Capaian Kinerja</th>
        <th colSpan={2}>Rata - Rata Capaian Anggaran</th>
        <th rowSpan={2}>Realisasi Anggaran</th>
      </tr>
      <tr>
        <th>(%)</th>
        <th>Predikat</th>
        <th>(%)</th>
        <th>Predikat</th>
      </tr>
    </>
  );
};

const DashRKPDTable = () => {
  //#region SKPD dan Tahun ke
  const [tahunKe, setTahunKe] = useState('');
  const {
    data: dataSKPD,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['list_skpd'],
    queryFn: async () => getSKPD(),
  });
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
  const [triwulan, setTriwulan] = useState('');

  const columns: ColumnDef<any>[] = [
    {
      header: 'Ranking',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => '-',
    },
    {
      header: 'Perangkat Daerah',
      accessorKey: 'name',
    },
    {
      header: 'Rata - Rata Capaian Kinerja',
      columns: [
        {
          id: 'rCKPersen',
          header: '(%)',
          meta: {
            tdClassNames: 'text-center',
          },
          cell: () => '-',
        },
        {
          id: 'rCKPredikat',
          header: 'Predikat',
          meta: {
            tdClassNames: 'text-center',
          },
          cell: () => '-',
        },
      ],
    },
    {
      header: 'Rata - Rata Capaian Anggaran',
      columns: [
        {
          id: 'rCAPersen',
          header: '(%)',
          meta: {
            tdClassNames: 'text-center',
          },
          cell: () => '-',
        },
        {
          id: 'rCAPredikat',
          header: 'Predikat',
          meta: {
            tdClassNames: 'text-center',
          },
          cell: () => '-',
        },
      ],
    },
    {
      header: 'Realisasi Anggaran',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: () => '-',
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
        </div>
      </div>
      <Tabel data={dataSKPD || []} columns={columns} renderHeader={tableHead} />
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
