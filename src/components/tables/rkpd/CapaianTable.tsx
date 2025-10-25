import React, { useEffect, useState } from 'react';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import Tabel from '../Tabel';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../lib/usercookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSKPDPeriode } from '../../../services/PeriodeService';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import {
  addCapaian,
  getCapaian,
  type CapaianForm,
  type CapaianIndikator,
  type CapaianIndikatorCapaian,
  type CapaianMasterTree,
  type CapaianTriwulan,
} from '../../../services/CapaianService';
import type { ColumnDef } from '@tanstack/react-table';
import RowExpand from '../RowExpand';
import Spinner from '../../inputs/Spinner';
import AksiButton from '../../inputs/AksiButton';
import DialogModal from '../../inputs/DialogModal';
import FormCapaian from '../../forms/FormCapaian';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';

const tableHead = () => {
  return (
    <>
      {/* <tr>
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
        <th rowSpan={2}>Indikator</th>
        <th rowSpan={2}>Satuan</th>
        <th rowSpan={2}>Aksi</th>
      </tr> */}
      <tr>
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
        <th rowSpan={2}>Indikator</th>
        <th rowSpan={2}>Satuan</th>
        <th rowSpan={2}>Target</th>
        <th colSpan={6}>Capaian</th>
        <th rowSpan={2}>Aksi</th>
      </tr>
      <tr>
        <th>Triwulan I</th>
        <th>Triwulan II</th>
        <th>Triwulan III</th>
        <th>Triwulan IV</th>
        <th>Total</th>
        <th>(%)</th>
      </tr>
    </>
  );
};

