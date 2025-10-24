import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../lib/config';
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
  return (
    <div className='space-y-2'>
      {/* <div>
        <h4>E-MAHABBAH</h4>
        <p>Monitoring, Analisis Hasil Pembangunan Daerah</p>
      </div> */}
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
