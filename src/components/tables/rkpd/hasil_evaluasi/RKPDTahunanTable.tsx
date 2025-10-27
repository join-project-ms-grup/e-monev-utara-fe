import React, { useRef, useState } from 'react';
import InputButton from '../../../inputs/InputButton';
import toast from 'react-hot-toast';
import { exportRKPD } from '../../../../services/Excel/ExcelRKPDTahunan';
import { MdPrint, MdRefresh } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import {
  flattenRKPD,
  getRKPDTahunan,
  type FlatRKPDRow,
  type RKPDMasterTree,
} from '../../../../services/RKPDTahunanService';
import { getSKPDPeriode } from '../../../../services/PeriodeService';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import Tabel from '../../Tabel';
import Spinner from '../../../inputs/Spinner';
import RowExpand from '../../RowExpand';
import type { ColumnDef } from '@tanstack/react-table';

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
        <th rowSpan={2}>Perangkat Daerah Penanggung Jawab</th>
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

const RKPDTahunanTable = () => {
  //#region SKPD dan Tahun ke
  const [tahunKe, setTahunKe] = useState('');
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
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${i + 1}`,
    }),
  );
  //#endregion

  //#region RKPD Data Flatten
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['tabel_rkpd_tahunan', selectedSKPD, tahunKe],
    queryFn: async () => {
      const rawData = await getRKPDTahunan(Number(selectedSKPD), Number(tahunKe));
      const flatten = flattenRKPD(rawData);
      return flatten;
    },
    enabled: !!(selectedSKPD && tahunKe),
  });
  //#endregion

  // #region Kolom Tabel
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
      header: 'Urusan / Bidang / Program / Kegiatan / Sub Kegiatan',
    },
    {
      header: 'Indikator',
      accessorFn: (row) => row.indikator || [],
      meta: {
        tdClassNames: 'p-0!',
      },
      cell: ({ row, getValue }) => {
        const indikator = getValue() as FlatRKPDRow['indikator'];
        if (!indikator || indikator.length === 0) return '';
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
    {
      header: 'Target Akhir Tahun RPJM/Renstra',
      columns: [
        {
          id: 'fisik_akhir',
          header: 'Fisik',
          meta: {
            tdClassNames: 'p-0!',
          },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRKPDRow['indikator'];
            if (!indikator || indikator.length === 0) return '';
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
                          {i.target_akhir_periode}
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
          accessorFn: (row) => row.pagu?.paguPeriode ?? '',
        },
      ],
    },
    {
      header: 'Realisasi Kinerja RPJM/Renstra s.d Tahun sebelumnya',
      columns: [
        {
          id: 'fisik_sebelum',
          header: 'Fisik',
          meta: {
            tdClassNames: 'p-0!',
          },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRKPDRow['indikator'];
            if (!indikator || indikator.length === 0) return '';
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
                          {i.total_capaian_periode}
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
          accessorFn: (row) => row.pagu?.totalRealisasiPeriode ?? '',
        },
      ],
    },
    {
      header: 'Target Kinerja Tahun yang dievaluasi',
      columns: [
        {
          id: 'fisik_evaluasi',
          header: 'Fisik',
          meta: {
            tdClassNames: 'p-0!',
          },
          accessorFn: (row) => row.indikator || [],
          cell: ({ row, getValue }) => {
            const indikator = getValue() as FlatRKPDRow['indikator'];
            if (!indikator || indikator.length === 0) return '';
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
                          {i.target_tahun_dievaluasi}
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
          accessorFn: (row) => row.pagu?.paguTahunEval ?? '',
        },
      ],
    },
    {
      header: 'Perangkat Daerah Penanggung Jawab',
      cell: () => `${dataSKPDPeriode?.find(item => item.skpd_id === Number(selectedSKPD))?.name}`,
    },
  ];
  // #endregion

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
                onClear={() => {
                  setSelectedSKPD('');
                  setTahunKe('');
                }}
                withSearch
              />
            </div>
            <div>
              <label htmlFor='tahun_ke'>Tahun ke</label>
              <InputSearchBox
                id='tahun_ke'
                className='w-42 h-9'
                btnclassName='bg-white'
                placeholder='Pilih Tahun ke...'
                value={tahunKe}
                options={listTahunKe}
                onChange={(val) => setTahunKe(val)}
                onClear={() => setTahunKe('')}
                disabled={!selectedSKPD}
              />
            </div>
          </div>
          <div className='inline-flex gap-2'>
            <InputButton
              tooltip='Print'
              className='btn btn-theme w-9 h-9'
              onClick={async () => {
                if (data) {
                  toast.success('Printing...');
                  const tahunLabel = listTahunKe.find(
                    (t) => t.value === tahunKe,
                  )?.label ?? '';
                  const skpdLabel = dataSKPDPeriode?.find(
                    (s) => s.id === Number(selectedSKPD),
                  )?.name ?? '';
                  await exportRKPD(data, tahunLabel, skpdLabel);
                }
              }}
            >
              <MdPrint />
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
    </>
  );
};

export default RKPDTahunanTable;
