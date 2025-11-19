import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import { renderSatuan, renderUang } from '../../../../lib/helper';
import type { FlatRKPDTriwulan } from '../../../../services/RKPDService';
import { getPeriodeAkhirFromCookie } from '../../../../lib/usercookie';
import type { CatatanForm } from '../../../../services/CatatanService';

interface MainTableProps {
  data: FlatRKPDTriwulan[];
  skpd: string;
  tahun: string;
  catatan: CatatanForm;
}

const RKPDPreviewTable = ({ data, skpd, catatan, tahun }: MainTableProps) => {
  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2}>Kode</th>
          <th rowSpan={2}>
            Urusan / Bidang / Program / Kegiatan / Sub Kegiatan
          </th>
          <th rowSpan={2}>
            Indikator Kinerja Program (Outcome)/ Kegiatan (output)
          </th>
          <th rowSpan={2} colSpan={2}>
            Target RPJMD Kabupaten/kota pada Tahun {getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Capaian Kinerja RPJMD Kabupaten/kota sampai dengan RKPD
            Kabupaten/kota Tahun Lalu <br />
            (n-2)
          </th>
          <th rowSpan={2} colSpan={2}>
            Target Kinerja dan Anggaran RKPD Kabupaten/kota Tahun Berjalan
            (Tahun n-1) yang Dievaluasi
          </th>
          <th colSpan={8}>Realisasi Kinerja Pada Triwulan</th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Capaian Kinerja dan Anggaran RKPD Kabupaten/kota yang
            Dievaluasi
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Kinerja dan Anggaran RPJMD Kabupaten/kota s/d Tahun{` `}{getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={2} colSpan={2}>
            Tingkat Capaian Kinerja dan Realisasi Anggaran RPJMD Kabupaten/kota
            s/d Tahun {getPeriodeAkhirFromCookie()}
            <br />
            {`(%)`}
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
          <th rowSpan={2}>1</th>
          <th rowSpan={2}>2</th>
          <th rowSpan={2}>3</th>
          <th rowSpan={2}>4</th>
          <th rowSpan={2}>5</th>
          <th colSpan={2}>6</th>
          <th colSpan={2}>7</th>
          <th colSpan={2}>8</th>
          <th colSpan={2}>9</th>
          <th colSpan={2}>10</th>
          <th colSpan={2}>11</th>
          <th colSpan={2}>12</th>
          <th colSpan={2}>13</th>
          <th colSpan={2}>14 = 7 + 13</th>
          <th colSpan={2}>15 = 14 / 6 x 100%</th>
          <th rowSpan={2} colSpan={2}>
            16
          </th>
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
          <td colSpan={11} className='text-right'>
            Rata-rata capaian kinerja (%)
          </td>
          <td colSpan={15}></td>
        </tr>
        <tr>
          <td colSpan={11} className='text-right'>
            Predikat kinerja
          </td>
          <td colSpan={15}></td>
        </tr>
        <tr>
          <td colSpan={26}>Faktor pendorong keberhasilan kinerja: {catatan.pendorong}</td>
        </tr>
        <tr>
          <td colSpan={26}>Faktor penghambat pencapaian kinerja: {catatan.penghambat}</td>
        </tr>
        <tr>
          <td colSpan={26}>
            Tindak lanjut yang diperlukan dalam triwulan berikutnya: {catatan.tl_1}
          </td>
        </tr>
        <tr>
          <td colSpan={26}>
            Tindak lanjut yang diperlukan dalam RKPD berikutnya: {catatan.tl_2}
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
      header: 'Kode',
      accessorKey: 'kode',
    },
    // 4
    {
      header: 'Program/Kegiatan',
      accessorKey: 'name',
    },
    // 5
    {
      header: 'Indikator Kinerja Program/Kegiatan',
      accessorKey: 'ind_name',
    },
    // 6
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
    // 7
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
    // 8
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
    // 9
    {
      header: 'TRI1',
      accessorKey: 'ind_triwulan_capaian_1',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI1 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_1',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 10
    {
      header: 'TRI2',
      accessorKey: 'ind_triwulan_capaian_2',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI2 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_2',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 11
    {
      header: 'TRI3',
      accessorKey: 'ind_triwulan_capaian_3',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI3 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_3',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 12
    {
      header: 'TRI4',
      accessorKey: 'ind_triwulan_capaian_4',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'TRI4 PAGU',
      accessorKey: 'pagu_triwulan_realisasi_4',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 13
    {
      header:
        'Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang dievaluasi K',
      accessorKey: 'ind_triwulan_capaian_3_re',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header:
        'Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang dievaluasi RP',
      accessorKey: 'pagu_triwulan_realisasi_3_re',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 14
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
    // 15
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
    // 16
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
            <p>Evaluasi Terhadap Hasil RKPD</p>
            <p>Kabupaten Bengkulu Utara</p>
            <p>Tahun {tahun}</p>
          </div>
          <br />
          <div className='text-xl'>
            <p>Sasaran Pembangunan Tahunan Kabupaten/kota:</p>
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
                <span>KEPALA SKPD....................................</span>
                <span>
                  KABUPATEN/KOTA ....................................{' '}
                </span>
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

export default RKPDPreviewTable;
