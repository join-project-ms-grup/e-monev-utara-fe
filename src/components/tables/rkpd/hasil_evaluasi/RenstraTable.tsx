import { Fragment, useEffect, useState } from 'react';
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
  flatRenstraNew,
  getRenstraNew,
  type FlatRenstraNew,
} from '../../../../services/RenstraService';
import { createPortal } from 'react-dom';
import RenstraPreviewTable from './RenstraPreviewTable';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import { getSKPDPerRENSTRA } from '../../../../services/PeriodeService';
import { renderSatuan, renderUang } from '../../../../lib/helper';

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
          Realisasi Kinerja Akhir Tahun RPJM/Renstra
        </th>
        <th rowSpan={1} colSpan={2}>
          Rasio Capaian Akhir Tahun RPJM/Renstra
        </th>
      </tr>
      <tr>
        {Array.from({ length: 3 }, (_, i) => (
          <Fragment key={i} >
            <th key={i} className='w-[200px]'>
              Fisik
            </th>
            <th key={i + 1} className='w-[200px]'>
              Rp.
            </th>
          </Fragment>
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
    queryKey: ['tabel_renstra', selectedSKPD, 5],
    queryFn: async () => {
      const rawData = await getRenstraNew(Number(selectedSKPD));
      const flatData = flatRenstraNew(rawData as any);
      return flatData;
    },
    enabled: !!selectedSKPD,
  });
  //#endregion

  // #region Kolom Tabel
  const columns: ColumnDef<FlatRenstraNew>[] = [
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
      header: 'name',
      cell: ({ row }) => (
        <>
          <p>{row.original.name}</p>
          <br />
          {row.original.ind_name ? <p>({row.original.ind_name})</p> : ''}
        </>
      ),
    },
    {
      accessorKey: 'ind_name',
    },
    //
    {
      header: 'target K',
      accessorKey: 'target_target_5',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      header: 'target Rp',
      accessorKey: 'pagu_pagu_5',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ getValue }: any) => renderUang(getValue() as number | null),
    },
    //
    {
      header: 'realisasi K',
      accessorKey: 'target_capaian_5',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      header: 'realisasi Rp',
      accessorKey: 'pagu_realisasi_5',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ getValue }: any) => renderUang(getValue() as number | null),
    },
    //
    {
      header: 'rasio K',
      accessorKey: 'target_persen_5',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }: any) =>
        renderSatuan(getValue() as number | null, '%'),
    },
    {
      header: 'rasio Rp',
      accessorKey: 'pagu_persen_5',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }: any) =>
        renderSatuan(getValue() as number | null, '%'),
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
          <div className='fixed inset-0 z-[9999] flex flex-col bg-white'>
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
            <div className='p-2 overflow-auto'>
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
