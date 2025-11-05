import { useState } from 'react';
import Tabel from '../../Tabel';
import InputButton from '../../../inputs/InputButton';
import { MdRefresh } from 'react-icons/md';
import type { ColumnDef } from '@tanstack/react-table';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import { getSKPDPeriode } from '../../../../services/PeriodeService';
import PesanSKPDTabel from '../../../PesanSKPDTabel';

const tableHead = () => {
  return (
    <>
      <tr>
        <th>No</th>
        <th>Kode Sub Kegiatan</th>
        <th>Nama Sub Kegiatan</th>
        <th>Pagu (Rp.)</th>
        <th>Waktu Pelaksanaan</th>
        <th>Detail</th>
      </tr>
    </>
  );
};

const RenjaTable = () => {
  //#region SKPD dan Tahun ke
  const [tahunKe, setTahunKe] = useState('');
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${i + 1}`,
    }),
  );

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

  const columns: ColumnDef<any>[] = Array.from({ length: 6 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return (
    <>
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
                onClear={() => setTahunKe('')}
              />
            </div>
            <div>
              <label htmlFor='jadwal'>Jadwal</label>
              <InputSearchBox
                id='jadwal'
                className='w-42 h-9'
                btnclassName='bg-white'
                placeholder='Pilih Jadwal...'
                options={[]}
              />
            </div>
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
                tooltip
                withSearch
              />
            </div>
            <div>
              <label htmlFor='urusan'>Bidang Urusan</label>
              <InputSearchBox
                id='urusan'
                className='w-72 h-9'
                btnclassName='bg-white'
                placeholder='Pilih Bidang Urusan...'
                options={[]}
                tooltip
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
        <Tabel
          data={[]}
          columns={columns}
          renderHeader={tableHead}
          pesanDataKosong={<PesanSKPDTabel selectedSKPD={selectedSKPD} />}
        />
      </div>
    </>
  );
};

export default RenjaTable;
