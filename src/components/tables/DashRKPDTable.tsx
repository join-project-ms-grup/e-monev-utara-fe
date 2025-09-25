import { fakeRKPDDashboardData } from '../../dummy/datafaker';
import Tabel from './Tabel';
import { createColumnHelper } from '@tanstack/react-table';
import RowExpand from './RowExpand';
import RowExpandValue from './RowExpandValue';

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
        columnHelper.accessor('persentase_kinerja', {
          id: 'persentase_kinerja',
          header: '(%)',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[10%]' },
        }),
        columnHelper.accessor('predikat_kinerja', {
          id: 'predikat_kinerja',
          header: 'Predikat',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[10%]' },
        }),
      ],
    }),
    columnHelper.group({
      id: 'capaiananggaran',
      header: 'Rata - Rata Capaian Anggaran',
      columns: [
        columnHelper.accessor('persentase_anggaran', {
          id: 'persentase_anggaran',
          header: '(%)',
          meta: { tdClassNames: 'text-center', thClassNames: 'w-[10%]' },
        }),
        columnHelper.accessor('predikat_anggaran', {
          id: 'predikat_anggaran',
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
          meta: { hidden: true},
        }),
      ],
    }),
  ];

  const subRows = (row: any) =>
    row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  return (
    <>
      <Tabel
        subRows={subRows}
        subLabels={['Program', 'Kegiatan', 'Sub Kegiatan']}
        subLabelPosition={6}
        data={dummy}
        columns={columns}
      />
    </>
  );
};

export default DashRKPDTable;
