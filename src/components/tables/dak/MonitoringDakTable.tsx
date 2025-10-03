import { useState } from 'react';
import Tabel from '../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import {
  MdAssignmentTurnedIn,
  MdContentPasteSearch,
  MdEdit,
  MdRefresh,
  MdSave,
} from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';

type DataRowKeys =
  | 'name'
  | 'pkVolume'
  | 'pkJumPenerima'
  | 'pkAnggaran'
  | 'mpMekKegiatan'
  | 'mpVolume'
  | 'mpUang'
  | 'reFTriwulan'
  | 'reFSD'
  | 'reKRP'
  | 'reKPersen'
  | 'sisaAnggaran'
  | 'kesesuaianRKPD'
  | 'kesesuaianJuknis'
  | 'kodefikasi'
  | 'masalahLain'
  | 'catatan'
  | 'skpdPelaksana'
  | 'kunciProses';

interface DataRow extends Record<DataRowKeys, string> {}
const data: DataRow[] = [
  {
    name: 'Pelayanan KB / Operasional Distribusi Alokon',
    pkVolume: '2 Paket',
    pkJumPenerima: '25 Faskes',
    pkAnggaran: '22.500.000',
    mpMekKegiatan: 'Swakelola',
    mpVolume: '50 Paket',
    mpUang: '22.500.000,-',
    reFTriwulan: '*Input field: 0,00',
    reFSD: '40,85 %',
    reKRP: '*Input field: 0',
    reKPersen: '0,00 %',
    sisaAnggaran: '13.309.000',
    kesesuaianRKPD: '*pilihan Ya / Tidak',
    kesesuaianJuknis: '*pilihan Ya / Tidak',
    kodefikasi: '',
    masalahLain: '',
    catatan: '*Textarea',
    skpdPelaksana: 'DPPKB',
    kunciProses: 'Terbuka (*atau Terkunci)',
  },
];

const columns: ColumnDef<DataRow>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => `${row.index + 1}`,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Jenis DAK / Bidang DAK / Nama Paket',
  },
  {
    header: 'Perencanaan Kegiatan',
    columns: [
      {
        id: 'skppkVolumed',
        accessorKey: 'pkVolume',
        header: 'Volume',
      },
      {
        id: 'pkJumPenerima',
        accessorKey: 'pkJumPenerima',
        header: 'Jumlah Penerima Manfaat',
      },
      {
        id: 'pkAnggaran',
        accessorKey: 'pkAnggaran',
        header: 'Anggaran DAK (Rp.)',
      },
    ],
  },
  {
    header: 'Mekanisme Pelaksana',
    columns: [
      {
        id: 'mpMekKegiatan',
        accessorKey: 'mpMekKegiatan',
        header: 'Mekanisme Kegiatan',
      },
      {
        id: 'mpVolume',
        accessorKey: 'mpVolume',
        header: 'Volume',
      },
      {
        id: 'mpUang',
        accessorKey: 'mpUang',
        header: 'Uang (Rp)',
      },
    ],
  },
  {
    header: 'Realisasi',
    columns: [
      {
        header: 'Fisik (%)',
        columns: [
          {
            id: 'reFTriwulan',
            accessorKey: 'reFTriwulan',
            header: 'Triwulan Ini',
          },
          {
            id: 'reFSD',
            accessorKey: 'reFSD',
            header: 's.d',
          },
        ],
      },
      {
        header: 'Keuangan',
        columns: [
          {
            id: 'reKRP',
            accessorKey: 'reKRP',
            header: 'Rp.',
          },
          {
            id: 'reKPersen',
            accessorKey: 'reKPersen',
            header: '%',
          },
        ],
      },
    ],
  },
  {
    id: 'sisaAnggaran',
    accessorKey: 'sisaAnggaran',
    header: 'Sisa Anggaran s.d Triwulan Ini',
  },
  {
    id: 'kesesuaianRKPD',
    accessorKey: 'kesesuaianRKPD',
    header: 'Kesesuaian Sasaran dan Lokasi dengan RKPD',
  },
  {
    id: 'kesesuaianJuknis',
    accessorKey: 'kesesuaianJuknis',
    header: 'Keseuaian antara DPA-SKPD dengan Juknis',
  },
  {
    id: 'kodefikasi',
    accessorKey: 'kodefikasi',
    header: 'Kodefikasi Masalah',
  },
  {
    id: 'masalahLain',
    accessorKey: 'masalahLain',
    header: 'Masalah Lain',
  },
  {
    id: 'catatan',
    accessorKey: 'catatan',
    header: 'Catatan',
  },
  {
    id: 'skpdPelaksana',
    accessorKey: 'skpdPelaksana',
    header: 'SKPD Pelaksana',
  },
  {
    id: 'kunciProses',
    accessorKey: 'kunciProses',
    header: 'Kunci Proses',
  },
  {
    id: 'aksi',
    header: 'Aksi / Keterangan',
    cell: () => (
      //   <button className='px-2 py-1 bg-blue-500 text-white rounded'>Edit</button>
      <div className='flex justify-center'>
        <AksiButton hoverColor='bg-red-400' tooltip='Identifikasi Masalah' Icon={MdContentPasteSearch} />
        <AksiButton hoverColor='bg-green-400' tooltip='Simpan Data' Icon={MdSave} />
        <AksiButton hoverColor='bg-amber-400' tooltip='Data Ditindak' Icon={MdAssignmentTurnedIn} />
      </div>
    ),
  },
];

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3}>No</th>
        <th rowSpan={3}>Jenis DAK / Bidang DAK / Nama Paket</th>
        <th colSpan={3}>Perencanaan Kegiatan</th>
        <th colSpan={3}>Mekanisme Pelaksana</th>
        <th colSpan={4}>Realisasi</th>
        <th rowSpan={3}>Sisa Anggaran s.d Triwulan Ini</th>
        <th rowSpan={3}>Kesesuaian Sasaran dan Lokasi dengan RKPD</th>
        <th rowSpan={3}>Keseuaian antara DPA-SKPD dengan Juknis</th>
        <th rowSpan={3}>Kodefikasi Masalah</th>
        <th rowSpan={3}>Masalah Lain</th>
        <th rowSpan={3}>Catatan</th>
        <th rowSpan={3}>SKPD Pelaksana</th>
        <th rowSpan={3}>Kunci Proses</th>
        <th rowSpan={3}>Aksi / Keterangan</th>
      </tr>
      <tr>
        <th rowSpan={2}>Volume</th>
        <th rowSpan={2}>Jumlah Penerima Manfaat</th>
        <th rowSpan={2}>Anggaran DAK {`(Rp.)`}</th>
        <th rowSpan={2}>Mekanisme Kegiatan</th>
        <th rowSpan={2}>Volume</th>
        <th rowSpan={2}>Uang {`(Rp.)`}</th>
        <th colSpan={2}>Fisik</th>
        <th colSpan={2}>Keuangan</th>
      </tr>
      <tr>
        <th>Triwulan Ini</th>
        <th>s.d</th>
        <th>Rp.</th>
        <th>%</th>
      </tr>
    </>
  );
};

