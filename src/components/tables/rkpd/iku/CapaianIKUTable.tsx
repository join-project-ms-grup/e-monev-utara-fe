import { Fragment, useState } from 'react';
import Tabel from '../../Tabel';
import { MdRefresh } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import {
  addRealisasi,
  flatIK,
  getIKSKPD,
  getIKU,
  type FlatIK,
  type IKUIKDForm,
} from '../../../../services/IKUIKDService';
import Spinner from '../../../inputs/Spinner';
import InputText from '../../../inputs/InputText';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../../lib/api';
import {
  calculateAchievementPercentage,
} from '../../../../lib/helper';

const CapaianIKUTable = () => {
  const idPeriode = Number(getPeriodeIDFromCookie());
  //#region SKPD
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataIKSKPD } = useQuery({
    queryKey: ['list_ik_skpd', idPeriode],
    queryFn: async () => getIKSKPD(idPeriode),
  });
  const listIKSKPD =
    dataIKSKPD?.map((item) => ({
      label: `${item.name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  const { data, isFetching, refetch } = useQuery({
    queryKey: [
      'list_iku',
      selectedSKPD ? Number(selectedSKPD) : 'all',
      idPeriode,
    ],
    queryFn: async () => {
      const rawData = await getIKU({
        skpd_id: selectedSKPD ? Number(selectedSKPD) : 'all',
        periodeId: idPeriode,
      });
      const flatData = flatIK(rawData);
      return flatData;
    },
    enabled: !!idPeriode,
  });

  const mulaiPeriode = Number(getPeriodeMulaiFromCookie()!);
  const akhirPeriode = Number(getPeriodeAkhirFromCookie()!);
  const periode = [
    mulaiPeriode - 1,
    ...Array.from(
      { length: akhirPeriode - mulaiPeriode + 1 },
      (_, i) => mulaiPeriode + i,
    ),
  ];
  const [tahunKe, setTahunKe] = useState('1');
  const listTahunKe = periode.map((tahun, i) => ({
    label: `${tahun}`,
    value: `${i + 1}`,
  }));

  const columns: ColumnDef<FlatIK>[] = [
    {
      header: 'No',
    },
    {
      header: 'Urusan di RPJMD',
    },
    {
      header: 'IKU',
    },
    {
      header: 'Satuan',
    },
    {
      header: 'Kondisi Awal',
    },
    ...periode.slice(0).map((_, i) => ({
      header: `Target Tahun ${i + 1}`,
      accessorKey: `targetTahun${i + 1}`,
    })),
    {
      header: 'Aksi',
    },
  ];

  const tableHead = () => {
    return (
      <>
        <tr>
          <th>No</th>
          <th>Urusan di RPJMD</th>
          <th>Indikator Kinerja Utama</th>
          <th>Satuan</th>
          <th>
            Target Tahun{' '}
            {listTahunKe.find((item) => item.value === tahunKe)?.label}
          </th>
          <th>Realisasi</th>
          <th>Capaian</th>
        </tr>
      </>
    );
  };

  const [realisasiValues, setRealisasiValues] = useState<
    Record<number, string>
  >({});

  const tableBody = (table: Table<FlatIK>) => {
    const rowModel = table.getRowModel();
    const { pageIndex, pageSize } = table.getState().pagination ?? {
      pageIndex: 0,
      pageSize: 10,
    };

    let lastSkpd = '';
    let counter = pageIndex * pageSize + 1;

    const grouped: Record<string, FlatIK[]> = {};
    rowModel.rows.forEach((row) => {
      const item = row.original;
      const key = `${item.skpdName}-${item.wMasterName}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    return (
      <>
        {Object.values(grouped).map((group) => {
          const firstItem = group[0];
          const headerRow =
            firstItem.skpdName !== lastSkpd ? (
              <tr className='odd gradeX' key={`header-${firstItem.skpdName}`}>
                <td colSpan={periode.length + 6} className='bg-blue'>
                  <p
                    style={{
                      margin: 0,
                      textIndent: -66,
                      paddingLeft: 66,
                      textAlign: 'left',
                    }}
                  >
                    <b>Perangkat Daerah : </b>
                    {firstItem.skpdName}
                  </p>
                </td>
              </tr>
            ) : null;

          lastSkpd = firstItem.skpdName;
          return (
            <Fragment key={`${firstItem.skpdName}-${firstItem.wMasterName}`}>
              {headerRow}
              {group.map((item, index) => {
                const initialValue =
                  (item as any)[`t_${tahunKe}_realisasi`] ?? '';
                const localValue =
                  realisasiValues[(item as any)[`t_${tahunKe}_id`]] ??
                  initialValue;
                const showButton = localValue !== initialValue;
                return (
                  <tr
                    className='odd gradeX text-center'
                    id={`dtTb${item.uraianId}`}
                    key={item.uraianId}
                  >
                    <td>{counter++}</td>
                    <td className='text-left!'>
                      {index === 0 ? item.wMasterName : ''}
                    </td>
                    <td className='text-left!'>{item.uraianName}</td>
                    <td>{item.satuan}</td>
                    <td>{(item as any)[`t_${tahunKe}_target`]}</td>
                    <td className='w-[150px]'>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const payload: IKUIKDForm = {
                            id_target: (item as any)[`t_${tahunKe}_id`], // ambil id dari item sesuai tahunKe
                            realisasi:
                              realisasiValues[
                                (item as any)[`t_${tahunKe}_id`]
                              ] ?? '',
                          };
                          realisasiMutation.mutate(payload);
                        }}
                      >
                        <InputText
                          value={
                            realisasiValues[(item as any)[`t_${tahunKe}_id`]] ??
                            (item as any)[`t_${tahunKe}_realisasi`] ??
                            ''
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const val = e.target.value;
                            setRealisasiValues((prev) => ({
                              ...prev,
                              [(item as any)[`t_${tahunKe}_id`]]: val,
                            }));
                          }}
                          withButton={showButton}
                        />
                      </form>
                    </td>

                    <td>
                      {calculateAchievementPercentage(
                        (item as any)[`t_${tahunKe}_target`],
                        (item as any)[`t_${tahunKe}_realisasi`],
                      ) ?? 0}
                      {` %`}
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          );
        })}
      </>
    );
  };

  const queryClient = useQueryClient();
  const [loadingMutation, setLoadingMutation] = useState(false);
  const realisasiMutation = useMutation({
    mutationFn: async (payload: IKUIKDForm) => {
      setLoadingMutation(true);
      return addRealisasi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_iku'] });
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

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
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
            />
          </div>
          <div>
            <label htmlFor='skpd'>SKPD</label>
            <InputSearchBox
              id='skpd'
              className='w-64 h-9'
              btnclassName='bg-white'
              placeholder='Pilih SKPD...'
              value={selectedSKPD.toString()}
              options={listIKSKPD as OptionItem[]}
              onChange={(val) => setSelectedSKPD(val)}
              onClear={() => setSelectedSKPD('')}
              tooltip
              withSearch
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
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
      />
    </div>
  );
};

export default CapaianIKUTable;
