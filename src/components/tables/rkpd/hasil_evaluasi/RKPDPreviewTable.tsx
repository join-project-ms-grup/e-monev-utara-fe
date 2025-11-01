import React, { useRef, type ReactNode } from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import type { FlatRKPDRow } from '../../../../services/RKPDService';
import { formatUang } from '../../../../lib/helper';

interface MainTableProps {
  data: FlatRKPDRow[];
  listTahunKe: { label: string; value: string }[];
  tahunKe: string;
  skpd: string;
}

const RKPDPreviewTable = ({ data, listTahunKe, tahunKe, skpd }: MainTableProps) => {
  console.log('DATA', data);
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

  const rowHeights = useRef<{ [key: string]: number[] }>({});
  const columns: ColumnDef<FlatRKPDRow>[] = [
    {
      header: 'No',
      meta: { tdClassNames: 'text-center' },
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Sasaran',
      meta: { tdClassNames: 'text-center' },
    },
    {
      accessorKey: 'kode',
      header: 'Kode',
      meta: { tdClassNames: 'whitespace-nowrap' },
    },
    {
      accessorKey: 'name',
    },
    {
      header: 'Indikator Kinerja Program (Outcome)/ Kegiatan (output)',
      accessorFn: (row) => row.indikator || [],
      meta: {
        tdClassNames: 'p-0! text-center',
      },
      cell: ({ row, getValue }) => {
        const indikator = getValue() as FlatRKPDRow['indikator'];
        if (!indikator || indikator.length === 0) return '';
        return (
          <div>
            <table className='w-full'>
              <tbody>
                {indikator.map((i, index) => (
                  <tr key={i.id}>
                    <td
                      className={`block overflow-y-auto`}
                      ref={(el) => {
                        if (el) {
                          const h = el.offsetHeight;
                          if (!rowHeights.current[row.id])
                            rowHeights.current[row.id] = [];
                          rowHeights.current[row.id][index] = h;
                        }
                      }}
                    >
                      {i.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
    },
    {
      header: 'Target RPJMD Kabupaten/kota pada Tahun (Akhir Periode RPJMD)',
      columns: [
        {
          id: 'fisik_akhir',
          header: 'Fisik',
          meta: {
            tdClassNames: 'p-0! text-center',
          },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRKPDRow['indikator'];
            if (!indikator || indikator.length === 0) return '';
            return (
              <div>
                <table className='w-full'>
                  <tbody className='border-0!'>
                    {indikator.map((i, index) => (
                      <tr key={i.id}>
                        <td
                          style={{
                            height:
                              rowHeights.current[row.id]?.[index] || 'auto',
                          }}
                        >
                          <div className='inline-flex gap-1'>
                            <span>{i.target_akhir_periode}</span>
                            <span>{i.satuan}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          },
        },
        {
          id: 'rp_akhir',
          header: 'Rp.',
          meta: {
            tdClassNames: 'text-center',
          },
          accessorFn: (row) => row.pagu?.paguPeriode ?? '',
          cell: ({ getValue }) =>
            getValue() ? formatUang(Number(getValue())) : '',
        },
      ],
    },
    {
      header:
        'Realisasi Capaian Kinerja RPJMD Kabupaten/kota sampai dengan RKPD Kabupaten/kota Tahun Lalu (n-2)',
      columns: [
        {
          id: 'fisik_sebelum',
          header: 'Fisik',
          meta: {
            tdClassNames: 'p-0! text-center',
          },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRKPDRow['indikator'];
            if (!indikator || indikator.length === 0) return '';
            return (
              <div>
                <table className='w-full'>
                  <tbody className='border-0!'>
                    {indikator.map((i, index) => (
                      <tr key={i.id}>
                        <td
                          style={{
                            height:
                              rowHeights.current[row.id]?.[index] || 'auto',
                          }}
                        >
                          <div className='inline-flex gap-1'>
                            <span>{i.total_capaian_periode}</span>
                            <span>{i.satuan}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          },
        },
        {
          id: 'rp_sebelum',
          header: 'Rp.',
          meta: {
            tdClassNames: 'text-center',
          },
          accessorFn: (row) => row.pagu?.totalRealisasiPeriode ?? '',
          cell: ({ getValue }) =>
            getValue() ? formatUang(Number(getValue())) : '',
        },
      ],
    },
    {
      header:
        'Target Kinerja dan Anggaran RKPD Kabupaten/kota Tahun Berjalan (Tahun n-1) yang Dievaluasi',
      columns: [
        {
          id: 'fisik_evaluasi',
          header: 'Fisik',
          meta: {
            tdClassNames: 'p-0! text-center',
          },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRKPDRow['indikator'];
            if (!indikator || indikator.length === 0) return '';
            return (
              <div>
                <table className='w-full'>
                  <tbody className='border-0!'>
                    {indikator.map((i, index) => (
                      <tr key={i.id}>
                        <td
                          style={{
                            height:
                              rowHeights.current[row.id]?.[index] || 'auto',
                          }}
                        >
                          <div className='inline-flex gap-1'>
                            <span>{i.target_tahun_dievaluasi}</span>
                            <span>{i.satuan}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          },
        },
        {
          id: 'rp_evaluasi',
          header: 'Rp.',
          meta: {
            tdClassNames: 'text-center',
          },
          accessorFn: (row) => row.pagu?.paguTahunEval ?? '',
          cell: ({ getValue }) =>
            getValue() ? formatUang(Number(getValue())) : '',
        },
      ],
    },
    {
      header: 'Realisasi Kinerja Pada Triwulan',
      columns: ['I', 'II', 'III', 'IV'].map((triwulan, index) => {
        const tw = index + 1;
        return {
          id: `tri_${triwulan}`,
          columns: [
            {
              id: `tri_${triwulan}_k`,
              header: `Triwulan ${triwulan} - Kinerja`,
              meta: { tdClassNames: 'p-0!' },
              accessorFn: (row) => row.indikator || [],
              cell: ({ row, getValue }) => {
                const indikator = getValue() as FlatRKPDRow['indikator'];
                if (!indikator || indikator.length === 0) return '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        {indikator.map((i, idx) => {
                          const capaian =
                            i.triwulan?.find((t) => t.triwulan === tw)
                              ?.capaian ?? '';
                          return (
                            <tr key={i.id}>
                              <td
                                style={{
                                  height:
                                    rowHeights.current[row.id]?.[idx] || 'auto',
                                }}
                              >
                                <div className='inline-flex gap-1'>
                                  <span>{capaian}</span>
                                  <span>{i.satuan}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              },
            },
            {
              id: `tri_${triwulan}_rp`,
              header: `Triwulan ${triwulan} - Rp.`,
              meta: { tdClassNames: 'p-0! text-center' },
              accessorFn: (row) => row.pagu?.triwulan || [],
              cell: ({ getValue }) => {
                const triwulanData = getValue() as {
                  triwulan: number;
                  realisasi: string;
                }[];
                const realisasi =
                  triwulanData.find((t) => t.triwulan === tw)?.realisasi ?? '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        <tr>
                          <td>
                            {realisasi ? formatUang(Number(realisasi)) : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              },
            },
          ],
        };
      }),
    },
    {
      header:
        'Realisasi Capaian Kinerja dan Anggaran RKPD Kabupaten/kota yang Dievaluasi',
      columns: [
        {
          header: 'fisik',
        },
        {
          header: 'rp',
        },
      ],
    },
    {
      header:
        'Realisasi Kinerja dan Anggaran RPJMD Kabupaten/kota s/d Tahun 2014',
      columns: [
        {
          header: 'fisik',
        },
        {
          header: 'rp',
        },
      ],
    },
    {
      header:
        'Tingkat Capaian Kinerja dan Realisasi Anggaran RPJMD Kabupaten/kota s/d Tahun 2014 (%)',
      columns: [
        {
          header: 'fisik',
        },
        {
          header: 'rp',
        },
      ],
    },
    {
      header: 'Perangkat Daerah Penanggung Jawab',
      cell: () => skpd,
    },
  ];

  return (
    <Tabel
      customTableClass='table-excel'
      data={data}
      columns={columns}
      renderHeader={tableHead}
      disablePagination
    />
  );
};

export default RKPDPreviewTable;
