import { useState } from 'react';
import Tabel from '../../Tabel';
import toast from 'react-hot-toast';
import { MdCheck, MdRefresh } from 'react-icons/md';
import { IoMdPricetag, IoMdPricetags } from 'react-icons/io';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox from '../../../inputs/InputSearchBox';
import { createColumnHelper } from '@tanstack/react-table';
import { fakeCapaianIku, fakeTaggingIku } from '../../../../dummy/datafaker';

const CapaianIKUTable = () => {
  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.display({
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: { thClassNames: 'w-[60px]', tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('sasaran', {
      id: 'sasaran',
      header: 'Sasaran',
      meta: { tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('iku', {
      id: 'iku',
      header: 'Indikator Kinerja Utama',
      meta: { tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('satuan', {
      id: 'satuan',
      header: 'Satuan',
      meta: { thClassNames: 'w-[100px]', tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('targetTahunan', {
      id: 'targetTahunan',
      header: 'Target Tahunan',
      meta: { thClassNames: 'w-[100px]', tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('triwulan', {
      id: 'triwulan',
      header: 'Triwulan',
      meta: { thClassNames: 'w-[150px]', tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('target', {
      id: 'target',
      header: 'Target',
      meta: { thClassNames: 'w-[100px]', tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('realisasi', {
      id: 'realisasi',
      header: 'Realisasi',
      meta: { thClassNames: 'w-[100px]', tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('capaian', {
      id: 'capaian',
      header: 'Capaian (%)',
      meta: { thClassNames: 'w-[100px]', tdClassNames: 'text-center' },
    }),
    columnHelper.accessor('keterangan', {
      id: 'keterangan',
      header: 'Keterangan',
      meta: { thClassNames: 'w-[100px]', tdClassNames: 'text-center' },
    }),
    columnHelper.display({
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <div className='inline-flex gap-1'>
            <button
              data-tooltip-id='tooltip'
              data-tooltip-content='Input Target Triwulan'
              className='p-1 transition-all rounded-full hover:bg-cyan-400 hover:text-[var(--text-3)] active:scale-90'
              onClick={() => console.log(row.original.id)}
            >
              <IoMdPricetag className='text-xl' />
            </button>
            <button
              data-tooltip-id='tooltip'
              data-tooltip-content='Input Realisasi'
              className='p-1 transition-all rounded-full hover:bg-amber-400 hover:text-[var(--text-3)] active:scale-90'
              onClick={() => console.log(row.original.id)}
            >
              <IoMdPricetags className='text-xl' />
            </button>
          </div>
        </>
      ),
      meta: {
        thClassNames: 'w-[60px]',
        tdClassNames: 'text-center',
      },
    }),
  ];

  const [tahun, setTahun] = useState('2025');
  const [perangkat, setPerangkat] = useState('Perangkat Dua');
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
            <label htmlFor='perangkat'>Perangkat Daerah</label>
            <InputSearchBox
              id='perangkat'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={perangkat}
              onChange={(e) => setPerangkat(e)}
              options={[
                { label: 'Perangkat Satu', value: 'Perangkat Satu' },
                { label: 'Perangkat Dua', value: 'Perangkat Dua' },
                { label: 'Perangkat Tiga', value: 'Perangkat Tiga' },
                { label: 'Perangkat Empat', value: 'Perangkat Empat' },
                { label: 'Perangkat Lima', value: 'Perangkat Lima' },
              ]}
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
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
      <Tabel data={fakeCapaianIku} columns={columns} />
    </div>
  );
};

export default CapaianIKUTable;
