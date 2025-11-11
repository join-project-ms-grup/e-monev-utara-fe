import { Fragment, useEffect, useState } from 'react';
import InputButton from '../../../inputs/InputButton';
import toast from 'react-hot-toast';
import { exportRKPD } from '../../../../services/Excel/ExcelRKPD';
import { MdClose, MdPreview, MdPrint, MdRefresh } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import {
  flatRKPD,
  flatRKPDNew,
  getRKPD,
  type FlatRKPD,
  type FlatRKPDNew,
} from '../../../../services/RKPDService';

import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getUserSKPDID,
  isAdmin,
  isDev,
} from '../../../../lib/usercookie';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import Tabel from '../../Tabel';
import Spinner from '../../../inputs/Spinner';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { createPortal } from 'react-dom';
import RKPDPreviewTable from './RKPDPreviewTable';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import { formatUang, renderUang } from '../../../../lib/helper';
import { getSKPDPerRKPD } from '../../../../services/PeriodeService';

const RKPDTable = () => {
  //#region SKPD dan Tahun ke
  const userSKPDID = getUserSKPDID();
  const [selectedSKPD, setSelectedSKPD] = useState(userSKPDID ?? '');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPerRKPD(Number(getPeriodeIDFromCookie())),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  //#region RKPD Data Flatten
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['tabel_rkpd_tahunan', selectedSKPD],
    queryFn: async () => {
      const raw = await getRKPD(Number(selectedSKPD));
      const flat = flatRKPDNew(raw);
      return flat;
    },
    enabled: !!selectedSKPD,
  });
  //#endregion

  //#region Head Tabel
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
            Indikator Kinerja Program (Outcome)/ Kegiatan (output)
          </th>
          <th rowSpan={1} colSpan={2}>
            Target RPJMD Kabupaten/kota pada Tahun {akhirPeriode}
          </th>
          <th rowSpan={1} colSpan={2}>
            Realisasi Capaian Kinerja RPJMD Kabupaten/kota sampai dengan RKPD
            Kabupaten/kota Tahun Lalu <br />
            (n-2)
          </th>
          <th rowSpan={1} colSpan={2}>
            Target Kinerja dan Anggaran RKPD Kabupaten/kota Tahun Berjalan
            (Tahun n-1) yang Dievaluasi
          </th>
        </tr>
        <tr>
          {Array.from({ length: 3 }, (_, i) => (
            <Fragment key={i}>
              <th className='w-[200px]'>Fisik</th>
              <th className='w-[200px]'>Rp.</th>
            </Fragment>
          ))}
        </tr>
      </>
    );
  };
  //#endregion

  const mulaiPeriode = getPeriodeMulaiFromCookie();
  const akhirPeriode = getPeriodeAkhirFromCookie();
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
                  onClear={() => {
                    setSelectedSKPD('');
                  }}
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
                  toast.error(
                    `${!selectedSKPD ? 'SKPD dan' : ''} Tahun belum dipilih`,
                  );
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
                      toast.promise(exportRKPD(data as any), {
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
              <RKPDPreviewTable data={data || []} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RKPDTable;
