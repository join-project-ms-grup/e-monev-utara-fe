import Tabel from '../Tabel';
import { MdInfo, MdRefresh } from 'react-icons/md';
import { createColumnHelper } from '@tanstack/react-table';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import { useState } from 'react';

const RenjaTable = () => {
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.display({
      header: 'No',
      enableSorting: true,
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('kode', {
      header: 'Kode',
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('name', {
      header: 'Nama',
      meta: {
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('pagu', {
      header: 'Pagu',
      meta: {
        thClassNames: 'w-[15%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('waktu', {
      header: 'Waktu Pelaksanaan',
      meta: {
        thClassNames: 'w-[15%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.display({
      header: 'Detail',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <div className='inline-flex gap-1'>
            <button
              className='p-1 transition-all rounded-full hover:bg-cyan-400 hover:text-[var(--text-3)] active:scale-90'
              onClick={() => console.log(row.original.id)}
            >
              <MdInfo className='text-xl' />
            </button>
          </div>
        </>
      ),
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
  ];

  const valTable = {
    tahun: '2025',
    jadwal: 'Jadwal 1',
    skpd: 'SKPD 1',
    bidang: 'Bidang 1',
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
            <label htmlFor='jadwal'>Jadwal</label>
            <InputSearchBox
              id='jadwal'
              className='w-44 h-9'
              btnclassName='bg-white'
              value={formTable.jadwal}
              onChange={(e) => setFormTable((prev) => ({ ...prev, jadwal: e }))}
              options={[
                { label: 'Jadwal 1', value: 'Jadwal 1' },
                { label: 'Jadwal 2', value: 'Jadwal 2' },
                { label: 'Jadwal 3', value: 'Jadwal 3' },
                { label: 'Jadwal 4', value: 'Jadwal 4' },
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
      <Tabel data={[]} columns={columns} />
    </div>
  );
};

export default RenjaTable;
