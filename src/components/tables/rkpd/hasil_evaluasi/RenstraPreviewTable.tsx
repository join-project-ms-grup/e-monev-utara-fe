import ttd from '/src/assets/ttd.png';
import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import type { FlatRenstraNew } from '../../../../services/RenstraService';
import { renderSatuan, renderUang } from '../../../../lib/helper';
import type { CatatanForm } from '../../../../services/CatatanService';

interface MainTableProps {
  data: FlatRenstraNew[];
  skpd: string;
  catatan: CatatanForm;
}

const RenstraPreviewTable = ({ data, skpd, catatan }: MainTableProps) => {
  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2}>Program/Kegiatan</th>
          <th rowSpan={2}>Indikator Kinerja</th>
          <th rowSpan={2}>Data Capaian Pada Awal Tahun Perencanaan</th>
          <th rowSpan={2} colSpan={2}>
            Target Capaian pada Akhir Tahun Perencanaan
          </th>
          <th rowSpan={1} colSpan={10}>
            Target Renstra Perangkat Daerah kabupaten/kota Tahun ke-
          </th>
          <th rowSpan={1} colSpan={10}>
            Realisasi Capaian Tahun ke-
          </th>
          <th rowSpan={1} colSpan={10}>
            Rasio Capaian pada Tahun ke-
          </th>
          <th rowSpan={2}>Perangkat Daerah Penanggung Jawab</th>
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
          <td colSpan={11}></td>
        </tr>
        <tr>
          <td colSpan={27} className='text-right'>
            Predikat kinerja
          </td>
          <td colSpan={11}></td>
        </tr>
        <tr>
          <td colSpan={38}>Faktor pendorong pencapaian kinerja: {catatan.pendorong}</td>
        </tr>
        <tr>
          <td colSpan={38}>Faktor penghambat: {catatan.penghambat}</td>
        </tr>
        <tr>
          <td colSpan={38}>
            Usulan tindak lanjut pada Renja Perangkat Daerah kabupaten/kota
            berikutnya: {catatan.tl_1}
          </td>
        </tr>
        <tr>
          <td colSpan={38}>
            Usulan tindak lanjut pada Renstra Perangkat Daerah kabupaten/kota
            berikutnya: {catatan.tl_2}
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
    // (22)
    {
      header: 'Perangkat Daerah Penanggung Jawab',
      cell: () => skpd,
    },
  ];

  return (
    <div className='flex flex-col p-4'>
      <div className='border p-2 w-fit'>
        <div className='min-w-[1500px]'>
          <div className='flex flex-col items-center justify-center text-xl'>
            <p>
              Evaluasi Terhadap Hasil Renstra Perangkat Daerah Lingkup
              Kabupaten/kota
            </p>
            <p>Renstra Perangkat Daerah {skpd} Kabupaten Bengkulu Utara</p>
          </div>
          <br />
          <div className='text-xl'>
            <p>
              Indikator dan target Kinerja Perangkat Daerah Kabupaten/Kota yang
              mengacu pada Sasaran RPJMD Kabupaten/Kota:
            </p>
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
              <div></div>
              <div className='flex flex-col items-center'>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>
                  KEPALA {skpd.toUpperCase()}
                </span>
                <span>KABUPATEN BENGKULU UTARA</span>
                <img className='-mt-10 -mb-10' src={ttd} alt="TTD" width={300} />
                <span>(....................................)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenstraPreviewTable;
