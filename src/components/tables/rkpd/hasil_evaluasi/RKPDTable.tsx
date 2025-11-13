import { Fragment, useEffect, useState } from 'react';
import InputButton from '../../../inputs/InputButton';
import toast from 'react-hot-toast';
import { exportRKPD } from '../../../../services/Excel/ExcelRKPD';
import { MdClose, MdPreview, MdPrint, MdRefresh } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import {
  flatRKPDTriwulan,
  getRKPDTriwulan,
  type FlatRKPDTriwulan,
} from '../../../../services/RKPDService';

import {
  getPeriodeAkhirFromCookie,
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
import { type ColumnDef } from '@tanstack/react-table';
import { createPortal } from 'react-dom';
import RKPDPreviewTable from './RKPDPreviewTable';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import { renderSatuan, renderUang } from '../../../../lib/helper';
import { getSKPDPerRKPD } from '../../../../services/PeriodeService';
import type { CatatanForm } from '../../../../services/CatatanService';
import DialogModal from '../../../inputs/DialogModal';
import FormCatatan from '../../../forms/FormCatatan';

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
    queryKey: ['tabel_rkpd_tahunan', selectedSKPD, 5],
    queryFn: async () => {
      const rawData = await getRKPDTriwulan(Number(selectedSKPD), 5);
      const flatData = flatRKPDTriwulan(rawData as any);
      return flatData;
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
            Target RPJMD Kabupaten/kota pada Tahun {getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={1} colSpan={2}>
            Realisasi Kinerja dan Anggaran RPJMD Kabupaten/kota s/d Tahun{` `}
            {getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={1} colSpan={2}>
            Tingkat Capaian Kinerja dan Realisasi Anggaran RPJMD Kabupaten/kota
            s/d Tahun {getPeriodeAkhirFromCookie()}
            <br />
            {`(%)`}
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

  const columns: ColumnDef<FlatRKPDTriwulan>[] = [
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
      header: 'Target Renstra Perangkat Daerah K',
      accessorKey: 'ind_target_akhir_periode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header: 'Target Renstra Perangkat Daerah RP',
      accessorKey: 'paguPeriode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 13
    {
      header:
        'Realisasi Kinerja dan Anggaran Renstra Perangkat Daerah s/d tahun 2030 K',
      accessorKey: 'total_capaian_periode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ row, getValue }) =>
        renderSatuan(getValue<number | null>(), row.original.ind_satuan),
    },
    {
      header:
        'Realisasi Kinerja dan Anggaran Renstra Perangkat Daerah s/d tahun 2030 RP',
      accessorKey: 'totalRealisasiPeriode',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderUang(getValue<number | null>()),
    },
    // 14
    {
      header:
        'Tingkat Capaian Kinerja Dan Realisasi Anggaran Renstra Perangkat Daerah s/d tahun (%) K',
      accessorKey: 'persen_capaian',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderSatuan(getValue<number | null>(), '%'),
    },
    {
      header:
        'Tingkat Capaian Kinerja Dan Realisasi Anggaran Renstra Perangkat Daerah s/d tahun (%) RP',
      accessorKey: 'persenRealisasi',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }) => renderSatuan(getValue<number | null>(), '%'),
    },
  ];

  const [mode, setMode] = useState<'close' | 'catatan' | 'preview'>('close');
  const [catatan, setCatatan] = useState<CatatanForm>({});

  useEffect(() => {
    if (mode === 'preview') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mode === 'preview']);

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
                  setMode('catatan');
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

      {mode === 'catatan' ? (
        <DialogModal
          widthLevel={6}
          title='Catatan'
          isOpen={mode === 'catatan'}
          onClose={() => {
            setMode('close');
          }}
        >
          <FormCatatan
            onPreview={() => setMode('preview')}
            type='rkpd'
            skpdPerId={Number(selectedSKPD)}
            setCatatan={setCatatan}
          />
        </DialogModal>
      ) : (
        mode === 'preview' &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex flex-col bg-white'>
            <div className='border-b'>
              <div className='flex flex-row justify-between p-2'>
                <button
                  onClick={() => setMode('close')}
                  className='text-3xl font-bold text-gray-800 hover:text-gray-300 transition-all'
                  aria-label='Tutup preview'
                >
                  <MdClose />
                </button>
                <InputButton
                  className='h-9'
                  onClick={() => {
                    if (data) {
                      toast.promise(
                        exportRKPD(
                          data as any,
                          listSKPDPeriode.find(
                            (item) => item.value === selectedSKPD,
                          )?.label ?? '',
                          catatan,
                        ),
                        {
                          loading: 'Sedang mengunduh...',
                          success: <b>Berhasil mengunduh.</b>,
                          error: <b>Gagal mengunduh.</b>,
                        },
                      );
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
              <RKPDPreviewTable
                data={data || []}
                catatan={catatan}
                skpd={
                  listSKPDPeriode.find((item) => item.value === selectedSKPD)
                    ?.label ?? ''
                }
              />
            </div>
          </div>,
          document.body,
        )
      )}
    </>
  );
};

export default RKPDTable;
