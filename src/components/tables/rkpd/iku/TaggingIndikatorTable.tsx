import { useState } from 'react';
import Tabel from '../../Tabel';
import toast from 'react-hot-toast';
import { MdCheck, MdPrint, MdRefresh } from 'react-icons/md';
import { IoMdPricetag } from "react-icons/io";
import InputButton from '../../../inputs/InputButton';
import InputSearchBox from '../../../inputs/InputSearchBox';
import { createColumnHelper } from '@tanstack/react-table';
import { fakeTaggingIku } from '../../../../dummy/datafaker';

const TaggingIndikatorTable = () => {
  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.group({
      header: 'No',
      meta: { rowSpan: 2, thClassNames: 'w-[60px]' },
      columns: [
        columnHelper.display({
          header: ' ',
          cell: ({ row }) => `${row.index + 1}`,
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'iku',
      header: 'Indikator Kinerja Utama',
      meta: { rowSpan: 2 },
      columns: [
        columnHelper.accessor('iku', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'level',
      header: 'Level Dalam RPJMD',
      meta: { rowSpan: 2, thClassNames: 'w-[100px]' },
      columns: [
        columnHelper.accessor('level', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'satuan',
      header: 'Satuan',
      meta: { rowSpan: 2, thClassNames: 'w-[100px]' },
      columns: [
        columnHelper.accessor('satuan', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'kondisiAwal',
      header: 'Kondisi Kinerja Awal periode RPJMD',
      meta: { rowSpan: 2, thClassNames: 'w-[200px]' },
      columns: [
        columnHelper.accessor('kondisiAwal', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'target',
      header: 'Target Capaian Setiap Tahun',
      columns: [
        columnHelper.accessor('2022', {
          id: '2022',
          header: '2022',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[200px]' },
        }),
        columnHelper.accessor('2023', {
          id: '2023',
          header: '2023',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[200px]' },
        }),
        columnHelper.accessor('2024', {
          id: '2024',
          header: '2024',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[200px]' },
        }),
        columnHelper.accessor('2025', {
          id: '2025',
          header: '2025',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[200px]' },
        }),
        columnHelper.accessor('2026', {
          id: '2026',
          header: '2026',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[200px]' },
        }),
      ],
    }),
    columnHelper.group({
      header: 'Tag IKU',
      meta: { rowSpan: 2, thClassNames: 'w-[60px]' },
      columns: [
        columnHelper.display({
          header: ' ',
          enableSorting: false,
          cell: ({ row }) => (
            <>
              <div className='inline-flex gap-1'>
                <button
                  className='p-1 transition-all rounded-full hover:bg-cyan-400 hover:text-[var(--text-3)] active:scale-90'
                  onClick={() => console.log(row.original.id)}
                >
                  <MdCheck className='text-xl' />
                </button>
              </div>
            </>
          ),
          meta: {
            hidden: true,
            tdClassNames: 'text-center',
          },
        }),
      ],
    }),
  ];

  const [perangkat, setPerangkat] = useState('Perangkat Dua');
  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
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
            tooltip='Tag semua data sebagai IKU'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              toast.success('Tagging...');
            }}
          >
            <IoMdPricetag />
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
      <Tabel tblClassName='md:min-w-[2000px]' data={fakeTaggingIku} columns={columns} />
    </div>
  );
};

export default TaggingIndikatorTable;
