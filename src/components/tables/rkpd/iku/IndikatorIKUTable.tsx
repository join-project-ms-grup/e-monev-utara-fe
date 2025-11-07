import { useState } from 'react';
import Tabel from '../../Tabel';
import { MdRefresh } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { type ColumnDef } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import { getSKPDPeriode } from '../../../../services/PeriodeService';
import PesanSKPDTabel from '../../../PesanSKPDTabel';

const tableHead = () => {
  // const mulai = Number(getPeriodeMulaiFromCookie()!);
  // const akhir = Number(getPeriodeAkhirFromCookie()!);

  // const periode = [
  //   mulai - 1,
  //   ...Array.from({ length: akhir - mulai + 1 }, (_, i) => mulai + i),
  // ];

  const mulai = Number(getPeriodeMulaiFromCookie()!);
  const akhir = Number(getPeriodeAkhirFromCookie()!);

  const periode = Array.from(
    { length: akhir - mulai + 1 },
    (_, i) => mulai + i,
  );

  return (
    <>
      <tr>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Sasaran Strategis</th>
        <th rowSpan={2}>Indikator Kinerja Utama</th>
        <th rowSpan={2}>Satuan</th>
        <th rowSpan={2}>Kondisi Awal {mulai - 1}</th>
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

const IndikatorIKUTable = () => {
  const columns: ColumnDef<any>[] = Array.from({ length: 11 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  //#region SKPD
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
            // onClick={() => refetch()}
            // disabled={isFetching}
          >
            {/* {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />} */}
            <MdRefresh />
          </InputButton>
        </div>
      </div>
      <Tabel
        data={[]}
        columns={columns}
        renderHeader={tableHead}
        pesanDataKosong={<PesanSKPDTabel selectedSKPD={selectedSKPD} />}
      />
    </div>
  );
};

export default IndikatorIKUTable;
