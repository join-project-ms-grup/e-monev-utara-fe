import { Fragment, useState } from 'react';
import Tabel from '../../Tabel';
import toast from 'react-hot-toast';
import { MdClose, MdRefresh, MdTag } from 'react-icons/md';
import { IoMdPricetag } from 'react-icons/io';
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
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import {
  flatIK,
  getIKD,
  getIKSKPD,
  toggleTagIKU,
  type FlatIK,
} from '../../../../services/IKUIKDService';
import Spinner from '../../../inputs/Spinner';
import AksiButton from '../../../inputs/AksiButton';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../../lib/api';

const TaggingIndikatorIKDTable = () => {
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
    queryKey: ['list_ikd', (selectedSKPD ? Number(selectedSKPD) : 'all'), idPeriode],
    queryFn: async () => {
      const rawData = await getIKD({
        skpd_id: selectedSKPD ? Number(selectedSKPD) : 'all',
        periodeId: idPeriode,
      });
      const flatData = flatIK(rawData);
      console.log('flat data', flatData);
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

  const columns: ColumnDef<FlatIK>[] = [
    {
      header: 'No',
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
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Indikator Kinerja Utama</th>
          <th rowSpan={2}>Satuan</th>
          <th rowSpan={2}>Kondisi Awal {mulaiPeriode - 2}</th>
          <th colSpan={periode.length}>Target Tahun</th>
          <th rowSpan={2}>Aksi</th>
        </tr>
        <tr>
          {periode.map((thn) => (
            <th key={thn} rowSpan={1}>
              {thn}
            </th>
          ))}
        </tr>
      </>
    );
  };

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
      const key = `${item.skpdName}-${item.uraianId}`;
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
                <td colSpan={periode.length + 5} className='bg-blue'>
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
            <Fragment key={`${firstItem.skpdName}-${firstItem.uraianId}`}>
              {headerRow}
              <tr
                className='odd gradeX text-center'
                id={`dtTb${firstItem.uraianId}`}
              >
                <td>{counter++}</td>
                <td className='text-left!'>{firstItem.uraianName}</td>
                <td>{firstItem.satuan}</td>
                <td>{firstItem.base_line}</td>
                <td>{firstItem.t_1_target}</td>
                <td>{firstItem.t_2_target}</td>
                <td>{firstItem.t_3_target}</td>
                <td>{firstItem.t_4_target}</td>
                <td>{firstItem.t_5_target}</td>
                <td>{firstItem.t_6_target}</td>
                <td>
                  <AksiButton
                    Icon={MdTag}
                    className='text-green-500 hover:text-white hover:bg-green-500!'
                    tooltip='Tag Sebagai IKD ?'
                    onClick={() => {
                      toggleIKUMutation.mutate({
                        id: firstItem.uraianId,
                        skpd_id: Number(selectedSKPD),
                        periodeId: idPeriode,
                      });
                    }}
                  />
                </td>
              </tr>
            </Fragment>
          );
        })}
      </>
    );
  };

  const queryClient = useQueryClient();
  const [loadingMutation, setLoadingMutation] = useState(false);
  const toggleIKUMutation = useMutation({
    mutationFn: async ({
      id,
      skpd_id,
      periodeId,
    }: {
      id: number;
      skpd_id: number;
      periodeId: number;
    }) => {
      setLoadingMutation(true);
      // return console.log(payload)
      return toggleTagIKU({ id, skpd_id, periodeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['list_iku', selectedSKPD, idPeriode],
      });

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
          {/* <InputButton
            tooltip='Tag semua data sebagai IKU'
            className='btn btn-theme h-9'
            onClick={() => {
              toast.success('Tagging...');
            }}
          >
            <span className='inline-flex items-center px-2 gap-2'>
              <MdTag /> Tag Semua
            </span>
          </InputButton> */}
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
  );
};

export default TaggingIndikatorIKDTable;
