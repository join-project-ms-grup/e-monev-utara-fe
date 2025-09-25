import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../lib/config';
import InputSearchBox from '../../components/inputs/InputSearchBox';
import { useState } from 'react';
import DashRKPDTable from '../../components/tables/DashRKPDTable';

export const Route = createFileRoute('/_dashboard/')({
  head: () => ({
    meta: [
      {
        title: `Dashboard - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Dashboard',
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [tahun, setTahun] = useState('2025');
  const [triwulan, setTriwulan] = useState('III');

  return (
    <div className='space-y-2'>
      {/* <div>
        <h4>E-MAHABBAH</h4>
        <p>Monitoring, Analisis Hasil Pembangunan Daerah</p>
      </div> */}
      <div className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center max-w-md'>
        <label htmlFor='tahun'>Tahun</label>
        <InputSearchBox
          id='tahun'
          className='w-24'
          btnclassName='bg-white'
          value={tahun}
          onChange={(e) => setTahun(e)}
          options={[
            { label: '2026', value: '2026' },
            { label: '2025', value: '2025' },
            { label: '2024', value: '2024' },
            { label: '2023', value: '2023' },
            { label: '2022', value: '2022' },
          ]}
        />

        <label htmlFor='triwulan'>s.d Triwulan</label>
        <InputSearchBox
          id='triwulan'
          className='w-24'
          btnclassName='bg-white'
          value={triwulan}
          onChange={(e) => setTriwulan(e)}
          options={[
            { label: 'I', value: 'I' },
            { label: 'II', value: 'II' },
            { label: 'III', value: 'III' },
            { label: 'IV', value: 'IV' },
          ]}
        />
      </div>
      <div className='grid lg:grid-cols-4 md:grid-cols-2 gap-2'>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-cyan-600 text-white'>
          <h1>57</h1>
          <p>Jumlah</p>
          <p>
            <b>SKPD</b>
          </p>
          <p>Tahun 2025</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-green-600 text-white'>
          <h1>235</h1>
          <p>Jumlah</p>
          <p>
            <b>Program</b>
          </p>
          <p>Tahun 2025</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-amber-400 text-white'>
          <h1>722</h1>
          <p>Jumlah</p>
          <p>
            <b>Kegiatan</b>
          </p>
          <p>Tahun 2025</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-violet-800 text-white'>
          <h1>2191</h1>
          <p>Jumlah</p>
          <p>
            <b>Sub Kegiatan</b>
          </p>
          <p>Tahun 2025</p>
        </div>
      </div>
      <DashRKPDTable />
    </div>
  );
}