const IdentifikasiDakTable = () => {
  const valTable = {
    tahun: '2025',
    tempat: 'Tempat 1',
    opd: 'OPD 1',
    subJenis: 'Sub-Jenis DAK 1',
    triwulan: 'IV',
  };
  const [formTable, setFormTable] = useState(valTable);

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
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
            <label htmlFor='tempat'>Kabupaten / Kota</label>
            <InputSearchBox
              id='tempat'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.tempat}
              onChange={(e) => setFormTable((prev) => ({ ...prev, tempat: e }))}
              options={[
                { label: 'Tempat 1', value: 'Tempat 1' },
                { label: 'Tempat 2', value: 'Tempat 2' },
                { label: 'Tempat 3', value: 'Tempat 3' },
                { label: 'Tempat 4', value: 'Tempat 4' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='opd'>OPD</label>
            <InputSearchBox
              id='opd'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.opd}
              onChange={(e) => setFormTable((prev) => ({ ...prev, opd: e }))}
              options={[
                { label: 'OPD 1', value: 'OPD 1' },
                { label: 'OPD 2', value: 'OPD 2' },
                { label: 'OPD 3', value: 'OPD 3' },
                { label: 'OPD 4', value: 'OPD 4' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='subJenis'>Sub-Jenis DAK</label>
            <InputSearchBox
              id='subJenis'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.subJenis}
              onChange={(e) =>
                setFormTable((prev) => ({ ...prev, subJenis: e }))
              }
              options={[
                { label: 'Sub-Jenis DAK 1', value: 'Sub-Jenis DAK 1' },
                { label: 'Sub-Jenis DAK 2', value: 'Sub-Jenis DAK 2' },
                { label: 'Sub-Jenis DAK 3', value: 'Sub-Jenis DAK 3' },
                { label: 'Sub-Jenis DAK 4', value: 'Sub-Jenis DAK 4' },
              ]}
            />
          </div>
          <div>
            <label htmlFor='triwulan'>Triwulan</label>
            <InputSearchBox
              id='triwulan'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.triwulan}
              onChange={(e) =>
                setFormTable((prev) => ({ ...prev, triwulan: e }))
              }
              options={[
                { label: 'I', value: 'I' },
                { label: 'II', value: 'II' },
                { label: 'III', value: 'III' },
                { label: 'IV', value: 'IV' },
              ]}
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
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
        tblClassName='md:min-w-[2800px]'
        data={data}
        columns={columns}
        renderHeader={tableHead}
      />
    </div>
  );
};

export default IdentifikasiDakTable;
