import React, { useEffect, useState } from 'react';
import Tabel from '../../Tabel';
import InputButton from '../../../inputs/InputButton';
import { MdPreview, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import type { ColumnDef } from '@tanstack/react-table';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
} from '../../../../lib/usercookie';
import { getSKPDPeriode } from '../../../../services/PeriodeService';
import { createPortal } from 'react-dom';
import RenjaPreviewTable from './RenjaPreviewTable';
import { exportRenja } from '../../../../services/Excel/ExcelRenja';

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
        <th colSpan={2}>
          Target Renstra Perangkat Daerah pada Tahun{' '}
          {getPeriodeAkhirFromCookie()}
        </th>
        <th colSpan={2}>
          Realisasi Capaian Kinerja Renstra Perangkat Daerah sampai dengan Renja
          Perangkat Daerah Tahun Lalu
          <br />
          (n-2)
        </th>
        <th colSpan={2}>
          Target Kinerja dan Anggaran Renja Perangkat Daerah Tahun berjalan
          (Tahun n-1) yang dievaluasi
        </th>
        <th colSpan={2}>
          Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang
          dievaluasi
        </th>
      </tr>
      <tr>
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            <th>K</th>
            <th>Rp.</th>
          </React.Fragment>
        ))}
      </tr>
    </>
  );
};

const RenjaTable = () => {
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

  const columns: ColumnDef<any>[] = Array.from({ length: 11 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

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
                const data = true;
                if (data && selectedSKPD) {
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
              //   onClick={() => refetch()}
              //   disabled={isFetching}
            >
              {/* {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />} */}
              <MdRefresh />
            </InputButton>
          </div>
        </div>
        <Tabel data={[]} columns={columns} renderHeader={tableHead} />
      </div>
      {isPreview &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex flex-col bg-white overflow-auto'>
            <div className='p-2'>
              <RenjaPreviewTable
                data={[]}
                skpd={
                  dataSKPDPeriode?.find(
                    (item) => item.id === Number(selectedSKPD),
                  )?.name ?? ''
                }
                onCetak={() => {
                  const data = true;
                  if (data) {
                    const skpdLabel =
                      dataSKPDPeriode?.find(
                        (s) => s.id === Number(selectedSKPD),
                      )?.name ?? '';
                    toast.promise(exportRenja([], skpdLabel), {
                      loading: 'Sedang mengunduh...',
                      success: <b>Berhasil mengunduh.</b>,
                      error: <b>Gagal mengunduh.</b>,
                    });
                  } else {
                    toast.error(`${!selectedSKPD ? 'SKPD' : ''} belum diisi`);
                  }
                }}
                onClose={() => setIsPreview(false)}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RenjaTable;
