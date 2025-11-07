import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { MdRefresh } from 'react-icons/md';
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
  getCapaianFlat,
  type CapaianForm,
  type CapaianIndikator,
  type CapaianMaster,
} from '../../../services/CapaianService';
import type { ColumnDef } from '@tanstack/react-table';
import Spinner from '../../inputs/Spinner';
import DialogModal from '../../inputs/DialogModal';
import FormCapaian from '../../forms/FormCapaian';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';
import InputText from '../../inputs/InputText';
import PesanSKPDTabel from '../../PesanSKPDTabel';
import { formatRibu } from '../../../lib/helper';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2} colSpan={5} className='w-[50px]'>
          Kode
        </th>
        <th rowSpan={2} className='w-[20%]'>
          Urusan / Bidang / Program / Kegiatan / Sub Kegiatan
        </th>
        <th rowSpan={2} className='w-[25%]'>
          Indikator
        </th>
        <th rowSpan={2} className='w-[150px]'>
          Satuan
        </th>
        <th rowSpan={2}>Target</th>
        <th colSpan={6}>Capaian</th>
      </tr>
      <tr>
        {['Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV'].map((tri) => (
          <th key={tri} rowSpan={1} className='w-[150px]'>
            {tri}
          </th>
        ))}
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
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  //#region Modal, FormData & Tabel Data
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_capaian', selectedSKPD, tahunKe],
    queryFn: async () => getCapaianFlat(Number(selectedSKPD), Number(tahunKe)),
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
  const rowHeights = useRef<{ [key: string]: number[] }>({});
  const columns: ColumnDef<CapaianMaster & { depth: number }>[] = [
    {
      id: 'kode',
      columns: ['Urusan', 'Bidang', 'Program', 'Kegiatan', 'Sub Kegiatan'].map(
        (label, index) => ({
          id: `kode_${label}`,
          meta: {
            tdClassNames: 'w-[30px]',
          },
          accessorFn: (row) => row.kodeFull?.[index],
          cell: ({ getValue }) => {
            const value = getValue();
            return value ?? '';
          },
        }),
      ),
    },
    {
      accessorKey: 'name',
      cell: ({ getValue, row }) => {
        const typeBold = ['urusan', 'bidang'];
        const isBold = !!typeBold.find((item) => item === row.original.type);
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
      accessorFn: (row) => row.indikator,
      header: 'Indikator',
      meta: {
        tdClassNames: 'p-0!',
      },
      cell: ({ row, getValue }) => {
        const indikatorList = getValue() as CapaianIndikator[];
        if (!indikatorList || indikatorList.length === 0) return null;
        const isEven = row.index % 2 === 1;
        const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';
        return (
          <>
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((item, index) => (
                    <tr key={item.id} className={bgClass}>
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
        tdClassNames: 'p-0!',
      },
      cell: ({ row, getValue }) => {
        const indikatorList = getValue() as CapaianIndikator[];
        if (!indikatorList || indikatorList.length === 0) return null;
        const isEven = row.index % 2 === 1;
        const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';
        return (
          <>
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((item, index) => (
                    <tr key={item.id} className={bgClass}>
                      <td
                        style={{
                          height: rowHeights.current[row.id]?.[index] || 'auto',
                        }}
                        className='text-center'
                      >
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
        tdClassNames: 'text-center p-0!',
      },
      cell: ({ row, getValue }) => {
        const indikatorList = getValue() as CapaianIndikator[];
        if (!indikatorList || indikatorList.length === 0) return null;
        const isEven = row.index % 2 === 1;
        const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';
        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((item, index) => {
                  const targetValue = Array.isArray(item.target)
                    ? (item.target[0]?.target ?? '-')
                    : '-';

                  return (
                    <tr key={item.id} className={bgClass}>
                      <td
                        style={{
                          height: rowHeights.current[row.id]?.[index] || 'auto',
                        }}
                      >
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
      // meta: { tdClassNames: 'text-center' },
      columns: [1, 2, 3, 4].map((triwulan) => ({
        id: `triwulan_${triwulan}`,
        header: `Triwulan ${triwulan}`,
        meta: { tdClassNames: 'text-center p-0!' },
        cell: ({ row }) => {
          const indikatorList = row.original.indikator ?? [];
          if (!indikatorList.length) return '\u00A0';
          const isEven = row.index % 2 === 1;
          const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';

          return (
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((item, index) => {
                    const initialValue =
                      item.capaian?.capaianTriwulan?.find(
                        (t) => t.triwulan === triwulan,
                      )?.capaian ?? 0;

                    const [capaian, setCapaian] = useState(initialValue);
                    const [disBtn, setDisBtn] = useState(true);

                    const handleChange = (
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      const newValue = e.target.value;
                      setCapaian(Number(newValue));
                      setDisBtn(Number(newValue) === Number(initialValue));
                    };

                    const handleSubmit = (
                      e: React.FormEvent<HTMLFormElement>,
                    ) => {
                      e.preventDefault();

                      const id_rincian =
                        item.target?.find(
                          (t) => Number(t.tahun_ke) === Number(triwulan),
                        )?.id_rincian ??
                        item.target?.[0]?.id_rincian ??
                        item.id;

                      const mappedTriwulan = item.capaian?.capaianTriwulan?.map(
                        (tw) =>
                          tw.triwulan === triwulan
                            ? { ...tw, capaian: Number(capaian) }
                            : tw,
                      ) || [{ triwulan, capaian: Number(capaian) }];

                      addMutation.mutate({
                        id_rincian,
                        capaian: mappedTriwulan,
                      });
                    };

                    return (
                      <tr key={item.id} className={bgClass}>
                        <td
                          style={{
                            height:
                              rowHeights.current[row.id]?.[index] || 'auto',
                          }}
                        >
                          {row.original.depth === 4 && (
                            <form onSubmit={handleSubmit}>
                              <InputText
                                id={`input_capaian_${item.id}_${triwulan}`}
                                inputMode='numeric'
                                type='text'
                                placeholder='0'
                                value={capaian}
                                onChange={handleChange}
                                withButton={!disBtn}
                                buttonType='submit'
                                tooltip={formatRibu(capaian)}
                                isRibu
                              />
                            </form>
                          )}
                          {row.original.depth !== 4 && (
                            <span>{formatRibu(capaian)}</span>
                          )}
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
        const isEven = row.index % 2 === 1;
        const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';
        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((item, index) => (
                  <tr key={item.id} className={bgClass}>
                    <td
                      style={{
                        height: rowHeights.current[row.id]?.[index] || 'auto',
                      }}
                    >
                      {formatRibu(item.capaian?.capaianTotal ?? 0)}
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
        const isEven = row.index % 2 === 1;
        const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';
        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((item, index) => (
                  <tr key={item.id} className={bgClass}>
                    <td
                      style={{
                        height: rowHeights.current[row.id]?.[index] || 'auto',
                      }}
                    >
                      {item.capaian?.perseCapaian != null
                        ? Math.floor(Number(item.capaian.perseCapaian) * 100) /
                          100
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
  ];
  // #endregion

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
            {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
          </InputButton>
        </div>
      </div>
      <Tabel
        data={data || []}
        columns={columns}
        renderHeader={tableHead}
        tblClassName={`${selectedSKPD && data && 'lg:min-w-[2500px]'}`}
        pesanDataKosong={
          <PesanSKPDTabel
            selectedSKPD={selectedSKPD}
            tahun={tahunKe}
            butuhTahun
          />
        }
        
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
