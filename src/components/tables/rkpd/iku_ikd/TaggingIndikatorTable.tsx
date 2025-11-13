import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import Tabel from '../../Tabel';
import toast from 'react-hot-toast';
import { MdRefresh } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox, { type OptionItem } from '../../../inputs/InputSearchBox';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getUserSKPDID,
  isAdmin,
  isDev,
} from '../../../../lib/usercookie';
import {
  flatIK,
  getIK,
  getIKSKPD,
  toggleTagIKU,
  type FlatIK,
} from '../../../../services/IKUIKDService';
import Spinner from '../../../inputs/Spinner';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../../lib/api';
import InputToggle from '../../../inputs/InputToggle';

const TaggingIndikatorTable = () => {
  const idPeriode = Number(getPeriodeIDFromCookie());
  const userSKPDID = getUserSKPDID();
  const [selectedSKPD, setSelectedSKPD] = useState(userSKPDID ?? '');
  const queryClient = useQueryClient();

  const { data: dataIKSKPD } = useQuery({
    queryKey: ['list_ik_skpd', idPeriode],
    queryFn: async () => getIKSKPD(idPeriode),
  });

  const listIKSKPD =
    dataIKSKPD?.map((item) => ({
      label: `${item.name}`,
      value: item.id?.toString(),
    })) || [];

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['list_ikd', selectedSKPD ? Number(selectedSKPD) : 'all', idPeriode],
    queryFn: async () => {
      const rawData = await getIK({
        skpd_id: selectedSKPD ? Number(selectedSKPD) : 'all',
        periodeId: idPeriode,
      });
      return flatIK(rawData);
    },
    enabled: !!idPeriode,
  });

  const toggleIKUMutation = useMutation({
    mutationFn: async ({
      id,
      skpd_id,
      periodeId,
    }: {
      id: number;
      skpd_id: number;
      periodeId: number;
    }) => toggleTagIKU({ id, skpd_id, periodeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_ikd'] });
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
      }
    },
  });

  // Gunakan useCallback agar referensi fungsi stabil
  const handleToggle = useCallback(
    (id_target: number, skpd_id: number, periodeId: number) => {
      toggleIKUMutation.mutate({ id: id_target, skpd_id, periodeId });
    },
    [toggleIKUMutation]
  );

  const mulaiPeriode = Number(getPeriodeMulaiFromCookie()!);
  const akhirPeriode = Number(getPeriodeAkhirFromCookie()!);
  const periode = useMemo(
    () => [
      mulaiPeriode - 1,
      ...Array.from(
        { length: akhirPeriode - mulaiPeriode + 1 },
        (_, i) => mulaiPeriode + i
      ),
    ],
    [mulaiPeriode, akhirPeriode]
  );

  const columns = useMemo<ColumnDef<FlatIK>[]>(
    () => [
      { header: 'No' },
      { header: 'IKU' },
      { header: 'Satuan' },
      { header: 'Kondisi Awal' },
      ...periode.map((_, i) => ({
        header: `Target Tahun ${i + 1}`,
        accessorKey: `targetTahun${i + 1}`,
      })),
      { header: 'Aksi' },
    ],
    [periode]
  );

  const tableHead = useCallback(() => {
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
            <th key={thn}>{thn}</th>
          ))}
        </tr>
      </>
    );
  }, [periode, mulaiPeriode]);

  const tableBody = useCallback(
    (table: Table<FlatIK>) => {
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
                    <p style={{ margin: 0, textIndent: -66, paddingLeft: 66, textAlign: 'left' }}>
                      <b>Perangkat Daerah :</b> {firstItem.skpdName}
                    </p>
                  </td>
                </tr>
              ) : null;

            lastSkpd = firstItem.skpdName;

            return (
              <Fragment key={firstItem.uraianId}>
                {headerRow}
                <tr className='odd gradeX text-center' id={`dtTb${firstItem.uraianId}`}>
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
                  <td className='w-[120px]'>
                    <div className='h-9'>
                      <ToggleIndikator
                        checkVal={firstItem.is_iku}
                        id_target={firstItem.uraianId}
                        skpd_id={Number(selectedSKPD)}
                        periodeId={idPeriode}
                        onToggle={handleToggle}
                      />
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </>
      );
    },
    [periode, handleToggle, idPeriode, selectedSKPD]
  );

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          {(isDev() || isAdmin()) && (
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
          )}
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
        renderBody={tableBody}
      />
    </div>
  );
};

export default TaggingIndikatorTable;

interface InputRealisasiProps {
  checkVal: boolean;
  id_target: number;
  skpd_id: number;
  periodeId: number;
  onToggle: (id_target: number, skpd_id: number, periodeId: number) => void;
}

// Gunakan memo dan bandingkan prop secara dangkal
const ToggleIndikator = memo(
  ({ checkVal, id_target, skpd_id, periodeId, onToggle }: InputRealisasiProps) => {
    return (
      <InputToggle
        tooltip='Tag sebagai IKU'
        onLabel='IKU'
        offLabel='IKD'
        checked={checkVal}
        onToggle={() => onToggle(id_target, skpd_id, periodeId)}
      />
    );
  },
  (prev, next) =>
    prev.checkVal === next.checkVal &&
    prev.id_target === next.id_target &&
    prev.skpd_id === next.skpd_id &&
    prev.periodeId === next.periodeId
);
