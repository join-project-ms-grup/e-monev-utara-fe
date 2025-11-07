import { useEffect, useState } from 'react';
import Tabel from '../../Tabel';
import InputButton from '../../../inputs/InputButton';
import { MdClose, MdPreview, MdPrint, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import type { ColumnDef, Table } from '@tanstack/react-table';
import { exportRPJMD } from '../../../../services/Excel/ExcelRPJMD';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import { getPeriodeIDFromCookie } from '../../../../lib/usercookie';
import { getSKPDPeriode } from '../../../../services/PeriodeService';
import RPJMDPreviewTable from './RPJMDPreviewTable';
import { createPortal } from 'react-dom';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import {
  flatRPJMD,
  getRPJMD,
  type FlatRPJMDFull,
} from '../../../../services/RPJMDService';
import Spinner from '../../../inputs/Spinner';

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
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPeriode(Number(getPeriodeIDFromCookie())),
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
      return flatten;
    },
    enabled: !!selectedSKPD,
  });
  //#endregion

  const tableBody = (table: Table<FlatRPJMDFull>) => {
    const rowModel = table.getRowModel();
    const { pageIndex, pageSize } = table.getState().pagination ?? {
      pageIndex: 0,
      pageSize: 10,
    };

    let counter = pageIndex * pageSize + 1;

    return (
      <>
        {rowModel.rows.map((row) => {
          const item = row.original;

          return (
            <tr
              key={`${item.rpjmd_kode}-${item.program_kode}-${item.outcome_name}`}
              className='text-center'
            >
              <td>{counter++}</td>
              <td className='text-left'>{item.outcome_name}</td>
              <td className='text-left'>{item.program_name}</td>
              <td className='text-left'>{item.indikator_name}</td>
              <td>{item.target_1 ?? '-'}</td>{' '}
              {/* Data Capaian Awal Tahun Perencanaan */}
              <td>{item.target_5 ?? '-'}</td> {/* Target K */}
              <td>{item.pagu_5 ?? '-'}</td> {/* Target Rp */}
              <td>{item.capaian_5 ?? '-'}</td> {/* Capaian K */}
              <td>{item.realisasi_5 ?? '-'}</td> {/* Capaian Rp */}
              <td>{item.persen_5 ?? '-'}</td> {/* Rasio Capaian K */}
              <td>{item.persen_pagu_5 ?? '-'}</td> {/* Rasio Capaian Rp */}
            </tr>
          );
        })}
      </>
    );
  };

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
          renderBody={(table) => tableBody(table)}
          pesanDataKosong={<PesanSKPDTabel selectedSKPD={selectedSKPD} />}
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
                    const data = true;
                    if (data) {
                      toast.promise(exportRPJMD([]), {
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
              <RPJMDPreviewTable data={[]} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RPJMDTable;
