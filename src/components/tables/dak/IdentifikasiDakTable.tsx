import { useState } from 'react';
import Tabel from '../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import DialogModal from '../../inputs/DialogModal';
import FormIdentifikasiDak from '../../forms/IdentifikasiDak/FormIdentifikasiDak';

const columns: ColumnDef<any>[] = [
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
      <>
        <AksiButton Icon={MdEdit} />
      </>
    ),
  },
];

const IdentifikasiDakTable = () => {
  const [openModal, setOpenModal] = useState(false);

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
