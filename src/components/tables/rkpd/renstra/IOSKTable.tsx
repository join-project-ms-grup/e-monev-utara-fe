import type { ColumnDef, Table } from '@tanstack/react-table';
import Tabel from '../../Tabel';
import React, { useState } from 'react';
import { MdCloudSync, MdEdit, MdRefresh } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox from '../../../inputs/InputSearchBox';

type DataRow = {
  id: number;
  kode: string;
  ubp: string;
  indikator: string;
  jenisSatuan: string;
  kondisiAwal: string;
  target: Record<string, { target: string; rp: string }>;
  kondisiAkhir: { target: string; rp: string };
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
    target: {
      '2022': {
        target: '71,70; 96,29; 82,59; 46,20; 69,36; 65,06; 7,05; %',
        rp: '68.945.785.000',
      },
      '2023': {
        target: '71,84; 96,35; 82,65; 50,00; 72,62; 69,31; 7,05; %',
        rp: '83.344.518.078',
      },
      '2024': {
        target: '71,98; 96,41; 82,71; 53.80; 75,88; 73,56; 7.05; %',
        rp: '87.109.686.138',
      },
      '2025': {
        target: '72,12; 96,47; 82,77; 72.12; 79,14; 77,81; 7,05; %',
        rp: '95.528.076.847',
      },
      '2026': {
        target: '72,60; 96,54; 82,84; 72,60; 82,40; 82,06; 7.05; %',
        rp: '101.129.761.431',
      },
    },
    kondisiAkhir: {
      target: '72,60; 96,54; 82,84; 72,60; 82,40; 82,06; 7.05; %',
      rp: '0',
    },
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
        header: '2022',
        columns: [
          {
            id: 'target2022',
            header: 'Target',
            cell: ({ row }) => row.original.target['2022'].target,
          },
          {
            id: 'rp2022',
            header: 'Rp',
            cell: ({ row }) => row.original.target['2022'].rp,
          },
        ],
      },
      {
        header: '2023',
        columns: [
          {
            id: 'target2023',
            header: 'Target',
            cell: ({ row }) => row.original.target['2023'].target,
          },
          {
            id: 'rp2023',
            header: 'Rp',
            cell: ({ row }) => row.original.target['2023'].rp,
          },
        ],
      },
      {
        header: '2024',
        columns: [
          {
            id: 'target2024',
            header: 'Target',
            cell: ({ row }) => row.original.target['2024'].target,
          },
          {
            id: 'rp2024',
            header: 'Rp',
            cell: ({ row }) => row.original.target['2024'].rp,
          },
        ],
      },
      {
        header: '2025',
        columns: [
          {
            id: 'target2025',
            header: 'Target',
            cell: ({ row }) => row.original.target['2025'].target,
          },
          {
            id: 'rp2025',
            header: 'Rp',
            cell: ({ row }) => row.original.target['2025'].rp,
          },
        ],
      },
      {
        header: '2026',
        columns: [
          {
            id: 'target2026',
            header: 'Target',
            cell: ({ row }) => row.original.target['2026'].target,
          },
          {
            id: 'rp2026',
            header: 'Rp',
            cell: ({ row }) => row.original.target['2026'].rp,
          },
        ],
      },
    ],
  },
  {
    header: 'Kondisi Kinerja pada akhir periode RPJM',
    columns: [
      {
        id: 'targetKA',
        header: 'Target',
        cell: ({ row }) => row.original.kondisiAkhir.target,
      },
      {
        id: 'rpKA',
        header: 'Rp',
        cell: ({ row }) => row.original.kondisiAkhir.rp,
      },
    ],
  },
  {
    id: 'aksi',
    header: 'Aksi',
    cell: () => (
      <button className='px-2 py-1 bg-blue-500 text-white rounded'>Edit</button>
    ),
  },
];

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3} colSpan={2}>
          Urusan / Bidang / Program Kerja
        </th>
        <th rowSpan={3}>Indikator Output Sub Kegiatan</th>
        <th rowSpan={3} className='w-[150px]'>
          Kondisi Kinerja pada awal periode RPJM
        </th>
        <th colSpan={10}>Target Kinerja tiap Tahun</th>
        <th colSpan={2}>Kondisi Kinerja pada akhir periode RPJM</th>
        <th rowSpan={3} className='w-[60px]'>
          Aksi
        </th>
      </tr>
      <tr>
        <th colSpan={2}>2022</th>
        <th colSpan={2}>2023</th>
        <th colSpan={2}>2024</th>
        <th colSpan={2}>2025</th>
        <th colSpan={2}>2026</th>
        <th colSpan={2}>Akhir</th>
      </tr>
      <tr>
        {Array.from({ length: 6 }).map((_, i) => (
          <React.Fragment key={i}>
            <th className='w-[120px]'>Target</th>
            <th className='w-[120px]'>Rp</th>
          </React.Fragment>
        ))}
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
        {Object.keys(row.original.target).map((tahun) => (
          <React.Fragment key={tahun}>
            <td className='text-left align-top'>
              {row.original.target[tahun]?.target}
            </td>
            <td className='text-left align-top'>
              {row.original.target[tahun]?.rp}
            </td>
          </React.Fragment>
        ))}
        <td className='text-left align-top'>
          {row.original.kondisiAkhir.target}
        </td>
        <td className='text-left align-top'>{row.original.kondisiAkhir.rp}</td>
        <td className='text-center align-top'>
          <button
            className='p-1 transition-all rounded-full hover:bg-cyan-400 hover:text-[var(--text-3)] active:scale-90'
            onClick={() => console.log(row.original.id)}
          >
            <MdEdit className='text-xl' />
          </button>
        </td>
      </tr>
    ))}
  </>
);

const IOSKTable = () => {
  const valTable = {
    tahun: '2025',
    tahap: 'Tahap 1',
    skpd: 'SKPD 1',
    bidang: 'Bidang 1',
    program: 'Program 1',
    subKegiatan: 'Sub Kegiatan 1',
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
            <label htmlFor='subKegiatan'>Sub Kegiatan</label>
            <InputSearchBox
              id='subKegiatan'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.subKegiatan}
              onChange={(e) =>
                setFormTable((prev) => ({ ...prev, subKegiatan: e }))
              }
              options={[
                { label: 'Sub Kegiatan 1', value: 'Sub Kegiatan 1' },
                { label: 'Sub Kegiatan 2', value: 'Sub Kegiatan 2' },
                { label: 'Sub Kegiatan 3', value: 'Sub Kegiatan 3' },
                { label: 'Sub Kegiatan 4', value: 'Sub Kegiatan 4' },
              ]}
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
          <InputButton
            tooltip='Sinkronisasi Data Tahunan'
            className='btn btn-theme w-9 h-9'
          >
            <MdCloudSync />
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
        tblClassName='md:min-w-[2600px]'
        data={data}
        columns={columns}
        renderHeader={tableHead}
        renderBody={(table) => tableBody({ table })}
      />
    </div>
  );
};

export default IOSKTable;
