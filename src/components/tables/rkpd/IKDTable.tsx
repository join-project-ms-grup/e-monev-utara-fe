import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { MdRefresh } from 'react-icons/md';
import { getPeriodeAkhirFromCookie, getPeriodeIDFromCookie, getPeriodeMulaiFromCookie } from '../../../lib/usercookie';
import { getSKPDPeriode } from '../../../services/PeriodeService';
import InputButton from '../../inputs/InputButton';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import Tabel from '../Tabel';

const tableHead = () => {
  const mulai = Number(getPeriodeMulaiFromCookie()!);
  const akhir = Number(getPeriodeAkhirFromCookie()!);

const periode = [mulai - 1, ...Array.from(
  { length: akhir - mulai + 1 },
  (_, i) => mulai + i
)];

  return (
    <>
      <tr>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Indikator</th>
        <th rowSpan={2}>Satuan</th>
        <th rowSpan={2}>Kondisi Awal {mulai - 2}</th>
        <th colSpan={periode.length}>Target Tahun</th>
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

const IKDTable = () => {
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

  const columns: ColumnDef<any>[] = Array.from({ length: 11 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

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
              tooltip='Refresh'
              className='btn btn-theme w-9 h-9'
              //   onClick={() => refetch()}
              //   disabled={isFetching}
            >
              {/* {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />} */}
              <MdRefresh />
            </InputButton>
          </div>
        </div>
        <Tabel data={[]} columns={columns} renderHeader={tableHead} />
      </div>
    </>
  );
};

export default IKDTable;
