import Tabel from './Tabel';
import type { ColumnDef } from '@tanstack/react-table';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3}>
          <big>Ranking</big>
        </th>
        <th rowSpan={3}>
          <big>Nama SKPD</big>
        </th>
        <th rowSpan={3}>
          <big>
            Jumlah
            <br />
            Paket
          </big>
        </th>
        <th rowSpan={3}>
          <big>
            Jumlah
            <br />
            Anggaran
            <br />
            (Rp.)
          </big>
        </th>
        <th colSpan={5}>
          <big>Realisasi (%)</big>
        </th>
      </tr>
      <tr>
        <th colSpan={2}>
          <big>DAK Fisik</big>
        </th>
        <th colSpan={2}>
          <big>DAK Non-Fisik</big>
        </th>
        <th rowSpan={2}>
          <big>
            Persentase
            <br />
            Rata-Rata
          </big>
        </th>
      </tr>
      <tr>
        <th>
          <big>Fisik</big>
        </th>
        <th>
          <big>Keuangan</big>
        </th>
        <th>
          <big>Fisik</big>
        </th>
        <th>
          <big>Keuangan</big>
        </th>
      </tr>
    </>
  );
};

const DashDAKTable = () => {
  const columns: ColumnDef<any>[] = Array.from({ length: 9 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return (
    <div className='space-y-2'>
      <h4 className='text-center'>
        Tabel Ranking Kinerja Kegiatan DAK per SKPD Kabupaten Bengkulu Utara
        dari
        <br />
        Tertinggi ke sampai dengan Bulan November
        <br />
        Tahun Anggaran 2025
      </h4>
      <div className='flex items-end justify-between'>
        {/* <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='tahun_ke'>Tahun</label>
            <InputSearchBox
              id='tahun_ke'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Tahun...'
              value={tahunKe}
              options={listTahunKe}
              onChange={(val) => setTahunKe(val)}
              onClear={() => {
                setTahunKe('');
                setTriwulan('');
              }}
            />
          </div>
          <div>
            <label htmlFor='triwulan'>s.d Triwulan</label>
            <InputSearchBox
              id='triwulan'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Triwulan...'
              value={triwulan}
              onChange={(e) => setTriwulan(e)}
              options={[
                { label: 'I', value: 'I' },
                { label: 'II', value: 'II' },
                { label: 'III', value: 'III' },
                { label: 'IV', value: 'IV' },
              ]}
              onClear={() => setTriwulan('')}
              disabled={!tahunKe}
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
          <InputButton
            tooltip='Print'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              toast.success('Printing...');
              exportRankingRKPD([], tahunMulai.toString());
            }}
          >
            <MdPrint />
          </InputButton>
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
          </InputButton>
        </div> */}
      </div>
      <Tabel data={[]} columns={columns} renderHeader={tableHead} />
    </div>
  );
};

export default DashDAKTable;
