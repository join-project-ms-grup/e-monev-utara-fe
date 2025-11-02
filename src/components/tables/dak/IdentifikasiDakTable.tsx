import { useState } from 'react';
import Tabel from '../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import DialogModal from '../../inputs/DialogModal';
import FormIdentifikasiDak from '../../forms/IdentifikasiDak/FormIdentifikasiDak';

type DataRow = {
  skpd: string;
  program: string;
  paketDetail: string;
  anggaran: string;
};

const data: DataRow[] = [
  {
    skpd: 'Dana bantuan pengembangan program perpustakaan daerah (Dana bantuan pengembangan program perpustakaan daerah)',
    program:
      'PROGRAM PEMBINAAN PERPUSTAKAAN / Pembudayaan Gemar Membaca Tingkat Daerah Kabupaten/Kota / Pembangunan dan Pemeliharaan Sarana Perpustakaan di Tempat-Tempat Umum yang Menjadi Kewenangan Daerah Kabupaten/Kota',
    paketDetail: '1 Paket / Service Kendaraan (3 Unit)',
    anggaran: 'Rp. 15.000.000,-',
  },
];

const columns: ColumnDef<DataRow>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => `${row.index + 1}`,
  },
  {
    id: 'skpd',
    accessorKey: 'skpd',
    header: 'SKPD / Bidang DAK',
  },
  {
    id: 'program',
    accessorKey: 'program',
    header: 'Program / Kegiatan / Sub Kegiatan',
  },
  {
    id: 'paketDetail',
    accessorKey: 'paketDetail',
    header: 'Paket / Detail (Volume Satuan)',
  },
  {
    id: 'anggaran',
    accessorKey: 'anggaran',
    header: 'Anggaran DAK',
  },
  {
    id: 'aksi',
    header: 'Aksi',
    cell: () => (
      //   <button className='px-2 py-1 bg-blue-500 text-white rounded'>Edit</button>
      <>
        <AksiButton Icon={MdEdit} />
      </>
    ),
  },
];

const IdentifikasiDakTable = () => {
  const [openModal, setOpenModal] = useState(false);

  const valTable = {
    tahun: '2025',
    tempat: 'Tempat 1',
    opd: 'OPD 1',
    subJenis: 'Sub-Jenis DAK 1',
  };
  // const [formTable, setFormTable] = useState(valTable);

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='tahun'>Tahun</label>
            <InputSearchBox
              id='tahun'
              className='w-38 h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Tahun'
              // value={formTable.tahun}
              // onChange={(val) =>
              //   setFormTable((prev) => ({ ...prev, tahun: val }))
              // }
              // options={[
              //   { label: '2026', value: '2026' },
              //   { label: '2025', value: '2025' },
              //   { label: '2024', value: '2024' },
              //   { label: '2023', value: '2023' },
              //   { label: '2022', value: '2022' },
              // ]}
            />
          </div>
          <div>
            <label htmlFor='tempat'>Kabupaten / Kota</label>
            <InputSearchBox
              id='tempat'
              className='w-44 h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Kabupaten / Kota'
              // value={formTable.tempat}
              // onChange={(e) => setFormTable((prev) => ({ ...prev, tempat: e }))}
              // options={[
              //   { label: 'Tempat 1', value: 'Tempat 1' },
              //   { label: 'Tempat 2', value: 'Tempat 2' },
              //   { label: 'Tempat 3', value: 'Tempat 3' },
              //   { label: 'Tempat 4', value: 'Tempat 4' },
              // ]}
            />
          </div>
          <div>
            <label htmlFor='opd'>OPD</label>
            <InputSearchBox
              id='opd'
              className='w-44 h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih OPD'
              // value={formTable.opd}
              // onChange={(e) => setFormTable((prev) => ({ ...prev, opd: e }))}
              // options={[
              //   { label: 'OPD 1', value: 'OPD 1' },
              //   { label: 'OPD 2', value: 'OPD 2' },
              //   { label: 'OPD 3', value: 'OPD 3' },
              //   { label: 'OPD 4', value: 'OPD 4' },
              // ]}
            />
          </div>
          <div>
            <label htmlFor='subJenis'>Sub-Jenis DAK</label>
            <InputSearchBox
              id='subJenis'
              className='w-44 h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Sub-Jenis DAK'
              // value={formTable.subJenis}
              // onChange={(e) =>
              //   setFormTable((prev) => ({ ...prev, subJenis: e }))
              // }
              // options={[
              //   { label: 'Sub-Jenis DAK 1', value: 'Sub-Jenis DAK 1' },
              //   { label: 'Sub-Jenis DAK 2', value: 'Sub-Jenis DAK 2' },
              //   { label: 'Sub-Jenis DAK 3', value: 'Sub-Jenis DAK 3' },
              //   { label: 'Sub-Jenis DAK 4', value: 'Sub-Jenis DAK 4' },
              // ]}
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
          <InputButton
            tooltip='Tambah data'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <MdAdd />
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
      <Tabel data={[]} columns={columns} />
      <DialogModal
        title='Tambah data Identifikasi DAK Kabupaten / Kota'
        widthLevel={10}
        isOpen={openModal}
        onClose={() => {
          // setFormData(initialFormData);
          setOpenModal(false);
        }}
      >
        <FormIdentifikasiDak />
      </DialogModal>
    </div>
  );
};

export default IdentifikasiDakTable;
