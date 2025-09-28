import { useState } from 'react';
import Tabel from '../Tabel';
import { MdClear, MdPrint, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import { createColumnHelper } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { fakeRealisasi } from '../../../dummy/datafaker';

const RealisasiTable = () => {
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
      id: 'sasaran',
      header: 'Sasaran',
      meta: { rowSpan: 2 },
      columns: [
        columnHelper.accessor('sasaran', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'kode',
      header: 'Kode',
      meta: { rowSpan: 2, thClassNames: 'w-[10%]' },
      columns: [
        columnHelper.accessor('kode', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'name',
      header: 'Perihal',
      meta: { rowSpan: 2, thClassNames: 'min-w-[300px]' },
      columns: [
        columnHelper.accessor('name', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'indikator',
      header: 'Indikator',
      meta: { rowSpan: 2, thClassNames: 'min-w-[300px]' },
      columns: [
        columnHelper.accessor('indikator', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
    columnHelper.group({
      header: 'Aksi',
      meta: { rowSpan: 2, thClassNames: 'w-[50px]' },
      columns: [
        columnHelper.display({
          header: 'Aksi',
          enableSorting: false,
          cell: ({ row }) => (
            <>
              <div className='inline-flex gap-1'>
                <button
                  className='p-1 transition-all rounded-full hover:bg-red-400 hover:text-[var(--text-3)] active:scale-90'
                  onClick={() => console.log(row.original.id)}
                >
                  <MdClear className='text-xl' />
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
    columnHelper.group({
      id: 'targetRenstra',
      header: 'Target Akhir Tahun RPJM/Renstra',
      columns: [
        columnHelper.accessor('trFisik', {
          id: 'trFisik',
          header: 'Fisik',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[150px]' },
        }),
        columnHelper.accessor('trRp', {
          id: 'trRp',
          header: 'Rp.',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[150px]' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'realisasiRenstra',
      header: 'Realisasi Kinerja RPJM/Renstra s.d Tahun sebelumnya',
      columns: [
        columnHelper.accessor('rrFisik', {
          id: 'rrFisik',
          header: 'Fisik',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[150px]' },
        }),
        columnHelper.accessor('rrRp', {
          id: 'rrRp',
          header: 'Rp.',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[150px]' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'targetKinerja',
      header: 'Target Kinerja Tahun yang dievaluasi',
      columns: [
        columnHelper.accessor('tkFisik', {
          id: 'tkFisik',
          header: 'Fisik',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[150px]' },
        }),
        columnHelper.accessor('tkRp', {
          id: 'tkRp',
          header: 'Rp.',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[150px]' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'penanggung',
      header: 'Perangkat Daerah Penanggung Jawab',
      meta: { rowSpan: 2, thClassNames: 'w-[250px]' },
      columns: [
        columnHelper.accessor('penanggung', {
          meta: { hidden: true, tdClassNames: 'text-center' },
        }),
      ],
    }),
  ];

  const valTable = {
    tahun: '2025',
    skpd: 'SKPD 1',
    bidang: 'Bidang 1',
    program: 'Program 1',
    triwulan: 'III',
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
        <div className='inline-flex gap-2'>
          <InputButton
            tooltip='Cetak Laporan 5 Tahunan'
            className='btn btn-theme w-14 h-9'
            onClick={() => {
              toast.success('Printing...');
            }}
          >
            <MdPrint />
            {`5`}
          </InputButton>
          <InputButton
            tooltip='Cetak Laporan Tahunan'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              toast.success('Printing...');
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
      <Tabel tblClassName='md:min-w-[2400px]' data={fakeRealisasi} columns={columns} />
    </div>
  );
};

export default RealisasiTable;
