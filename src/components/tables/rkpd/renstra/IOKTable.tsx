import type { ColumnDef, Table } from '@tanstack/react-table';
import Tabel from '../../Tabel';
import { useState } from 'react';
import { MdRefresh } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox from '../../../inputs/InputSearchBox';

type DataRow = {
  id: number;
  kode: string;
  ubp: string;
  indikator: string;
  jenisSatuan: string;
  kondisiAwal: string;
  '2022': string;
  '2023': string;
  '2024': string;
  '2025': string;
  '2026': string;
  akhir: string;
};

const data: DataRow[] = [
  {
    id: 1,
    kode: '1.01.02',
    ubp: 'PROGRAM PENGELOLAAN PENDIDIKAN',
    indikator:
      '1. APM PAUD (%); 2. APM SD (%); 3. APM SMP (%); 4. Akreditasi Sekolah PAUD Minimal B (%); 5. Akreditasi Sekolah SD Minimal B (%); 6. Akreditasi Sekolah SMP Minimal B (%); 7. Angka Buta Aksara;',
    jenisSatuan: 'Akumulatif',
    kondisiAwal: '71,70; 96,29; 82,59; 46,20; 69,36; 65,06; 7,05; %',
    '2022': '72,60; 96,54; 82,84; 72,60; 82,40; 82,06; 7.05; %',
    '2023': '71,84; 96,35; 82,65; 50,00; 72,62; 69,31; 7,05; %',
    '2024': '71,98; 96,41; 82,71; 53.80; 75,88; 73,56; 7.05; %',
    '2025': '72,12; 96,47; 82,77; 72.12; 79,14; 77,81; 7,05; %',
    '2026': '72,60; 96,54; 82,84; 72,60; 82,40; 82,06; 7.05; %',
    akhir: '72,60; 96,54; 82,84; 72,60; 82,40; 82,06; 7.05; %',
  },
];

const columns: ColumnDef<DataRow>[] = [
  {
    id: 'id',
    accessorKey: 'id',
  },
  {
    id: 'ubp',
    accessorKey: 'ubp',
    header: 'Urusan / Bidang / Program Kerja',
  },
  {
    id: 'indikator',
    accessorKey: 'indikator',
    header: 'Indikator Outcome Program',
  },
  {
    id: 'kondisiAwal',
    accessorKey: 'kondisiAwal',
    header: 'Kondisi Kinerja pada awal periode RPJM',
  },
  {
    header: 'Target Kinerja tiap Tahun',
    columns: [
      {
        id: '2022',
        accessorKey: '2022',
        header: '2022',
      },
      {
        id: '2023',
        accessorKey: '2023',
        header: '2023',
      },
      {
        id: '2024',
        accessorKey: '2024',
        header: '2024',
      },
      {
        id: '2025',
        accessorKey: '2025',
        header: '2025',
      },
      {
        id: '2026',
        accessorKey: '2026',
        header: '2026',
      },
    ],
  },
  {
    id: 'akhir',
    accessorKey: 'akhir',
    header: 'Kondisi Kinerja pada akhir periode RPJM',
  },
];

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3} colSpan={2}>
          Urusan / Bidang / Program Kerja
        </th>
        <th rowSpan={3}>Indikator Output Kegiatan</th>
        <th rowSpan={3} className='w-[150px]'>
          Kondisi Kinerja pada awal periode RPJM
        </th>
        <th colSpan={5}>Target Kinerja tiap Tahun</th>
        <th rowSpan={2}>
          Kondisi Kinerja pada akhir periode RPJM
        </th>
      </tr>
      <tr>
        <th>2022</th>
        <th>2023</th>
        <th>2024</th>
        <th>2025</th>
        <th>2026</th>
      </tr>
    </>
  );
};

