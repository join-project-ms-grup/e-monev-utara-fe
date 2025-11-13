import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import type { FlatRPJMD } from '../../../../services/RPJMDService';
import { renderSatuan, renderUang } from '../../../../lib/helper';
import type { FlatRenstraNew } from '../../../../services/RenstraService';
import type { CatatanForm } from '../../../../services/CatatanService';

interface MainTableProps {
  data: FlatRPJMD[];
  catatan: CatatanForm,
}

const RPJMDPreviewTable = ({ data, catatan }: MainTableProps) => {
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
            Capaian Pada Akhir Tahun Perencanaan
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
          {[...Array(18)].map((_, i) => (
            <th key={i} rowSpan={1} colSpan={2}>
              ({i + 6})
            </th>
          ))}
        </tr>
        <tr>
          {[...Array(18)].map((_, i) => (
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
          <td colSpan={39}>Faktor pendorong keberhasilan pencapaian: {catatan.pendorong}</td>
        </tr>
        <tr>
          <td colSpan={39}>Faktor penghambat pencapaian kinerja: {catatan.penghambat}</td>
        </tr>
        <tr>
          <td colSpan={39}>
            Tindak lanjut yang diperlukan dalam RKPD kabupaten/kota berikutnya: {catatan.tl_1}
          </td>
        </tr>
        <tr>
          <td colSpan={39}>
            Tindak lanjut yang diperlukan dalam RPJMD kabupaten/kota berikutnya: {catatan.tl_2}
          </td>
        </tr>
      </>
    );
  };

  const columns: ColumnDef<FlatRenstraNew>[] = [
    // 1
    {
      header: 'No',
      meta: { tdClassNames: 'text-center' },
      cell: ({ row }) => row.index + 1,
    },
    // 2
    {
      header: 'Sasaran',
    },
    // 3
    {
      header: 'name',
      cell: ({ row }) => (
        <>
          <p>{row.original.name}</p>

          {row.original.ind_name ? (
            <p>
              <br />({row.original.ind_name})
            </p>
          ) : (
            ''
          )}
        </>
      ),
    },
    // 4
    {
      accessorKey: 'ind_name',
    },
    // 5
    {
      header: 'Data Capaian Pada Awal Tahun Perencanaan',
      accessorKey: 'target_capaian_1',
    },
    // 6
    {
      header: 'Target Capaian pada Akhir Tahun Perencanaan K',
      accessorKey: 'target_target_5',
    },
    {
      header: 'Target Capaian pada Akhir Tahun Perencanaan Rp',
      accessorKey: 'pagu_pagu_5',
      cell: ({ getValue }: any) => renderUang(getValue() as number | null),
    },
    // (7 - 11)
    ...Array.from({ length: 5 }, (_, i) => i + 1).flatMap((i) => [
      {
        id: `target_target_${i}_k`,
        accessorKey: `target_target_${i}`,
      },
      {
        id: `pagu_pagu_${i}_rp`,
        accessorKey: `pagu_pagu_${i}`,
        cell: ({ getValue }: any) => renderUang(getValue() as number | null),
      },
    ]),
    // (12 - 16)
    ...Array.from({ length: 5 }, (_, i) => i + 1).flatMap((i) => [
      {
        id: `target_capaian_${i}_k`,
        accessorKey: `target_capaian_${i}`,
      },
      {
        id: `pagu_realisasi_${i}_rp`,
        accessorKey: `pagu_realisasi_${i}`,
        cell: ({ getValue }: any) => renderUang(getValue() as number | null),
      },
    ]),
    // (17 - 21)
    ...Array.from({ length: 5 }, (_, i) => i + 1).flatMap((i) => [
      {
        id: `target_persen_${i}_k`,
        accessorKey: `target_persen_${i}`,
        meta: {
          tdClassNames: 'whitespace-nowrap text-center',
        },
        cell: ({ getValue }: any) =>
          renderSatuan(getValue() as number | null, '%'),
      },
      {
        id: `pagu_persen_${i}_rp`,
        accessorKey: `pagu_persen_${i}`,
        meta: {
          tdClassNames: 'whitespace-nowrap text-center',
        },
        cell: ({ getValue }: any) =>
          renderSatuan(getValue() as number | null, '%'),
      },
    ]),
    // 22
    {
      header: 'Capaian Pada Akhir Tahun Perencanaan',
      accessorKey: 'target_capaian_5',
    },
    {
      header: 'Capaian Pada Akhir Tahun Perencanaan',
      accessorKey: 'pagu_realisasi_5',
      cell: ({ getValue }: any) => renderUang(getValue() as number | null),
    },
    // 23
    {
      header: 'Rasio Capaian Akhir (%)',
      accessorKey: 'target_persen_5',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }: any) =>
        renderSatuan(getValue() as number | null, '%'),
    },
    {
      header: 'Rasio Capaian Akhir (%)',
      accessorKey: 'pagu_persen_5',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }: any) =>
        renderSatuan(getValue() as number | null, '%'),
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
