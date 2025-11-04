import React from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef, Table } from '@tanstack/react-table';
import { formatUang } from '../../../../lib/helper';
import type { FlatRKPD } from '../../../../services/RKPDService';

interface MainTableProps {
  data: FlatRKPD[];
  listTahunKe: { label: string; value: string }[];
  tahunKe: string;
}

const RKPDPreviewTable = ({ data, listTahunKe, tahunKe }: MainTableProps) => {
  const tahunLabel = listTahunKe.find((item) => item.value === tahunKe)?.label;
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
            Target RPJMD Kabupaten/kota pada Tahun {tahunLabel ?? '........'}
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
            {tahunLabel}
          </th>
          <th rowSpan={2} colSpan={2}>
            Tingkat Capaian Kinerja dan Realisasi Anggaran RPJMD Kabupaten/kota
            s/d Tahun {tahunLabel} <br />
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
                    className='border whitespace-nowrap px-2 py-1 align-top'
                  >
                    {`${row.original.kode_urusan} ${row.original.kode_bidang} ${row.original.kode_program} ${row.original.kode_kegiatan} ${row.original.kode_subKegiatan}`}
                  </td>
                )}

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
                    ? formatUang(
                        Number(row.original.tingkat_capaian_rpjmd_anggaran),
                      )
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

  const columns: ColumnDef<FlatRKPD>[] = [
    {
      header: 'No',
    },
    {
      header: 'Sasaran',
    },
    {
      header: 'Kode',
    },
    {
      accessorKey: 'rekening',
    },
    {
      accessorKey: 'indikator_kinerja',
    },
    {
      accessorKey: 'target_rpjmd_kinerja',
    },
    {
      accessorKey: 'target_rpjmd_anggaran',
    },
    {
      accessorKey: 'realisasi_rpjmd_kinerja',
    },
    {
      accessorKey: 'realisasi_rpjmd_anggaran',
    },
    {
      accessorKey: 'target_rkpd_kinerja',
    },
    {
      accessorKey: 'target_rkpd_anggaran',
    },
    {
      accessorKey: 'realisasi_triwulan_I_kinerja',
    },
    {
      accessorKey: 'realisasi_triwulan_I_anggaran',
    },
    {
      accessorKey: 'realisasi_triwulan_II_kinerja',
    },
    {
      accessorKey: 'realisasi_triwulan_II_anggaran',
    },
    {
      accessorKey: 'realisasi_triwulan_III_kinerja',
    },
    {
      accessorKey: 'realisasi_triwulan_III_anggaran',
    },
    {
      accessorKey: 'realisasi_triwulan_IV_kinerja',
    },
    {
      accessorKey: 'realisasi_triwulan_IV_anggaran',
    },
    {
      accessorKey: 'realisasi_rkpd_kinerja',
    },
    {
      accessorKey: 'realisasi_rkpd_anggaran',
    },
    {
      accessorKey: 'realisasi_rpjmd_sd_tahun_kinerja',
    },
    {
      accessorKey: 'realisasi_rpjmd_sd_tahun_anggaran',
    },
    {
      accessorKey: 'tingkat_capaian_rpjmd_kinerja',
    },
    {
      accessorKey: 'tingkat_capaian_rpjmd_anggaran',
    },
    {
      accessorKey: 'perangkat_daerah',
    },
  ];

  return (
    <div className='flex flex-col p-4'>
      <div className='border p-2 w-fit'>
        <div className='min-w-[1500px]'>
          <div className='flex flex-col items-center justify-center text-xl'>
            <p>Evaluasi Terhadap Hasil RKPD</p>
            <p>Kabupaten Bengkulu Utara</p>
            <p>Tahun: {tahunLabel}</p>
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
            renderBody={(table) => tableBody({ table })}
            customRowAkhir={customAkhir()}
            disablePagination
          />
          <br />
          <div className='flex justify-end'>
            <div className='grid grid-cols-2 gap-48 mr-96'>
              <div className='flex flex-col items-center'>
                <span>Disusun</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>KEPALA BAPPEDA....................................</span>
                <span>PROVINSI .................................... </span>
                <br />
                <br />
                <br />
                <span>(....................................)</span>
              </div>
              <div className='flex flex-col items-center'>
                <span>Disetujui</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>
                  BUPATI/WALI KOTA....................................
                </span>
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
