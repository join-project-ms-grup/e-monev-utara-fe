import ttd from '/src/assets/ttd.png';
import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import { getPeriodeAkhirFromCookie } from '../../../../lib/usercookie';
import type { FlatRKPDTriwulan } from '../../../../services/RKPDService';
import { renderSatuan, renderUang } from '../../../../lib/helper';
import type { CatatanForm } from '../../../../services/CatatanService';

interface MainTableProps {
  data: FlatRKPDTriwulan[];
  skpd: string;
  tahun: string;
  catatan: CatatanForm;
}

const RenjaPreviewTable = ({ data, skpd, catatan, tahun }: MainTableProps) => {
  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2}> Program/ Kegiatan</th>
          <th rowSpan={2}>
            Indikator Kinerja Program (outcome)/ Kegiatan (output)
          </th>
          <th rowSpan={2} colSpan={2}>
            Target Renstra Perangkat Daerah pada Tahun{' '}
            {getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Capaian Kinerja Renstra Perangkat Daerah sampai dengan
            Renja Perangkat Daerah Tahun Lalu
            <br />
            (n-2)
          </th>
          <th rowSpan={2} colSpan={2}>
            Target Kinerja dan Anggaran Renja Perangkat Daerah Tahun berjalan
            (Tahun n-1) yang dievaluasi
          </th>
          <th rowSpan={1} colSpan={8}>
            Realisasi Kinerja Pada Triwulan
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang
            dievaluasi
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Kinerja dan Anggaran Renstra Perangkat Daerah s/d tahun
            {` `}
            {getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={2} colSpan={2}>
            Tingkat Capaian Kinerja Dan Realisasi Anggaran Renstra Perangkat
            Daerah s/d tahun
            {` `}
            {getPeriodeAkhirFromCookie()}
            <br />
            (%)
          </th>
          <th rowSpan={2}>Perangkat Daerah Penanggung Jawab</th>
        </tr>
        <tr>
          <th colSpan={2}>I</th>
          <th colSpan={2}>II</th>
          <th colSpan={2}>III</th>
          <th colSpan={2}>IV</th>
        </tr>
        <tr>
          <th rowSpan={2}>(1)</th>
          <th rowSpan={2}>(2)</th>
          <th rowSpan={2}>(3)</th>
          <th rowSpan={2}>(4)</th>
          {[...Array(10)].map((_, i) => (
            <th key={i} rowSpan={1} colSpan={2}>
              ({i + 5})
            </th>
          ))}
          <th rowSpan={2}>(15)</th>
        </tr>
        <tr>
          {[...Array(10)].map((_, i) => (
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
          <td colSpan={10} className='text-right'>
            Rata-rata capaian kinerja (%)
          </td>
          <td colSpan={15}></td>
        </tr>
        <tr>
          <td colSpan={10} className='text-right'>
            Predikat kinerja
          </td>
          <td colSpan={15}></td>
        </tr>
        <tr>
          <td colSpan={25}>
            Faktor pendorong keberhasilan kinerja: {catatan.pendorong}
          </td>
        </tr>
        <tr>
          <td colSpan={25}>
            Faktor penghambat pencapaian kinerja: {catatan.penghambat}
          </td>
        </tr>
        <tr>
          <td colSpan={25}>
            Tindak lanjut yang diperlukan dalam triwulan berikutnya*{`)`}:{` `}
            {catatan.tl_1}
          </td>
        </tr>
        <tr>
          <td colSpan={25}>
            Tindak lanjut yang diperlukan dalam Renja Perangkat Daerah
            kabupaten/kota berikutnya*{`)`}:{` `}
            {catatan.tl_2}
          </td>
        </tr>
      </>
    );
  };
  const columns: ColumnDef<FlatRKPDTriwulan>[] = [
    // 1
    {
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    // 2
    {
      header: 'Sasaran',
    },
    // 3
    {
      header: 'Program/Kegiatan',
      accessorKey: 'name',
    },
    // 4
    {
      header: 'Indikator Kinerja Program/Kegiatan',
      accessorKey: 'ind_name',
    },
    // 5
    {
      header: 'Target Renstra Perangkat Daerah K',
      accessorKey: 'ind_target_akhir_periode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'Target Renstra Perangkat Daerah RP',
      accessorKey: 'paguPeriode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 6
    {
      header:
        'Realisasi Capaian Kinerja Renstra Perangkat Daerah sampai dengan Renja Perangkat Daerah Tahun Lalu K',
      accessorKey: 'total_capaian',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header:
        'Realisasi Capaian Kinerja Renstra Perangkat Daerah sampai dengan Renja Perangkat Daerah Tahun Lalu RP',
      accessorKey: 'totalRealisasi',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 7
    {
      header:
        'Target Kinerja dan Anggaran Renja Perangkat Daerah Tahun berjalan (Tahun n-1) yang dievaluasi K',
      accessorKey: 'ind_target_tahun_dievaluasi',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header:
        'Target Kinerja dan Anggaran Renja Perangkat Daerah Tahun berjalan (Tahun n-1) yang dievaluasi RP',
      accessorKey: 'paguTahunEval',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    //
    {
      header: 'TRI1',
      accessorKey: 'ind_triwulan_capaian_1_k',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI1 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_1_rp',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    //
    {
      header: 'TRI2',
      accessorKey: 'ind_triwulan_capaian_2_k',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI2 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_2_rp',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    //
    {
      header: 'TRI3',
      accessorKey: 'ind_triwulan_capaian_3_k',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI3 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_3_rp',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    //
    {
      header: 'TRI4',
      accessorKey: 'ind_triwulan_capaian_4_k',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI4 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_4_rp',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 12
    {
      header:
        'Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang dievaluasi K',
      accessorKey: 'ind_triwulan_capaian_3_k2',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header:
        'Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang dievaluasi RP',
      accessorKey: 'pagu_triwulan_realisasi_3_rp2',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 13
    {
      header:
        'Realisasi Kinerja dan Anggaran Renstra Perangkat Daerah s/d tahun 2030 K',
      accessorKey: 'total_capaian_periode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header:
        'Realisasi Kinerja dan Anggaran Renstra Perangkat Daerah s/d tahun 2030 RP',
      accessorKey: 'totalRealisasiPeriode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 14
    {
      header:
        'Tingkat Capaian Kinerja Dan Realisasi Anggaran Renstra Perangkat Daerah s/d tahun (%) K',
      accessorKey: 'persen_capaian',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderSatuan(getValue<number | null>(), '%'),
    },
    {
      header:
        'Tingkat Capaian Kinerja Dan Realisasi Anggaran Renstra Perangkat Daerah s/d tahun (%) RP',
      accessorKey: 'persenRealisasi',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderSatuan(getValue<number | null>(), '%'),
    },
    // 15
    {
      header: 'perangkat',
      cell: `${skpd}`,
    },
  ];

  return (
    <div className='flex flex-col p-4'>
      <div className='border p-2 w-fit'>
        <div className='min-w-[1500px]'>
          <div className='flex flex-col items-center justify-center text-xl'>
            <p>
              Evaluasi Terhadap Hasil Renja Perangkat Daerah Lingkup
              Kabupaten/kota
            </p>
            <p>Renja Perangkat Daerah {skpd} Kabupaten Bengkulu Utara</p>
            <p>Tahun {tahun}</p>
          </div>
          <br />
          <div className='text-xl'>
            <p>
              Indikator dan target kinerja Perangkat Daerah Kabupaten/Kota yang
              mengacu pada sasaran RKPD:
            </p>
            <p>…………………………………………………………………………………………………………………………………………………</p>
          </div>

          <Tabel
            customTableClass='table-excel'
            data={data}
            columns={columns}
            renderHeader={tableHead}
            disablePagination
            customRowAkhir={customAkhir()}
          />
          <br />
          <div className='grid grid-cols-2 text-xl'>
            <div></div>
            <div className='grid grid-cols-2'>
              <div className='flex flex-col items-center'>
                <span>Disusun</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>KEPALA {skpd.toUpperCase()}</span>
                <span>KABUPATEN BENGKULU UTARA</span>
                <img
                  className='-mt-10 -mb-10'
                  src={ttd}
                  alt='TTD'
                  width={300}
                />
                <span>(....................................)</span>
              </div>
              <div className='flex flex-col items-center'>
                <span>Dievaluasi</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>KEPALA BAPPEDA</span>
                <span>KABUPATEN BENGKULU UTARA</span>
                <img
                  className='-mt-10 -mb-10'
                  src={ttd}
                  alt='TTD'
                  width={300}
                />
                <span>(....................................)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenjaPreviewTable;
