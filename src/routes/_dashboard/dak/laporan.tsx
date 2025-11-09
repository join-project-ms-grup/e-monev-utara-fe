import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import InputSearchBox from '../../../components/inputs/InputSearchBox';
import { useState } from 'react';
import {
  getPeriodeMulaiFromCookie,
  getPeriodeAkhirFromCookie,
} from '../../../lib/usercookie';
import InputButton from '../../../components/inputs/InputButton';
import { MdPreview } from 'react-icons/md';
import { exportDAK } from '../../../services/Excel/ExcelDAK';
import { exportDAKSD } from '../../../services/Excel/ExcelDAKSD';

export const Route = createFileRoute('/_dashboard/dak/laporan')({
  head: () => ({
    meta: [
      {
        title: `Laporan DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Laporan DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  //#region List data periode
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

  const listPerLaporan = [
    { label: 'Bulan', value: 'bulan' },
    { label: 'Triwulan', value: 'triwulan' },
    { label: 'Semester', value: 'semester' },
  ];

  const listBulan = [
    { label: 'Januari', value: '1' },
    { label: 'Februari', value: '2' },
    { label: 'Maret', value: '3' },
    { label: 'April', value: '4' },
    { label: 'Mei', value: '5' },
    { label: 'Juni', value: '6' },
    { label: 'Juli', value: '7' },
    { label: 'Agustus', value: '8' },
    { label: 'September', value: '9' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' },
  ];

  const listTriwulan = [
    { label: 'Triwulan I', value: '1' },
    { label: 'Triwulan II', value: '2' },
    { label: 'Triwulan III', value: '3' },
    { label: 'Triwulan IV', value: '4' },
  ];

  const listSemester = [
    { label: 'Semester I', value: '1' },
    { label: 'Semester II', value: '2' },
  ];

  const [perLaporan, setPerLaporan] = useState('bulan');
  const [perWaktuLaporan, setPerWaktuLaporan] = useState('1');
  const [jenisDAK, setJenisDAK] = useState('fisik');

  return (
    <div className='max-w-xl mx-auto flex flex-col space-y-2'>
      <div className='grid grid-cols-[1fr_2fr] gap-2'>
        <div>
          <label htmlFor='tahun_ke'>Tahun Anggaran</label>
          <InputSearchBox
            id='tahun_ke'
            className='h-9'
            placeholder='Pilih Tahun...'
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
            className='h-9'
            placeholder='Pilih Jadwal...'
            options={[]}
          />
        </div>
      </div>
      <div className='grid grid-cols-[1fr_2fr] gap-2'>
        <div>
          <label htmlFor='perLaporan'>Periode Laporan</label>
          <InputSearchBox
            id='perLaporan'
            className='h-9'
            placeholder='Pilih Periode...'
            options={listPerLaporan}
            value={perLaporan}
            onChange={(val) => setPerLaporan(val)}
          />
        </div>
        <div>
          {perLaporan === 'bulan' && (
            <>
              <label htmlFor='perBulan'>Bulan</label>
              <InputSearchBox
                id='perBulan'
                className='h-9'
                placeholder='Pilih Bulan...'
                options={listBulan}
                value={perWaktuLaporan}
                onChange={(val) => setPerWaktuLaporan(val)}
              />
            </>
          )}
          {perLaporan === 'triwulan' && (
            <>
              <label htmlFor='perTriwulan'>Triwulan</label>
              <InputSearchBox
                id='perTriwulan'
                className='h-9'
                placeholder='Pilih Triwulan...'
                options={listTriwulan}
                value={perWaktuLaporan}
                onChange={(val) => setPerWaktuLaporan(val)}
              />
            </>
          )}
          {perLaporan === 'semester' && (
            <>
              <label htmlFor='perSemester'>Semester</label>
              <InputSearchBox
                id='perSemester'
                className='h-9'
                placeholder='Pilih Semester...'
                options={listSemester}
                value={perWaktuLaporan}
                onChange={(val) => setPerWaktuLaporan(val)}
              />
            </>
          )}
        </div>
      </div>
      <div className='grid grid-cols-[2fr_1fr] gap-2'>
        <div>
          <label htmlFor='skpd'>SKPD</label>
          <InputSearchBox
            id='skpd'
            className='h-9'
            placeholder='Pilih SKPD...'
            options={[]}
          />
        </div>
        <div>
          <label htmlFor='jenisDak'>Jenis DAK</label>
          <InputSearchBox
            id='jenisDak'
            className='h-9'
            placeholder='Jenis DAK...'
            options={[
              { label: 'DAK Fisik', value: 'fisik' },
              { label: 'DAK Non-Fisik', value: 'nonfisik' },
            ]}
            value={jenisDAK}
            onChange={(val) => setJenisDAK(val)}
          />
        </div>
      </div>
      <div className='w-full'>
        <InputButton
          className='px-2 w-full bg-green-700'
          onClick={() => {
            const perla = listPerLaporan.find(
              (item) => item.value === perLaporan,
            )?.label;
            const perwala =
              perLaporan === 'bulan'
                ? listBulan.find((item) => item.value === perWaktuLaporan)
                    ?.label
                : perLaporan === 'triwulan'
                  ? listTriwulan
                      .find((item) => item.value === perWaktuLaporan)
                      ?.label.replace('Triwulan ', '')
                  : listSemester.find((item) => item.value === perWaktuLaporan)
                      ?.label;
            const jdak = jenisDAK === 'fisik' ? 'DAK Fisik' : 'DAK Non-Fisik';

            exportDAK(
              [],
              listTahunKe
                .find((item) => item.value === tahunKe)
                ?.label.toUpperCase() ?? '',
              perla?.toUpperCase() ?? '',
              perwala?.toUpperCase() ?? '',
              '',
              '',
              jdak.toUpperCase(),
            );
          }}
        >
          <MdPreview />
          Laporan Kemajuan Pelaksanaan Kegiatan DAK
        </InputButton>
      </div>
      <div className='w-full'>
        <InputButton
          className='px-2 w-full bg-cyan-700'
          onClick={() => {
            const perla = listPerLaporan.find(
              (item) => item.value === perLaporan,
            )?.label;
            const perwala =
              perLaporan === 'bulan'
                ? listBulan.find((item) => item.value === perWaktuLaporan)
                    ?.label
                : perLaporan === 'triwulan'
                  ? listTriwulan
                      .find((item) => item.value === perWaktuLaporan)
                      ?.label.replace('Triwulan ', '')
                  : listSemester.find((item) => item.value === perWaktuLaporan)
                      ?.label;
            const jdak = jenisDAK === 'fisik' ? 'DAK Fisik' : 'DAK Non-Fisik';

            exportDAKSD(
              [],
              listTahunKe
                .find((item) => item.value === tahunKe)
                ?.label.toUpperCase() ?? '',
              perla?.toUpperCase() ?? '',
              perwala?.toUpperCase() ?? '',
              '',
              '',
              jdak.toUpperCase(),
            );
          }}
        >
          <MdPreview />
          Laporan Kemajuan Pelaksanaan Kegiatan DAK (sampai dengan)
        </InputButton>
      </div>
    </div>
  );
}