const tableBody = ({ table }: { table: Table<DataRow> }) => (
  <>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        <td className='text-left align-top'>{row.original.kode}</td>
        <td className='text-left align-top'>{row.original.ubp}</td>
        <td className='text-left align-top'>
          {row.original.indikator}{' '}
          <span className='bg-gray-800 text-[var(--text-3)] rounded-full px-2'>
            {row.original.jenisSatuan}
          </span>
        </td>
        <td className='text-left align-top'>{row.original.kondisiAwal}</td>
        <td className='text-left align-top'>{row.original[2022]}</td>
        <td className='text-left align-top'>{row.original[2023]}</td>
        <td className='text-left align-top'>{row.original[2024]}</td>
        <td className='text-left align-top'>{row.original[2025]}</td>
        <td className='text-left align-top'>{row.original[2026]}</td>
        <td className='text-left align-top'>{row.original.akhir}</td>
      </tr>
    ))}
  </>
);

const IOKTable = () => {
  const valTable = {
    tahun: '2025',
    tahap: 'Tahap 1',
    skpd: 'SKPD 1',
    bidang: 'Bidang 1',
    program: 'Program 1',
    kegiatan: 'Kegiatan 1',
  };
  const [formTable, setFormTable] = useState(valTable);

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='tahun'>Tahun</label>
            <InputSearchBox
              id='tahun'
              className='w-24 h-9'
              btnclassName='bg-white'
              value={formTable.tahun}
              onChange={(val) =>
                setFormTable((prev) => ({ ...prev, tahun: val }))
              }
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
            <label htmlFor='tahap'>Tahap</label>
            <InputSearchBox
              id='tahap'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.tahap}
              onChange={(e) => setFormTable((prev) => ({ ...prev, tahap: e }))}
              options={[
                { label: 'Tahap 1', value: 'Tahap 1' },
                { label: 'Tahap 2', value: 'Tahap 2' },
                { label: 'Tahap 3', value: 'Tahap 3' },
                { label: 'Tahap 4', value: 'Tahap 4' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='skpd'>SKPD</label>
            <InputSearchBox
              id='skpd'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.skpd}
              onChange={(e) => setFormTable((prev) => ({ ...prev, skpd: e }))}
              options={[
                { label: 'SKPD 1', value: 'SKPD 1' },
                { label: 'SKPD 2', value: 'SKPD 2' },
                { label: 'SKPD 3', value: 'SKPD 3' },
                { label: 'SKPD 4', value: 'SKPD 4' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='bidang'>Bidang</label>
            <InputSearchBox
              id='bidang'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.bidang}
              onChange={(e) => setFormTable((prev) => ({ ...prev, bidang: e }))}
              options={[
                { label: 'Bidang 1', value: 'Bidang 1' },
                { label: 'Bidang 2', value: 'Bidang 2' },
                { label: 'Bidang 3', value: 'Bidang 3' },
                { label: 'Bidang 4', value: 'Bidang 4' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='program'>Program</label>
            <InputSearchBox
              id='program'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.program}
              onChange={(e) =>
                setFormTable((prev) => ({ ...prev, program: e }))
              }
              options={[
                { label: 'Program 1', value: 'Program 1' },
                { label: 'Program 2', value: 'Program 2' },
                { label: 'Program 3', value: 'Program 3' },
                { label: 'Program 4', value: 'Program 4' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='kegiatan'>Kegiatan</label>
            <InputSearchBox
              id='kegiatan'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.kegiatan}
              onChange={(e) =>
                setFormTable((prev) => ({ ...prev, kegiatan: e }))
              }
              options={[
                { label: 'Kegiatan 1', value: 'Kegiatan 1' },
                { label: 'Kegiatan 2', value: 'Kegiatan 2' },
                { label: 'Kegiatan 3', value: 'Kegiatan 3' },
                { label: 'Kegiatan 4', value: 'Kegiatan 4' },
              ]}
            />
          </div>
        </div>
        <div className='flex justify-end items-end'>
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
        tblClassName='md:min-w-[2600px]'
        data={data}
        columns={columns}
        renderHeader={tableHead}
        renderBody={(table) => tableBody({ table })}
      />
    </div>
  );
};

export default IOKTable;
