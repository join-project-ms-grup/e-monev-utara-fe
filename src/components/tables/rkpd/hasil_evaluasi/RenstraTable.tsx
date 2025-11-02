import { useEffect, useRef, useState, type ReactNode } from 'react';
import InputButton from '../../../inputs/InputButton';
import toast from 'react-hot-toast';
import { MdClose, MdPreview, MdPrint, MdRefresh } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getSKPDPeriode } from '../../../../services/PeriodeService';
import { getPeriodeIDFromCookie } from '../../../../lib/usercookie';
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

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Sasaran</th>
        <th rowSpan={2}>Kode</th>
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
        <th rowSpan={2}>Indikator</th>
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
        <th>Fisik</th>
        <th>Rp.</th>
        <th>Fisik</th>
        <th>Rp.</th>
        <th>Fisik</th>
        <th>Rp.</th>
      </tr>
    </>
  );
};

const RenstraTable = () => {
  //#region SKPD dan Tahun ke
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPeriode(Number(getPeriodeIDFromCookie())),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `[${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion
  //#region List data periode
  // const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  // const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  // const listTahunKe = Array.from(
  //   { length: tahunAkhir - tahunMulai + 1 },
  //   (_, i) => ({
  //     label: `${tahunMulai + i}`,
  //     value: `${i + 1}`,
  //   }),
  // );
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
          meta: { tdClassNames: 'p-0!' },
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
                        >
                          {i.totalTarget}
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
          accessorFn: (row) => row.pagu?.totalPagu,
          cell: ({ getValue }) => `${getValue() ? getValue() : ''}`,
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
          meta: { tdClassNames: 'p-0!' },
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
                      return (
                        <tr key={i.id} className={bgClass}>
                          <td
                            style={{
                              height:
                                rowHeights.current[row.id]?.[index] || 'auto',
                            }}
                          >
                            {capaianSebelum || 0}
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
          accessorFn: (row) =>
            row.pagu?.realisasi_per_tahun
              ?.filter((r) => Number(r.tahun_ke) < 5)
              .reduce((sum, r) => sum + (Number(r.realisasi) || 0), 0) ?? '',
          cell: ({ getValue }) => `${getValue() ? getValue() : ''}`,
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
          meta: { tdClassNames: 'p-0!' },
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
                      return (
                        <tr key={i.id} className={bgClass}>
                          <td
                            style={{
                              height:
                                rowHeights.current[row.id]?.[index] || 'auto',
                            }}
                          >
                            {targetEvaluasi?.target ?? 0}
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
          accessorFn: (row) =>
            row.pagu?.pagu_per_tahun?.find((p) => Number(p.tahun_ke) === 5)
              ?.pagu ?? '',
          cell: ({ getValue }) => `${getValue() ? getValue() : ''}`,
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
          </div>
          <div className='inline-flex gap-2'>
            <InputButton
              tooltip='Lihat tabel penuh'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                if (data) {
                  setIsPreview(true);
                } else {
                  toast.error(`${!selectedSKPD ? 'SKPD' : ''} belum diisi`);
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
              {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />}
            </InputButton>
          </div>
        </div>
        <Tabel
          tblClassName='lg:min-w-[1500px]'
          data={data || []}
          columns={columns}
          renderHeader={tableHead}
        />
      </div>
      {isPreview &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex flex-col bg-white overflow-auto'>
            <div className='p-2'>
              <RenstraPreviewTable
                onCetak={() => {
                  if (data) {
                    const skpdLabel =
                      dataSKPDPeriode?.find(
                        (s) => s.id === Number(selectedSKPD),
                      )?.name ?? '';
                    toast.promise(exportRenstra(data, skpdLabel), {
                      loading: 'Sedang mengunduh...',
                      success: <b>Berhasil mengunduh.</b>,
                      error: <b>Gagal mengunduh.</b>,
                    });
                  } else {
                    toast.error(
                      `${!selectedSKPD ? 'SKPD dan' : ''} Tahun belum diisi`,
                    );
                  }
                }}
                onClose={() => setIsPreview(false)}
                data={data || []}
                skpd={
                  dataSKPDPeriode?.find((s) => s.id === Number(selectedSKPD))
                    ?.name ?? ''
                }
              />
            </div>
          </div>,
          document.body,
        )}
      {/* {isPreview &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex items-end justify-center bg-white'>
            <div className='flex flex-col space-y-2 overflow-y-auto md:h-[100vh]'>
              <div className='inline-flex justify-between items-center mt-2 px-2'>
                <InputButton
                  className='h-9'
                  onClick={async () => {
                    if (data) {
                      const skpdLabel =
                        dataSKPDPeriode?.find(
                          (s) => s.id === Number(selectedSKPD),
                        )?.name ?? '';
                      toast.promise(exportRenstra(data, skpdLabel), {
                        loading: 'Sedang mengunduh...',
                        success: <b>Berhasil mengunduh.</b>,
                        error: <b>Gagal mengunduh.</b>,
                      });
                    } else {
                      toast.error(
                        `${!selectedSKPD ? 'SKPD dan' : ''} Tahun belum diisi`,
                      );
                    }
                  }}
                >
                  <span className='inline-flex items-center gap-2 px-2'>
                    <MdPrint />
                    Cetak Excel
                  </span>
                </InputButton>
                <button
                  onClick={() => setIsPreview(false)}
                  className='text-3xl font-bold text-gray-800 hover:text-gray-300 transition-all'
                  aria-label='Tutup preview'
                >
                  <MdClose />
                </button>
              </div>
              <div className=''>
                <RenstraPreviewTable
                  data={data || []}
                  skpd={
                    dataSKPDPeriode?.find((s) => s.id === Number(selectedSKPD))
                      ?.name ?? ''
                  }
                />
              </div>
            </div>
          </div>,
          document.body,
        )} */}
    </>
  );
};

export default RenstraTable;
