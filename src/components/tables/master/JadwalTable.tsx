import type { ColumnDef } from '@tanstack/react-table';
import Tabel from '../Tabel';
import { MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import { useState } from 'react';
import {
  getPeriodeMulaiFromCookie,
  getPeriodeAkhirFromCookie,
} from '../../../lib/usercookie';

const JadwalTable = () => {
  //#region Tahun Ke
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
  //#endregion

  const columns: ColumnDef<any>[] = [
    {
      header: 'No',
    },
    {
      header: 'Tahun',
    },
    {
      header: 'Tipe Tahap',
    },
    {
      header: 'Tahap',
    },
    {
      header: 'Jadwal',
    },
    {
      header: 'Status',
    },
    {
      header: 'Aksi',
    },
  ];

  const PesanDataKosong = () => {
    if (tahunKe) {
      return <>TIDAK ADA DATA</>;
    } else {
      return <>TAHUN BELUM DIPILIH</>
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='tahun_ke'>Tahun Anggaran</label>
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
        </div>
        <div className='inline-flex gap-2'>
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            // onClick={() => refetch()}
            // disabled={isFetching}
          >
            {/* {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />} */}
            <MdRefresh />
          </InputButton>
        </div>
      </div>
      <Tabel
        data={[]}
        columns={columns}
        pesanDataKosong={<PesanDataKosong />}
      />
    </div>
  );
};

export default JadwalTable;
