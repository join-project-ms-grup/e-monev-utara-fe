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
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import { getIKSKPD } from '../../../../services/IKUIKDService';

const tableHead = () => {
  return (
    <>
      <tr>
        <th>No</th>
        <th>Sasaran</th>
        <th>Indikator Kinerja Utama</th>
        <th>Satuan</th>
        <th>Target Tahunan</th>
        <th>Triwulan</th>
        <th>Target</th>
        <th>Realisasi</th>
        <th>Capaian (%)</th>
        <th>Keterangan</th>
        <th>Aksi</th>
      </tr>
    </>
  );
};

const CapaianIKUTable = () => {
  const columns: ColumnDef<any>[] = Array.from({ length: 11 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

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
  //#region SKPD dan Tahun ke
  const idPeriode = Number(getPeriodeIDFromCookie());
  const [tahunKe, setTahunKe] = useState('');
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

  return (
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
              options={listIKSKPD as OptionItem[]}
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
        renderHeader={tableHead}
        pesanDataKosong={
          <PesanSKPDTabel
            selectedSKPD={selectedSKPD}
            tahun={tahunKe}
            butuhTahun
          />
        }
      />
    </div>
  );
};

export default CapaianIKUTable;
