import { useEffect, useRef, useState, type ReactNode } from 'react';
import InputButton from '../../../inputs/InputButton';
import toast from 'react-hot-toast';
import { MdClose, MdPreview, MdPrint, MdRefresh } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';

import {
  getPeriodeIDFromCookie,
  getUserSKPDID,
  isAdmin,
  isDev,
} from '../../../../lib/usercookie';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import Tabel from '../../Tabel';
import Spinner from '../../../inputs/Spinner';
import type { ColumnDef } from '@tanstack/react-table';
import { exportRenstra } from '../../../../services/Excel/ExcelRenstra';
import {
  flattenRenstra,
  getRenstra,
  type FlatRenstraRow,
} from '../../../../services/RenstraService';
import { createPortal } from 'react-dom';
import RenstraPreviewTable from './RenstraPreviewTable';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import { formatRibu, formatUang } from '../../../../lib/helper';
import { getSKPDPerRENSTRA } from '../../../../services/PeriodeService';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Sasaran</th>
        <th rowSpan={2} className='w-[50px]'>
          Kode
        </th>
        <th rowSpan={2} className='w-[20%]'>
          Urusan / Bidang / Program / Kegiatan / Sub Kegiatan
        </th>
        <th rowSpan={2} className='w-[25%]'>
          Indikator
        </th>
        <th rowSpan={1} colSpan={2}>
          Target Akhir Tahun RPJM/Renstra
        </th>
        <th rowSpan={1} colSpan={2}>
          Realisasi Kinerja RPJM/Renstra s.d Tahun sebelumnya
        </th>
        <th rowSpan={1} colSpan={2}>
          Target Kinerja Tahun yang dievaluasi
        </th>
      </tr>
      <tr>
        {Array.from({ length: 3 }, (_, i) => (
          <>
            <th key={i} className='w-[200px]'>
              Fisik
            </th>
            <th key={i + 1} className='w-[200px]'>
              Rp.
            </th>
          </>
        ))}
      </tr>
    </>
  );
};

