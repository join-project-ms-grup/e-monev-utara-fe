import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import { formatUang, renderUang } from '../../../../lib/helper';
import type { FlatRKPDNew } from '../../../../services/RKPDService';

interface MainTableProps {
  data: FlatRKPDNew[];
}

const RKPDPreviewTable = ({ data }: MainTableProps) => {
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
            Target RPJMD Kabupaten/kota
            <br />
            (Akhir Periode RPJMD)
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
            Realisasi Kinerja dan Anggaran RPJMD Kabupaten/kota s/d Tahun{` `}
          </th>
          <th rowSpan={2} colSpan={2}>
            Tingkat Capaian Kinerja dan Realisasi Anggaran RPJMD Kabupaten/kota
            s/d Tahun
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
          <td colSpan={26}>Faktor pendorong keberhasilan kinerja:</td>
        </tr>
        <tr>
          <td colSpan={26}>Faktor penghambat pencapaian kinerja:</td>
        </tr>
        <tr>
          <td colSpan={26}>
            Tindak lanjut yang diperlukan dalam triwulan berikutnya:
          </td>
        </tr>
        <tr>
          <td colSpan={26}>
            Tindak lanjut yang diperlukan dalam RKPD berikutnya:
          </td>
        </tr>
      </>
    );
  };

  // const mulaiPeriode = getPeriodeMulaiFromCookie();
  // const akhirPeriode = getPeriodeAkhirFromCookie();
  const columns: ColumnDef<FlatRKPDNew>[] = [
    {
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Sasaran',
    },
    {
      accessorKey: 'kode',
    },
    {
      accessorKey: 'name',
    },
    {
      accessorKey: 'ind_name',
    },
    {
      accessorKey: 'ind_target_per_tahun_5',
      meta: { tdClassNames: 'text-center' },
    },
    {
      accessorKey: 'pagu_per_tahun_5',
      cell: ({ getValue }) => {
        const value = getValue();
        return value === null || value === undefined
          ? ''
          : formatUang(Number(value));
      },
      meta: { tdClassNames: 'text-center' },
    },
    {
      accessorKey: 'ind_capaian_per_tahun_2',
      meta: { tdClassNames: 'text-center' },
    },
    {
      accessorKey: 'realisasi_per_tahun_2',
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
      meta: { tdClassNames: 'text-center' },
    },
    {
      accessorKey: 'ind_target_per_tahun_1',
      meta: { tdClassNames: 'text-center' },
    },
    {
      accessorKey: 'pagu_per_tahun_1',
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
      meta: { tdClassNames: 'text-center' },
    },
  ];

  return (
    <div className='flex flex-col p-4'>
      <div className='border p-2 w-fit'>
        <div className='min-w-[1500px]'>
          <div className='flex flex-col items-center justify-center text-xl'>
            <p>Evaluasi Terhadap Hasil RKPD</p>
            <p>Kabupaten Bengkulu Utara</p>
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
