import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import type { FlatRPJMD } from '../../../../services/RPJMDService';
import { formatUang } from '../../../../lib/helper';

interface MainTableProps {
  data: FlatRPJMD[];
  skpd: string;
}

const RPJMDPreviewTable = ({ data, skpd }: MainTableProps) => {
  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2}>Program Prioritas</th>
          <th rowSpan={2}>Indikator Kinerja</th>
          <th rowSpan={2}>Data Capaian pada Awal Tahun Perencanaan</th>
          <th rowSpan={2} colSpan={2}>
            Target pada Akhir Tahun Perencanaan
          </th>
          <th rowSpan={1} colSpan={10}>
            Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-
          </th>
          <th rowSpan={1} colSpan={10}>
            Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun
            Ke-
          </th>
          <th rowSpan={1} colSpan={10}>
            Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD
            Kabupaten/kotaTahun Ke-
            <br />
            (%)
          </th>
          <th rowSpan={2} colSpan={2}>
            Rasio Capaian Akhir (%)
          </th>
        </tr>
        <tr>
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <th colSpan={2}>1</th>
              <th colSpan={2}>2</th>
              <th colSpan={2}>3</th>
              <th colSpan={2}>4</th>
              <th colSpan={2}>5</th>
            </React.Fragment>
          ))}
        </tr>
        <tr>
          <th rowSpan={2}>(1)</th>
          <th rowSpan={2}>(2)</th>
          <th rowSpan={2}>(3)</th>
          <th rowSpan={2}>(4)</th>
          <th rowSpan={2}>(5)</th>
          {[...Array(16)].map((_, i) => (
            <th key={i} rowSpan={1} colSpan={2}>
              ({i + 6})
            </th>
          ))}

          <th rowSpan={2}>(22)</th>
          <th rowSpan={2}>(23)</th>
        </tr>
        <tr>
          {[...Array(16)].map((_, i) => (
            <React.Fragment key={i}>
              <th>K</th>
              <th>Rp.</th>
            </React.Fragment>
          ))}
        </tr>
      </>
    );
  };
  //#endregion

  const customAkhir = () => {
    return (
      <>
        <tr>
          <td colSpan={27} className='text-right'>
            Rata-rata capaian kinerja (%)
          </td>
          <td colSpan={12}></td>
        </tr>
        <tr>
          <td colSpan={27} className='text-right'>
            Predikat kinerja
          </td>
          <td colSpan={12}></td>
        </tr>
        <tr>
          <td colSpan={39}>Faktor pendorong keberhasilan pencapaian:</td>
        </tr>
        <tr>
          <td colSpan={39}>Faktor penghambat pencapaian kinerja:</td>
        </tr>
        <tr>
          <td colSpan={39}>
            Tindak lanjut yang diperlukan dalam RKPD kabupaten/kota berikutnya:
          </td>
        </tr>
        <tr>
          <td colSpan={39}>
            Tindak lanjut yang diperlukan dalam RPJMD kabupaten/kota berikutnya:
          </td>
        </tr>
      </>
    );
  };

  // const columns: ColumnDef<any>[] = Array.from({ length: 39 }, (_, i) => ({
  //   id: (i + 1).toString(),
  // }));

  const columns: ColumnDef<FlatRPJMD>[] = [
    {
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Sasaran',
      accessorFn: () => '', // tetap kosong
    },
    {
      header: 'Program Prioritas',
      accessorFn: (row) => row.name ?? '',
    },
    {
      header: 'Indikator Kinerja',
      accessorFn: (row) => row.indikator_o_name || '',
    },
    {
      header: 'Data Capaian pada Awal Tahun Perencanaan',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_1 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Target pada Akhir Tahun Perencanaan (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Target pada Akhir Tahun Perencanaan (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.target_io_target_5 ? formatUang(row.target_io_target_5) : 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    //#region Target
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-1 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_target_1 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-1 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => (row.pagu_pagu_1 ? formatUang(row.pagu_pagu_1) : 0),
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-2 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_target_2 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-2 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => (row.pagu_pagu_2 ? formatUang(row.pagu_pagu_2) : 0),
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-3 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_target_3 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-3 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => (row.pagu_pagu_3 ? formatUang(row.pagu_pagu_3) : 0),
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-4 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_target_4 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-4 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => (row.pagu_pagu_4 ? formatUang(row.pagu_pagu_4) : 0),
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-5 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_target_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-5 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => (row.pagu_pagu_5 ? formatUang(row.pagu_pagu_5) : 0),
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    //#endregion
    //#region Capaian
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-1 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_1 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-1 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.pagu_realisasi_1 ? formatUang(row.pagu_realisasi_1) : 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-2 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_2 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-2 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.pagu_realisasi_2 ? formatUang(row.pagu_realisasi_2) : 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-3 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_3 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-3 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.pagu_realisasi_3 ? formatUang(row.pagu_realisasi_3) : 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-4 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_4 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-4 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.pagu_realisasi_4 ? formatUang(row.pagu_realisasi_4) : 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-5 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke-5 (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) =>
        row.pagu_realisasi_5 ? formatUang(row.pagu_realisasi_5) : 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    //#endregion
    //#region Tingkat
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-1 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_persen_1 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-1 (Rp)',
      meta: {
        tdClassNames: 'text-center whitespace-nowrap',
      },
      accessorFn: (row) => (row.pagu_persen_1 ? row.pagu_persen_1 : 0) + ' %',
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-2 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_persen_2 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-2 (Rp)',
      meta: {
        tdClassNames: 'text-center whitespace-nowrap',
      },
      accessorFn: (row) => (row.pagu_persen_2 ? row.pagu_persen_2 : 0) + ' %',
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-3 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_persen_3 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-3 (Rp)',
      meta: {
        tdClassNames: 'text-center whitespace-nowrap',
      },
      accessorFn: (row) => (row.pagu_persen_3 ? row.pagu_persen_3 : 0) + ' %',
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-4 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_persen_4 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-4 (Rp)',
      meta: {
        tdClassNames: 'text-center whitespace-nowrap',
      },
      accessorFn: (row) => (row.pagu_persen_4 ? row.pagu_persen_4 : 0) + ' %',
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-5 (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_persen_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header:
        'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke-5 (Rp)',
      meta: {
        tdClassNames: 'text-center whitespace-nowrap',
      },
      accessorFn: (row) => (row.pagu_persen_5 ? row.pagu_persen_5 : 0) + ' %',
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    //#endregion
    {
      header: 'Rasio Capaian Akhir  (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => {
        const totalTarget =
          (row.target_io_target_1 ?? 0) +
          (row.target_io_target_2 ?? 0) +
          (row.target_io_target_3 ?? 0) +
          (row.target_io_target_4 ?? 0) +
          (row.target_io_target_5 ?? 0);

        const totalCapaian =
          (row.target_io_capaian_1 ?? 0) +
          (row.target_io_capaian_2 ?? 0) +
          (row.target_io_capaian_3 ?? 0) +
          (row.target_io_capaian_4 ?? 0) +
          (row.target_io_capaian_5 ?? 0);

        return (totalTarget > 0 ? (totalCapaian / totalTarget) * 100 : 0)+ ' %';
      },
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Rasio Capaian Akhir (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => {
        const totalTargetPagu =
          (row.pagu_pagu_1 ?? 0) +
          (row.pagu_pagu_2 ?? 0) +
          (row.pagu_pagu_3 ?? 0) +
          (row.pagu_pagu_4 ?? 0) +
          (row.pagu_pagu_5 ?? 0);

        const totalCapaianPagu =
          (row.pagu_realisasi_1 ?? 0) +
          (row.pagu_realisasi_2 ?? 0) +
          (row.pagu_realisasi_3 ?? 0) +
          (row.pagu_realisasi_4 ?? 0) +
          (row.pagu_realisasi_5 ?? 0);

        return (totalTargetPagu > 0
          ? (totalCapaianPagu / totalTargetPagu) * 100
          : 0)+ ' %';
      },
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
  ];

  return (
    <div className='flex flex-col p-4'>
      <div className='border p-2 w-fit'>
        <div className='min-w-[1500px]'>
          <div className='flex flex-col items-center justify-center text-xl'>
            <p>Evaluasi Terhadap Hasil RPJMD</p>
            <p>Kabupaten Bengkulu Utara</p>
          </div>
          <br />
          <div className='text-xl'>
            <p>Sasaran Pembangunan Jangka Menengah:</p>
            <p>…………………………………………………………………………………………………………………………………………………</p>
          </div>
          <Tabel
            customTableClass='table-excel'
            data={data}
            columns={columns}
            renderHeader={tableHead}
            customRowAkhir={customAkhir()}
            disablePagination
          />
          <br />
          <div className='flex justify-end'>
            <div className='grid grid-cols-2 gap-48 mr-96'>
              <div className='col-start-2 flex flex-col items-center'>
                <span>Disetujui</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>KEPALA SKPD</span>
                <span>KABUPATEN/KOTA.................................... </span>
                <br />
                <br />
                <br />
                <span>(....................................)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPJMDPreviewTable;