const RenstraTable = () => {
  //#region SKPD dan Tahun ke
  const userSKPDID = getUserSKPDID();
  const [selectedSKPD, setSelectedSKPD] = useState(userSKPDID ?? '');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPerRENSTRA(Number(getPeriodeIDFromCookie())),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  //#region RKPD Data Flatten
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['tabel_rkpd_5_tahunan', selectedSKPD],
    queryFn: async () => {
      const rawData = await getRenstra(Number(selectedSKPD));
      const flatten = flattenRenstra(rawData);
      return flatten;
    },
    enabled: !!selectedSKPD,
  });
  //#endregion

  // #region Kolom Tabel
  const rowHeights = useRef<{ [key: string]: number[] }>({});
  const columns: ColumnDef<FlatRenstraRow>[] = [
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
      cell: ({ getValue, row }) => {
        const typeBold = ['urusan', 'bidang'];
        const isBold = !!typeBold.find((item) => item === row.original.level);
        return (
          <>
            <span className={isBold ? 'font-bold' : undefined}>
              {getValue() as ReactNode}
            </span>
          </>
        );
      },
    },
    {
      header: 'Indikator',
      accessorFn: (row) => row.indikator || [],
      meta: { tdClassNames: 'p-0!' },
      cell: ({ row, getValue }) => {
        const indikator = getValue() as FlatRenstraRow['indikator'];
        if (!indikator?.length) return '';
        const isEven = row.index % 2 === 1;
        const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';

        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikator.map((i, index) => (
                  <tr key={i.id} className={bgClass}>
                    <td
                      className='block overflow-y-auto'
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

    // ==========================
    // Target Akhir RPJM / Renstra
    // ==========================
    {
      header: 'Target Akhir Tahun RPJM/Renstra',
      columns: [
        {
          id: 'fisik_akhir',
          header: 'Fisik',
          meta: { tdClassNames: 'p-0! text-center' },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRenstraRow['indikator'];
            if (!indikator?.length) return '';
            const isEven = row.index % 2 === 1;
            const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';

            return (
              <div>
                <table className='w-full'>
                  <tbody className='border-0!'>
                    {indikator.map((i, index) => (
                      <tr key={i.id} className={bgClass}>
                        <td
                          style={{
                            height:
                              rowHeights.current[row.id]?.[index] || 'auto',
                          }}
                          className='whitespace-break-spaces'
                        >
                          {i.satuan === '%'
                            ? i.totalTarget
                                .toString()
                                .split(/\n+/)
                                .filter((v) => v.trim() !== '')
                                .map((v) => `${v.trim()} ${i.satuan}`)
                                .join('\n')
                            : i.totalTarget
                                .toString()
                                .split(/\n+/)
                                .filter((v) => v.trim() !== '')
                                .map(
                                  (v) => `${formatRibu(Number(v))} ${i.satuan}`,
                                )
                                .join('\n')}
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
          accessorFn: (row) => row.pagu?.totalPagu,
          cell: ({ getValue }) => `${getValue() ? formatUang(getValue()) : ''}`,
        },
      ],
    },

    // ==========================
    // Realisasi s.d Tahun Sebelumnya
    // ==========================
    {
      header: 'Realisasi Kinerja RPJM/Renstra s.d Tahun Sebelumnya',
      columns: [
        {
          id: 'fisik_sebelum',
          header: 'Fisik',
          meta: { tdClassNames: 'p-0! text-center' },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRenstraRow['indikator'];
            if (!indikator?.length) return '';
            const isEven = row.index % 2 === 1;
            const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';

            return (
              <div>
                <table className='w-full'>
                  <tbody className='border-0!'>
                    {indikator.map((i, index) => {
                      const capaianSebelum = i.capaian_per_tahun
                        ?.filter((t) => Number(t.tahun_ke) < 5)
                        .reduce((sum, t) => sum + (Number(t.capaian) || 0), 0);

                      if (capaianSebelum === 0) {
                        return '-';
                      }

                      return (
                        <tr key={i.id} className={bgClass}>
                          <td
                            style={{
                              height:
                                rowHeights.current[row.id]?.[index] || 'auto',
                            }}
                          >
                            {i.satuan === '%'
                              ? capaianSebelum + ' ' + i.satuan
                              : formatRibu(capaianSebelum) + ' ' + i.satuan}
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
          id: 'rp_sebelum',
          header: 'Rp.',
          meta: { tdClassNames: 'text-center' },
          accessorFn: (row) =>
            row.pagu?.realisasi_per_tahun
              ?.filter((r) => Number(r.tahun_ke) < 5)
              .reduce((sum, r) => sum + (Number(r.realisasi) || 0), 0) ?? '-',
          cell: ({ row, getValue }) => {
            if (
              row.original.level === 'urusan' ||
              row.original.level === 'bidang'
            ) {
              return '';
            }
            return `${getValue() ? formatUang(getValue()) : '-'}`;
          },
        },
      ],
    },

    // ==========================
    // Target Tahun yang Dievaluasi
    // ==========================
    {
      header: 'Target Kinerja Tahun yang Dievaluasi',
      columns: [
        {
          id: 'fisik_evaluasi',
          header: 'Fisik',
          meta: { tdClassNames: 'p-0! text-center' },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRenstraRow['indikator'];
            if (!indikator?.length) return '';
            const isEven = row.index % 2 === 1;
            const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';

            return (
              <div>
                <table className='w-full'>
                  <tbody className='border-0!'>
                    {indikator.map((i, index) => {
                      const targetEvaluasi = i.target_per_tahun?.find(
                        (t) => Number(t.tahun_ke) === 5,
                      );

                      if (targetEvaluasi?.target === 0) {
                        return '-';
                      }
                      return (
                        <tr key={i.id} className={bgClass}>
                          <td
                            style={{
                              height:
                                rowHeights.current[row.id]?.[index] || 'auto',
                            }}
                          >
                            {i.satuan === '%'
                              ? targetEvaluasi?.target + ' ' + i.satuan
                              : formatRibu(targetEvaluasi?.target ?? 0) +
                                ' ' +
                                i.satuan}
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
          id: 'rp_evaluasi',
          header: 'Rp.',
          meta: { tdClassNames: 'text-center' },
          accessorFn: (row) =>
            row.pagu?.pagu_per_tahun?.find((p) => Number(p.tahun_ke) === 5)
              ?.pagu ?? '',
          cell: ({ row, getValue }) => {
            if (
              row.original.level === 'urusan' ||
              row.original.level === 'bidang'
            ) {
              return '';
            }
            return `${getValue() ? formatUang(getValue()) : '-'}`;
          },
        },
      ],
    },
  ];
  // #endregion

  const [isPreview, setIsPreview] = useState(false);
  useEffect(() => {
    if (isPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreview]);

  return (
    <>
      <div className='space-y-2'>
        <div className='flex items-end justify-between'>
          <div className='inline-flex gap-2'>
            {(isDev() || isAdmin()) && (
              <div>
                <label htmlFor='skpd'>SKPD</label>
                <InputSearchBox
                  id='skpd'
                  className='w-72 h-9'
                  btnclassName='bg-white'
                  placeholder='Pilih SKPD...'
                  value={selectedSKPD.toString()}
                  options={listSKPDPeriode as OptionItem[]}
                  onChange={(val) => setSelectedSKPD(val)}
                  onClear={() => setSelectedSKPD('')}
                  withSearch
                />
              </div>
            )}
          </div>
          <div className='inline-flex gap-2'>
            <InputButton
              tooltip='Lihat tabel penuh'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                if (data) {
                  setIsPreview(true);
                } else {
                  toast.error(`${!selectedSKPD ? 'SKPD' : ''} belum dipilih`);
                }
              }}
            >
              <MdPreview />
            </InputButton>
            <InputButton
              tooltip='Refresh'
              className='btn btn-theme w-9 h-9'
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
            </InputButton>
          </div>
        </div>
        <Tabel
          tblClassName={`${selectedSKPD && data && 'lg:min-w-[2500px]'}`}
          data={data || []}
          columns={columns}
          renderHeader={tableHead}
          pesanDataKosong={
            <PesanSKPDTabel selectedSKPD={selectedSKPD.toString()} />
          }
        />
      </div>
      {isPreview &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex flex-col bg-white overflow-auto'>
            <div className='border-b'>
              <div className='flex flex-row justify-between p-2'>
                <button
                  onClick={() => setIsPreview(false)}
                  className='text-3xl font-bold text-gray-800 hover:text-gray-300 transition-all'
                  aria-label='Tutup preview'
                >
                  <MdClose />
                </button>
                <InputButton
                  className='h-9'
                  onClick={() => {
                    if (data) {
                      const skpdLabel =
                        dataSKPDPeriode?.find(
                          (s) => s.id === Number(selectedSKPD),
                        )?.skpd_name ?? '';
                      toast.promise(exportRenstra(data, skpdLabel), {
                        loading: 'Sedang mengunduh...',
                        success: <b>Berhasil mengunduh.</b>,
                        error: <b>Gagal mengunduh.</b>,
                      });
                    } else {
                      toast.error(
                        `${!selectedSKPD ? 'SKPD dan' : ''} Tahun belum dipilih`,
                      );
                    }
                  }}
                >
                  <span className='inline-flex items-center gap-2 px-2'>
                    <MdPrint />
                    Cetak Excel
                  </span>
                </InputButton>
              </div>
            </div>
            <div className='p-2'>
              <RenstraPreviewTable
                data={data || []}
                skpd={
                  dataSKPDPeriode?.find((s) => s.id === Number(selectedSKPD))
                    ?.skpd_name ?? ''
                }
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RenstraTable;
