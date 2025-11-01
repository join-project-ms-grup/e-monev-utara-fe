import React, { useRef, type ReactNode } from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import { formatUang } from '../../../../lib/helper';
import type { FlatRenstraRow } from '../../../../services/RenstraService';

interface MainTableProps {
  data: FlatRenstraRow[];
  skpd: string;
}

const RenstraPreviewTable = ({ data, skpd }: MainTableProps) => {
    console.log('data renstra', data)
  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2}>Program/Kegiatan</th>
          <th rowSpan={2}>Indikator Kinerja</th>
          <th rowSpan={2}>
            Data Capaian Pada Awal Tahun PerencanaanData Capaian Pada Awal Tahun
            Perencanaan
          </th>
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

  const rowHeights = useRef<{ [key: string]: number[] }>({});
  const columns: ColumnDef<FlatRenstraRow>[] = [
    // (1)
    {
      header: 'No',
      meta: { tdClassNames: 'text-center' },
      cell: ({ row }) => row.index + 1,
    },
    // (2)
    {
      header: 'Sasaran',
    },
    // (3)
    {
      accessorKey: 'name',
    },
    // (4)
    {
      header: 'Indikator Kinerja Program (Outcome)/ Kegiatan (output)',
      accessorFn: (row) => row.indikator || [],
      meta: {
        tdClassNames: 'p-0! text-center',
      },
      cell: ({ row, getValue }) => {
        const indikator = getValue() as FlatRenstraRow['indikator'];
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
    // (5)
    {
      header:
        'Data Capaian Pada Awal Tahun PerencanaanData Capaian Pada Awal Tahun Perencanaan',
    },
    // (6)
    {
      header: 'Target Capaian pada Akhir Tahun Perencanaan',
      columns: [
        {
          id: 'fisik_akhir',
          header: 'Fisik',
          meta: {
            tdClassNames: 'p-0! text-center',
          },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRenstraRow['indikator'];
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
                            <span>{i.totalTarget}</span>
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
          accessorFn: (row) => row.pagu?.totalPagu ?? '',
          cell: ({ getValue }) =>
            getValue() ? formatUang(Number(getValue())) : '',
        },
      ],
    },
    // (7 - 11)
    {
      header: 'Target Renstra Perangkat Daerah kabupaten/kota Tahun ke-',
      columns: [1, 2, 3, 4, 5].map((tahun, index) => {
        const tw = index + 1;
        return {
          id: `target_tahunke_${tahun}`,
          columns: [
            {
              id: `target_tahunke_${tahun}_k`,
              meta: { tdClassNames: 'p-0!' },
              accessorFn: (row) => row.indikator || [],
              cell: ({ row, getValue }) => {
                const indikator = getValue() as FlatRenstraRow['indikator'];
                if (!indikator || indikator.length === 0) return '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        {indikator.map((i, idx) => {
                          const capaian =
                            i.target_per_tahun?.find((t) => t.tahun_ke === tw)
                              ?.target ?? '';
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
              id: `target_tahunke_${tahun}_rp`,
              meta: { tdClassNames: 'p-0! text-center' },
              accessorFn: (row) => row.pagu?.pagu_per_tahun || [],
              cell: ({ getValue }) => {
                const paguData = getValue() as {
                  tahun_ke: number;
                  pagu: string;
                }[];
                const pagu =
                  paguData.find((t) => t.tahun_ke === tw)?.pagu ?? '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        <tr>
                          <td>
                            {pagu ? formatUang(Number(pagu)) : ''}
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
    // (12 - 16)
    {
      header: 'Realisasi Capaian Tahun ke-',
      columns: [1, 2, 3, 4, 5].map((tahun, index) => {
        const tw = index + 1;
        return {
          id: `realisasi_tahunke_${tahun}`,
          columns: [
            {
              id: `realisasi_tahunke_${tahun}_k`,
              meta: { tdClassNames: 'p-0!' },
              accessorFn: (row) => row.indikator || [],
              cell: ({ row, getValue }) => {
                const indikator = getValue() as FlatRenstraRow['indikator'];
                if (!indikator || indikator.length === 0) return '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        {indikator.map((i, idx) => {
                          const capaian =
                            i.capaian_per_tahun?.find((t) => t.tahun_ke === tw)
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
              id: `realisasi_tahunke_${tahun}_rp`,
              meta: { tdClassNames: 'p-0! text-center' },
              accessorFn: (row) => row.pagu?.realisasi_per_tahun || [],
              cell: ({ getValue, row }) => {
                const paguData = getValue() as {
                  tahun_ke: number;
                  realisasi: string;
                }[];
                const realisasi =
                  paguData.find((t) => t.tahun_ke === tw)?.realisasi ?? '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        <tr>
                          <td>
                            {realisasi ? formatUang(Number(realisasi)) : ((row.original.level !== 'urusan' && row.original.level !== 'bidang') && 'Rp.0')}
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
    // (17 - 21)
    {
      header: 'Rasio Capaian pada Tahun ke-',
      columns: [1, 2, 3, 4, 5].map((tahun, index) => {
        const tw = index + 1;
        return {
          id: `rasio_tahunke_${tahun}`,
          columns: [
            {
              id: `rasio_tahunke_${tahun}_k`,
              meta: { tdClassNames: 'p-0!' },
              accessorFn: (row) => row.indikator || [],
              cell: ({ row, getValue }) => {
                const indikator = getValue() as FlatRenstraRow['indikator'];
                if (!indikator || indikator.length === 0) return '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        {indikator.map((i, idx) => {
                          const rasio =
                            i.rasio_per_tahun?.find((t) => t.tahun_ke === tw)
                              ?.rasio ?? '';
                          return (
                            <tr key={i.id}>
                              <td
                                style={{
                                  height:
                                    rowHeights.current[row.id]?.[idx] || 'auto',
                                }}
                              >
                                <div className='inline-flex gap-1'>
                                  <span>{rasio}</span>
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
              id: `rasio_tahunke_${tahun}_rp`,
              meta: { tdClassNames: 'p-0! text-center' },
              accessorFn: (row) => row.pagu?.rasio_per_tahun || [],
              cell: ({ getValue, row }) => {
                const paguData = getValue() as {
                  tahun_ke: number;
                  rasio: string;
                }[];
                const rasio =
                  paguData.find((t) => t.tahun_ke === tw)?.rasio ?? '';
                return (
                  <div>
                    <table className='w-full'>
                      <tbody className='border-0!'>
                        <tr>
                          <td>
                            {rasio ? formatUang(Number(rasio)) : ((row.original.level !== 'urusan' && row.original.level !== 'bidang') && 'Rp.0')}
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
    // (22)
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

export default RenstraPreviewTable;
