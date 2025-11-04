import { type ColumnDef } from '@tanstack/react-table';
import { MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import Tabel from '../Tabel';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../lib/usercookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../inputs/Spinner';
import { useRef, useState, type ReactNode } from 'react';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';
import {
  getIndikatorFlat,
  updateIndikator,
  type Indikator,
  type IndikatorForm,
  type IndikatorMaster,
  type IndikatorTarget,
} from '../../../services/IndikatorService';
import { getSKPDPeriode } from '../../../services/PeriodeService';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import InputText from '../../inputs/InputText';
import PesanSKPDTabel from '../../PesanSKPDTabel';
import { formatRibu } from '../../../lib/helper';

const IndikatorTable = () => {
  const queryClient = useQueryClient();
  //#region SKPD
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
  // #region Modal, FormData & Tabel Data
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_indikator', selectedSKPD],
    queryFn: async () => getIndikatorFlat(Number(selectedSKPD)),
    enabled: !!selectedSKPD,
  });
  // #endregion

  // #region Mutasi
  const [loadingMutation, setLoadingMutation] = useState(false);
  // Update
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: IndikatorForm;
    }) => {
      setLoadingMutation(true);
      return updateIndikator(id, {
        ...payload,
        skpd_periode_id: Number(payload.skpd_periode_id),
        master_id: Number(payload.master_id),
        target: payload.target,
        // target: payload.target?.slice(0, 5).map((t) => ({
        //   target: Number(t.target),
        //   tahun_ke: Number(t.tahun_ke),
        // })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_indikator'] });
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
  // #endregion

  //#region Table Head
  const mulai = Number(getPeriodeMulaiFromCookie()!);
  const akhir = Number(getPeriodeAkhirFromCookie()!);

  const periode = Array.from(
    { length: akhir - mulai + 1 },
    (_, i) => mulai + i,
  );
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
          <th rowSpan={1} colSpan={periode.length}>
            Target
          </th>
        </tr>
        <tr>
          {periode.map((thn) => (
            <th key={thn} rowSpan={1} className='w-[200px]'>
              {thn}
            </th>
          ))}
        </tr>
      </>
    );
  };
  //#endregion

  // #region Kolom Tabel
  const rowHeights = useRef<{ [key: string]: number[] }>({});
  const columns: ColumnDef<IndikatorMaster>[] = [
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
        const indikatorList = getValue() as Indikator[];
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
        const indikatorList = getValue() as Indikator[];
        if (!indikatorList || indikatorList.length === 0) return null;
        const isEven = row.index % 2 === 1;
        const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';

        return (
          <div>
            <table className='w-full'>
              <tbody className='border-0!'>
                {indikatorList.map((item, index) => {
                  const [satuan, setSatuan] = useState(item.satuan || '');
                  const [disBtn, setDisBtn] = useState(true);

                  const handleChange = (
                    e: React.ChangeEvent<HTMLInputElement>,
                  ) => {
                    const newValue = e.target.value;
                    setSatuan(newValue);
                    setDisBtn(!newValue || newValue === (item.satuan || ''));
                  };

                  const handleSubmit = (
                    e: React.FormEvent<HTMLFormElement>,
                  ) => {
                    e.preventDefault();
                    updateMutation.mutate({
                      id: item.id ?? 0,
                      payload: {
                        skpd_periode_id: Number(selectedSKPD),
                        master_id: row.original.id,
                        name: item.name,
                        satuan: satuan,
                        target: item.target
                        // target: item.target?.slice(0, 5).map((t) => ({
                        //   target: Number(t.target),
                        //   tahun_ke: Number(t.tahun_ke),
                        // })),
                        // target: item.target || [],
                      },
                    });
                  };

                  return (
                    <tr key={item.id} className={bgClass}>
                      <td
                        style={{
                          height: rowHeights.current[row.id]?.[index] || 'auto',
                        }}
                      >
                        <form onSubmit={handleSubmit}>
                          <InputText
                            id={`input_satuan_${item.id}`}
                            placeholder='Satuan...'
                            value={satuan}
                            onChange={handleChange}
                            withButton={!disBtn}
                            buttonType='submit'
                            invalid={!satuan}
                            disabled={loadingMutation}
                            tooltip={satuan}
                          />
                        </form>
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
      header: 'Target',
      meta: { tdClassNames: 'text-center' },
      columns: periode.map((tahun, indexTahun) => ({
        id: `tahun_ke_${tahun}`,
        header: `Target ${tahun}`,
        meta: { tdClassNames: 'text-center p-0!' },
        cell: ({ row }: any) => {
          const indikatorList = row.original.indikator ?? [];
          if (!indikatorList.length) return '\u00A0';
          const isEven = row.index % 2 === 1;
          const bgClass = isEven ? 'bg-[var(--bg-color)]!' : 'bg-white';

          return (
            <div>
              <table className='w-full'>
                <tbody className='border-0!'>
                  {indikatorList.map((indikator: Indikator, index: number) => {
                    const initialValue =
                      indikator.target?.find(
                        (t: any) => t.tahun_ke === indexTahun + 1,
                      )?.target ?? '';

                    const [target, setTarget] = useState(initialValue);
                    const [disBtn, setDisBtn] = useState(true);

                    const handleChange = (
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      const newValue = e.target.value;
                      setTarget(newValue);
                      setDisBtn(
                        !newValue || Number(initialValue) === Number(newValue),
                      );
                    };

                    const handleSubmit = (
                      e: React.FormEvent<HTMLFormElement>,
                    ) => {
                      e.preventDefault();

                      const totalTahun = periode.length;
                      const mappedTarget = Array.from(
                        { length: totalTahun },
                        (_, i) => {
                          const tahunKe = i + 1;
                          const existing = indikator.target?.find(
                            (t: IndikatorTarget) =>
                              Number(t.tahun_ke) === tahunKe,
                          );

                          return {
                            tahun_ke: tahunKe,
                            target:
                              tahunKe === Number(indexTahun + 1)
                                ? target.toString()
                                : existing?.target?.toString() || '0',
                          };
                        },
                      );

                      if (indikator.id) {
                        updateMutation.mutate({
                          id: indikator.id,
                          payload: {
                            skpd_periode_id: Number(selectedSKPD),
                            master_id: row.original.id,
                            name: indikator.name,
                            satuan: indikator.satuan?.toString(),
                            target: mappedTarget.filter((t) => t.tahun_ke <= 5),
                            // target: mappedTarget,
                          },
                        });
                      } else {
                        toast.error(
                          'Terjadi kesalahan di server. Silakan coba lagi nanti.',
                        );
                      }
                    };

                    return (
                      <tr key={indikator.id} className={bgClass}>
                        <td
                          style={{
                            height:
                              rowHeights.current[row.id]?.[index] || 'auto',
                          }}
                        >
                          <form onSubmit={handleSubmit}>
                            <InputText
                              id={`input_target_${indikator.id}_${tahun}`}
                              inputMode='numeric'
                              type='text'
                              placeholder='Target...'
                              value={target}
                              onChange={handleChange}
                              withButton={!disBtn}
                              buttonType='submit'
                              invalid={!target}
                              isRibu
                              tooltip={formatRibu(Number(target))}
                            />
                          </form>
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
  ];
  // #endregion

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='skpd'>SKPD</label>
            <InputSearchBox
              id='skpd'
              className='w-64 h-9'
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
        pesanDataKosong={<PesanSKPDTabel selectedSKPD={selectedSKPD} />}
      />
    </div>
  );
};

export default IndikatorTable;
