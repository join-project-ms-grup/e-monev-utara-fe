import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { FlatRenstraRow } from '../../../../services/RenstraService';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import { MdClose, MdPrint } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import type { FlatRKPD } from '../../../../services/RKPDService';
import { formatUang } from '../../../../lib/helper';

interface MainTableProps {
  data: FlatRKPD[];
  skpd: string;
}

const RenjaPreviewTable = ({ data, skpd }: MainTableProps) => {
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

  const tableBody = ({ table }: { table: Table<FlatRKPD> }) => {
    const rows = table.getRowModel().rows;

    const grouped = rows.reduce<Record<string, typeof rows>>((acc, row) => {
      const key = row.original.rekening;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    return (
      <>
        {Object.entries(grouped).map(([rekening, group]) =>
          group.map((row, i) => {
            const isHeaderLevel = ['urusan', 'bidang'].some((l) =>
              row.original.level.includes(l),
            );

            return (
              <tr key={row.id}>
                <td className='border text-center px-2 py-1'>
                  {row.index + 1}
                </td>

                <td className='border text-center px-2 py-1'>
                  {row.original.sasaran ?? ''}
                </td>

                {i === 0 && (
                  <td
                    rowSpan={group.length}
                    className={`border px-2 py-1 align-top ${
                      isHeaderLevel ? 'font-bold' : ''
                    }`}
                  >
                    {rekening}
                  </td>
                )}

                <td className='border px-2 py-1'>
                  {row.original.indikator_kinerja ?? ''}
                </td>

                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? `${row.original.target_rpjmd_kinerja ?? ''} ${
                        row.original.satuan ?? ''
                      }`
                    : ''}
                </td>
                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? formatUang(Number(row.original.target_rpjmd_anggaran))
                    : ''}
                </td>

                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? (row.original.realisasi_rpjmd_kinerja ?? '')
                    : ''}
                </td>
                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? formatUang(Number(row.original.realisasi_rpjmd_anggaran))
                    : ''}
                </td>

                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? (row.original.target_rkpd_kinerja ?? '')
                    : ''}
                </td>
                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? formatUang(Number(row.original.target_rkpd_anggaran))
                    : ''}
                </td>

                {[
                  [
                    'realisasi_triwulan_I_kinerja',
                    'realisasi_triwulan_I_anggaran',
                  ],
                  [
                    'realisasi_triwulan_II_kinerja',
                    'realisasi_triwulan_II_anggaran',
                  ],
                  [
                    'realisasi_triwulan_III_kinerja',
                    'realisasi_triwulan_III_anggaran',
                  ],
                  [
                    'realisasi_triwulan_IV_kinerja',
                    'realisasi_triwulan_IV_anggaran',
                  ],
                ].map(([kinerja, anggaran]) => (
                  <React.Fragment key={kinerja}>
                    <td className='border text-center px-2 py-1'>
                      {!isHeaderLevel
                        ? (row.original[kinerja as keyof FlatRKPD] ?? '')
                        : ''}
                    </td>
                    <td className='border text-center px-2 py-1'>
                      {!isHeaderLevel
                        ? formatUang(
                            Number(row.original[anggaran as keyof FlatRKPD]),
                          )
                        : ''}
                    </td>
                  </React.Fragment>
                ))}

                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? (row.original.realisasi_rkpd_kinerja ?? '')
                    : ''}
                </td>
                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? formatUang(Number(row.original.realisasi_rkpd_anggaran))
                    : ''}
                </td>

                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? (row.original.realisasi_rpjmd_sd_tahun_kinerja ?? '')
                    : ''}
                </td>
                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? formatUang(
                        Number(row.original.realisasi_rpjmd_sd_tahun_anggaran),
                      )
                    : ''}
                </td>

                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? (row.original.tingkat_capaian_rpjmd_kinerja ?? '')
                    : ''}
                </td>
                <td className='border text-center px-2 py-1'>
                  {!isHeaderLevel
                    ? <span className='text-nowrap'>{row.original.tingkat_capaian_rpjmd_anggaran} %</span>
                    : ''}
                </td>

                <td className='border text-center px-2 py-1'>
                  {row.original.perangkat_daerah ?? ''}
                </td>
              </tr>
            );
          }),
        )}
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
          <td colSpan={25}>Faktor pendorong keberhasilan kinerja:</td>
        </tr>
        <tr>
          <td colSpan={25}>Faktor penghambat pencapaian kinerja:</td>
        </tr>
        <tr>
          <td colSpan={25}>
            Tindak lanjut yang diperlukan dalam triwulan berikutnya*{`)`}:
          </td>
        </tr>
        <tr>
          <td colSpan={25}>
            Tindak lanjut yang diperlukan dalam Renja Perangkat Daerah
            kabupaten/kota berikutnya*{`)`}:
          </td>
        </tr>
      </>
    );
  };

  const columns: ColumnDef<any>[] = Array.from({ length: 25 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

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
            renderBody={(table) => tableBody({ table })}
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
                <span>
                  KEPALA Perangkat Daerah....................................
                </span>
                <span>KAB/KOTA .................................... </span>
                <br />
                <br />
                <br />
                <span>(....................................)</span>
              </div>
              <div className='flex flex-col items-center'>
                <span>Dievaluasi</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>KEPALA BAPPEDA....................................</span>
                <span>KAB/KOTA .................................... </span>
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

export default RenjaPreviewTable;
