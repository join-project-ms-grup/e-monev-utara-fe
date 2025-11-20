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
import Spinner from '../../../inputs/Spinner';
import { getSKPDPerRENSTRA } from '../../../../services/PeriodeService';
import {
  flatRPJMDNew,
  getRPJMDNew,
  type FlatRenstraNew,
} from '../../../../services/RenstraService';
import { renderSatuan, renderUang } from '../../../../lib/helper';
import type { CatatanForm } from '../../../../services/CatatanService';
import FormCatatan from '../../../forms/FormCatatan';
import DialogModal from '../../../inputs/DialogModal';

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
    queryKey: ['tabel_renstra', selectedSKPD, 5],
    queryFn: async () => {
      const rawData = await getRPJMDNew(Number(selectedSKPD));
      const flatData = flatRPJMDNew(rawData as any);
      return flatData;
    },
    enabled: !!selectedSKPD,
  });

  //#endregion

  const columns: ColumnDef<FlatRenstraNew>[] = [
    {
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Sasaran',
    },
    {
      header: 'name',
      cell: ({ row }) => (
        <>
          <p>{row.original.name}</p>
          {row.original.ind_name ? (
            <p>
              <br />({row.original.ind_name})
            </p>
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      accessorKey: 'ind_name',
    },
    {
      accessorKey: 'target_capaian_1',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    //
    {
      accessorKey: 'target_target_5',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'pagu_pagu_5',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ getValue }: any) => renderUang(getValue() as number | null),
    },
    //
    {
      accessorKey: 'target_capaian_5',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'pagu_realisasi_5',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ getValue }: any) => renderUang(getValue() as number | null),
    },
    //
    {
      accessorKey: 'target_persen_5',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }: any) =>
        renderSatuan(getValue() as number | null, '%'),
    },
    {
      accessorKey: 'pagu_persen_5',
      meta: {
        tdClassNames: 'whitespace-nowrap text-center',
      },
      cell: ({ getValue }: any) =>
        renderSatuan(getValue() as number | null, '%'),
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
                if (data && selectedSKPD) {
                  setMode('catatan');
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
            type='rpjmd'
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
                        exportRPJMD(
                          data,
                          catatan,
                          listSKPDPeriode.find(
                            (item) => item.value === selectedSKPD,
                          )?.label ?? '',
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
              <RPJMDPreviewTable
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

export default RPJMDTable;
