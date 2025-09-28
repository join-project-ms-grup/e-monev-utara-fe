import { fakeRKPDDashboardData } from '../../dummy/datafaker';
import Tabel from './Tabel';
import { createColumnHelper } from '@tanstack/react-table';
import RowExpand from './RowExpand';
import RowExpandValue from './RowExpandValue';
import toast from 'react-hot-toast';
import { MdPrint, MdRefresh } from 'react-icons/md';
import InputButton from '../inputs/InputButton';
import { exportRankingRKPD } from '../../services/ExcelService';
import InputSearchBox from '../inputs/InputSearchBox';
import { useState } from 'react';

const dummy = fakeRKPDDashboardData;

const DashRKPDTable = () => {
  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.group({
      header: ' ',
      meta: { rowSpan: 2, thClassNames: 'w-[5%]' },
      columns: [
        columnHelper.display({
          header: ' ',
          meta: {
            hidden: true,
            tdClassNames: 'flex items-center justify-center',
          },
          cell: (ctx) => <RowExpand {...ctx} />,
        }),
      ],
    }),
    columnHelper.group({
      id: 'ranking',
      header: 'Ranking',
      meta: { rowSpan: 2, thClassNames: 'w-[5%]' },
      columns: [
        columnHelper.accessor('ranking', {
          id: 'ranking',
          header: 'Ranking',
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'perangkat',
      header: 'Perangkat Daerah',
      meta: { rowSpan: 2 },
      columns: [
        columnHelper.accessor('perangkat', {
          id: 'perangkat',
          header: 'Perangkat Daerah',
          meta: { hidden: true },
          cell: (ctx) => <RowExpandValue {...ctx} />,
        }),
      ],
    }),
    columnHelper.group({
      id: 'capaiankinerja',
      header: 'Rata - Rata Capaian Kinerja',
      columns: [
        columnHelper.accessor('persentaseKinerja', {
          id: 'persentaseKinerja',
          header: '(%)',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[10%]' },
        }),
        columnHelper.accessor('predikatKinerja', {
          id: 'predikatKinerja',
          header: 'Predikat',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[10%]' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'capaiananggaran',
      header: 'Rata - Rata Capaian Anggaran',
      columns: [
        columnHelper.accessor('persentaseAnggaran', {
          id: 'persentaseAnggaran',
          header: '(%)',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[10%]' },
        }),
        columnHelper.accessor('predikatAnggaran', {
          id: 'predikatAnggaran',
          header: 'Predikat',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[10%]' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'anggaran',
      header: 'Realisasi Anggaran',
      meta: { rowSpan: 2, thClassNames: 'w-[15%]' },
      columns: [
        columnHelper.accessor('anggaran', {
          id: 'anggaran',
          header: 'Realisasi Anggaran',
          cell: ({ getValue }) => {
            const formatter = new Intl.NumberFormat('id-ID');
            return `Rp. ${formatter.format(getValue())}`;
          },
          meta: { hidden: true },
        }),
      ],
    }),
  ];

  const subRows = (row: any) =>
    row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const [tahun, setTahun] = useState('2025');
  const [triwulan, setTriwulan] = useState('III');

  return (
    <>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='tahun'>Tahun</label>
            <InputSearchBox
              id='tahun'
              className='w-24 h-9'
              btnclassName='bg-white'
              value={tahun}
              onChange={(e) => setTahun(e)}
              options={[
                { label: '2026', value: '2026' },
                { label: '2025', value: '2025' },
                { label: '2024', value: '2024' },
                { label: '2023', value: '2023' },
                { label: '2022', value: '2022' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='triwulan'>s.d Triwulan</label>
            <InputSearchBox
              id='triwulan'
              className='w-24 h-9'
              btnclassName='bg-white'
              value={triwulan}
              onChange={(e) => setTriwulan(e)}
              options={[
                { label: 'I', value: 'I' },
                { label: 'II', value: 'II' },
                { label: 'III', value: 'III' },
                { label: 'IV', value: 'IV' },
              ]}
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
          <InputButton
            tooltip='Print'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              toast.success('Printing...');
              exportRankingRKPD([], '2025');
            }}
          >
            <MdPrint />
          </InputButton>
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            // onClick={() => refetch()}
            // disabled={isFetching}
          >
            {/* {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />} */}
            <MdRefresh />
          </InputButton>
        </div>
      </div>
      <Tabel
        subRows={subRows}
        subLabels={['Program', 'Kegiatan', 'Sub Kegiatan']}
        subLabelPosition={6}
        data={dummy}
        columns={columns}
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
