import { useEffect, useState } from 'react';
import Tabel from '../../Tabel';
import InputButton from '../../../inputs/InputButton';
import { MdClose, MdPreview, MdPrint, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import type { ColumnDef } from '@tanstack/react-table';
import { exportRPJMD } from '../../../../services/Excel/ExcelRPJMD';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeIDFromCookie,
  getUserSKPDID,
  isAdmin,
  isDev,
} from '../../../../lib/usercookie';

import RPJMDPreviewTable from './RPJMDPreviewTable';
import { createPortal } from 'react-dom';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import {
  flatRPJMD,
  getRPJMD,
  type FlatRPJMD,
} from '../../../../services/RPJMDService';
import Spinner from '../../../inputs/Spinner';
import { getSKPDPerRENSTRA } from '../../../../services/PeriodeService';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Sasaran</th>
        <th rowSpan={2}>Program Prioritas</th>
        <th rowSpan={2}>Indikator Kinerja</th>
        <th rowSpan={2}>Data Capaian pada Awal Tahun Perencanaan</th>
        <th colSpan={2}>Target pada Akhir Tahun Perencanaan</th>
        <th colSpan={2}>Capaian Pada Akhir Tahun Perencanaan</th>
        <th colSpan={2}>
          Rasio Capaian Akhir <br />
          (%)
        </th>
      </tr>
      <tr>
        <th>K</th>
        <th>Rp</th>
        <th>K</th>
        <th>Rp</th>
        <th>K</th>
        <th>Rp</th>
      </tr>
    </>
  );
};

const RPJMDTable = () => {
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
      const rawData = await getRPJMD(Number(selectedSKPD));
      const flatten = flatRPJMD(rawData);
      console.log(flatten);
      return flatten;
    },
    enabled: !!selectedSKPD,
  });
  //#endregion

  const columns: ColumnDef<FlatRPJMD>[] = [
    {
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Sasaran',
      accessorFn: () => '', // tetap kosong
    },
    {
      header: 'Program Prioritas',
      accessorFn: (row) => row.name ?? '',
    },
    {
      header: 'Indikator Kinerja',
      accessorFn: (row) => row.indikator_o_name || '',
    },
    {
      header: 'Data Capaian Awal',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_1 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Target Akhir (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_target_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Target Akhir (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.pagu_pagu_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Capaian Akhir (K)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_capaian_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Capaian Akhir (Rp)',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.pagu_realisasi_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Rasio Akhir (%) K',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.target_io_persen_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
    {
      header: 'Rasio Akhir (%) Rp',
      meta: {
        tdClassNames: 'text-center',
      },
      accessorFn: (row) => row.pagu_persen_5 ?? 0,
      cell: ({ row, getValue }) => {
        if (
          row.original.type === 'urusan' ||
          row.original.type === 'bidang' ||
          row.original.type === 'program'
        ) {
          return null;
        } else {
          return getValue();
        }
      },
    },
  ];

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
                const data = true;
                if (data && selectedSKPD) {
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
          data={data || []}
          columns={columns}
          renderHeader={tableHead}
          // renderBody={(table) => tableBody(table)}
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
                      toast.promise(exportRPJMD(data), {
                        loading: 'Sedang mengunduh...',
                        success: <b>Berhasil mengunduh.</b>,
                        error: <b>Gagal mengunduh.</b>,
                      });
                    } else {
                      toast.error(
                        `${!selectedSKPD ? 'SKPD' : ''} belum dipilih`,
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
              <RPJMDPreviewTable
                data={data || []}
                skpd={
                  listSKPDPeriode.find((item) => item.value === selectedSKPD)
                    ?.label ?? ''
                }
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RPJMDTable;