const CapaianTable = () => {
  const queryClient = useQueryClient();
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

  //#region Modal, FormData & Tabel Data
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['tabel_capaian', selectedSKPD, tahunKe],
    queryFn: async () => getCapaian(Number(selectedSKPD), Number(tahunKe)),
    enabled: !!(selectedSKPD && tahunKe),
  });
  // Modal
  const [openModal, setOpenModal] = useState(false);
  // Form Data
  const initialFormData: CapaianForm = {
    indikator_name: '',
    id_rincian: 0,
    capaian: [
      { triwulan: 1, capaian: 0 },
      { triwulan: 1, capaian: 0 },
      { triwulan: 1, capaian: 0 },
      { triwulan: 1, capaian: 0 },
    ],
  };
  const [formData, setFormData] = useState<CapaianForm>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      console.log('RealisasiTable.tsx', formData);
    }
  }, [openModal]);
  //#endregion

  //#region Mutasi
  const [loadingMutation, setLoadingMutation] = useState(false);
  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: CapaianForm) => {
      setLoadingMutation(true);
      return addCapaian({
        id_rincian: Number(payload.id_rincian),
        capaian: payload.capaian?.slice(0, 4).map((t) => ({
          capaian: Number(t.capaian),
          triwulan: Number(t.triwulan),
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_capaian'] });
      setFormData(initialFormData);
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  //#endregion

  // #region Kolom Tabel
  const subRows = (row: CapaianMasterTree) =>
    row.bidang ?? row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const columns: ColumnDef<CapaianMasterTree>[] = [
    {
      accessorKey: 'name',
      header: 'Urusan / Bidang / Program / Kegiatan / Sub Kegiatan',
      cell: (ctx) => {
        let currentRow: any = ctx.row;
        const kodeArray: string[] = [];
        while (currentRow) {
          kodeArray.unshift(currentRow.original.kode);
          currentRow = currentRow.getParentRow?.();
        }

        return (
          <div
            className='inline-flex gap-2'
            style={{ paddingLeft: `${ctx.row.depth * 1}rem` }}
          >
            <RowExpand showValue={false} {...ctx} />
            <span className='font-bold'>{`[${kodeArray.join('.')}] `}</span>
            {ctx.getValue<string>()}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.indikator,
      header: 'Indikator',
      meta: {
        tdClassNames: 'p-0!',
      },
      cell: ({ getValue }) => {
        const indikatorList = getValue() as CapaianIndikator[];
        if (!indikatorList || indikatorList.length === 0) return null;

        return (
          <>
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((item) => (
                    <tr key={item.id}>
                      <td className='block overflow-y-auto h-[70px]'>
                        {item.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      },
    },
    {
      accessorFn: (row) => row.indikator,
      header: 'Satuan',
      meta: {
        tdClassNames: 'p-0! flex flex-col',
      },
      cell: ({ getValue }) => {
        const indikatorList = getValue() as CapaianIndikator[];
        if (!indikatorList || indikatorList.length === 0) return null;

        return (
          <>
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((item) => (
                    <tr key={item.id}>
                      <td className='block overflow-y-auto h-[70px]'>
                        {item.satuan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      },
    },
    {
      accessorFn: (row) => row.indikator,
      header: 'Target',
      meta: {
        tdClassNames: 'p-0!',
      },
      cell: ({ getValue }) => {
        const indikatorList = getValue() as CapaianIndikator[];
        if (!indikatorList || indikatorList.length === 0) return null;

        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((item) => {
                  const targetValue = Array.isArray(item.target)
                    ? (item.target[0]?.target ?? '-')
                    : '-';

                  return (
                    <tr key={item.id}>
                      <td className='block overflow-y-auto h-[70px]'>
                        {targetValue}
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
      header: 'Capaian Triwulan',
      meta: { tdClassNames: 'text-center' },
      columns: [1, 2, 3, 4].map((triwulan) => ({
        id: `triwulan_${triwulan}`,
        header: `Triwulan ${triwulan}`,
        meta: { tdClassNames: 'text-center p-0!' },
        cell: ({ row }) => {
          const indikatorList = row.original.indikator ?? [];
          if (!indikatorList.length) return '\u00A0';

          return (
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((indikator: CapaianIndikator) => {
                    const capaianValue =
                      indikator.capaian?.capaianTriwulan?.find(
                        (t) => t.triwulan === triwulan,
                      )?.capaian;
                    return (
                      <tr key={indikator.id}>
                        <td className='block overflow-y-auto h-[70px] text-center'>
                          {capaianValue ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        },
      })),
    },
    {
      header: 'Capaian Total',
      id: 'capaianTotal',
      meta: { tdClassNames: 'text-center p-0!' },
      cell: ({ row }) => {
        const indikatorList = row.original.indikator ?? [];
        if (!indikatorList.length) return '\u00A0';

        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((indikator: CapaianIndikator) => (
                  <tr key={indikator.id}>
                    <td className='block overflow-y-auto h-[70px] text-center font-bold'>
                      {indikator.capaian?.capaianTotal ?? '-'}
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
      header: 'Capaian Persen',
      id: 'perseCapaian',
      meta: { tdClassNames: 'text-center p-0!' },
      cell: ({ row }) => {
        const indikatorList = row.original.indikator ?? [];
        if (!indikatorList.length) return '\u00A0';

        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((indikator: CapaianIndikator) => (
                  <tr key={indikator.id}>
                    <td className='block overflow-y-auto h-[70px] text-center font-bold'>
                      {indikator.capaian?.perseCapaian != null
                        ? Math.floor(
                            Number(indikator.capaian.perseCapaian) * 100,
                          ) / 100
                        : '-'}
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
      header: 'Aksi',
      meta: { tdClassNames: 'p-0!' },
      cell: ({ row }) => {
        const data = row.original;
        const indikatorList = data.indikator as CapaianIndikator[];
        if (!indikatorList || indikatorList.length === 0) return null;

        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((item) => (
                  <tr key={item.id}>
                    <td className='block overflow-y-auto h-[70px]'>
                      <AksiButton
                        Icon={MdEdit}
                        tooltip='Ubah'
                        onClick={() => {
                          const matchedTarget = item.target?.find(
                            (t) => Number(t.tahun_ke) === Number(tahunKe),
                          );

                          const id_rincian =
                            matchedTarget?.id_rincian ??
                            item.target?.[0]?.id_rincian ??
                            item.id ??
                            undefined;

                          const capaianObj =
                            (Array.isArray(item.capaian)
                              ? item.capaian[0]
                              : item.capaian) ??
                            ({} as CapaianIndikatorCapaian);

                          const capaian =
                            capaianObj.capaianTriwulan?.map(
                              (tw: CapaianTriwulan) => ({
                                triwulan: tw.triwulan,
                                capaian: tw.capaian ?? 0,
                              }),
                            ) ?? [];

                          setFormData({
                            indikator_name: item.name ?? '',
                            id_rincian,
                            capaian,
                          });

                          setOpenModal(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
    },
  ];
  // #endregion

  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${i + 1}`,
    }),
  );

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
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
        <div className='flex justify-end items-end gap-2'>
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
        data={data || []}
        columns={columns}
        subRows={subRows}
        renderHeader={tableHead}
        tblClassName='lg:min-w-[1500px]'
        initialExpanded
      />
      <DialogModal
        title='Tambah data Realisasi'
        isOpen={openModal}
        onClose={() => {
          setFormData(initialFormData);
          setOpenModal(false);
        }}
      >
        <FormCapaian
          defaultValues={formData}
          onSubmit={(data: CapaianForm) => {
            console.log('Data dari form modal:', data);
            addMutation.mutate({
              id_rincian: data.id_rincian,
              capaian: data.capaian,
            });
          }}
        >
          <div className='flex gap-2 justify-end'>
            <InputButton
              type='submit'
              className='btn btn-theme w-24'
              isLoading={loadingMutation}
            >
              Simpan
            </InputButton>
          </div>
        </FormCapaian>
      </DialogModal>
    </div>
  );
};

export default CapaianTable;
