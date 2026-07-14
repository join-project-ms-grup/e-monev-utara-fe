import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../lib/config';
import DashRKPDTable from '../../components/tables/DashRKPDTable';
import { getPeriodeMulaiFromCookie, getRoleId } from '../../lib/usercookie';
import { useQuery } from '@tanstack/react-query';
import { getDashInfo } from '../../services/DashRKPDService';
import DashDAKTable from '../../components/tables/DashDAKTable';
// import DashDAKChart from '../../components/charts/DashDAKChart';
import type { CSSProperties } from 'react';

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
  const bgHeader: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    overflow: 'hidden',
    lineHeight: '0',
    transform: 'rotate(180deg)',
  };

  const bgHeaderSvg: CSSProperties = {
    position: 'relative',
    display: 'block',
    width: 'calc(100% + 1.3px)',
    height: '100px',
    transform: 'rotateY(180deg)',
  };

  const bgHeaderFill: CSSProperties = {
    fill: 'var(--color-4)',
  };

  return (
    <div className='space-y-4'>
      <div className='relative bg-[var(--color-2)] text-[var(--text-3)] rounded-xl shadow px-8 py-6'>
        <div className='absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden'>
          <div style={bgHeader}>
            <svg
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
              style={bgHeaderSvg}
            >
              <path
                d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
                opacity='.25'
                style={bgHeaderFill}
              ></path>
              <path
                d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z'
                opacity='.5'
                style={bgHeaderFill}
              ></path>
              <path
                d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'
                style={bgHeaderFill}
              ></path>
            </svg>
          </div>
        </div>
        <div className='relative'>
          <h4>E-MAHABBAH</h4>
          <p>
            Sistem <b>M</b>onitoring, <b>A</b>nalisis <b>HA</b>sil Pem<b>B</b>
            angunan Daer<b>AH</b>
          </p>
          <p>BAPPERIDA Kabupaten Bengkulu Utara</p>
        </div>
        <div className='absolute bottom-0 right-0'>
          <div className='w-72'>
            <img
              src='/bupatiwabu.png'
              alt='Bupati dan Wakil Bupati Kabupaten Bengkulu Utara'
            />
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        {getRoleId() !== 4 && <DashRKPD />}
        <div className='border-b border-b-[var(--color-1)]'></div>
        {getRoleId() !== 3 && <DashDAK />}
      </div>
    </div>
  );
}

const DashRKPD = () => {
  const { data: dataInfo } = useQuery({
    queryKey: ['list_dash_info'],
    queryFn: getDashInfo,
  });

  const awalPeriode = getPeriodeMulaiFromCookie();

  return (
    <div className='space-y-2'>
      <div className='grid lg:grid-cols-4 md:grid-cols-2 gap-2'>
        <div className='flex flex-col px-4 py-6 rounded-lg shdaow bg-gradient-to-r from-cyan-600 to-cyan-600/70 text-white'>
          <h1>{dataInfo?.totalSKPD}</h1>
          <p>Jumlah</p>
          <p>
            <b>SKPD</b>
          </p>
          <p>Tahun {awalPeriode}</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-green-600 text-white'>
          <h1>{dataInfo?.totalProgram}</h1>
          <p>Jumlah</p>
          <p>
            <b>Program</b>
          </p>
          <p>Tahun {awalPeriode}</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-amber-400 text-white'>
          <h1>{dataInfo?.totalKegiatan}</h1>
          <p>Jumlah</p>
          <p>
            <b>Kegiatan</b>
          </p>
          <p>Tahun {awalPeriode}</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-violet-800 text-white'>
          <h1>{dataInfo?.totalSubKegiatan}</h1>
          <p>Jumlah</p>
          <p>
            <b>Sub Kegiatan</b>
          </p>
          <p>Tahun {awalPeriode}</p>
        </div>
      </div>
      <br />
      <DashRKPDTable />
    </div>
  );
};

const DashDAK = () => {
  return (
    <div className='space-y-2'>
      <br />
      <br />
      {/* <DashDAKChart /> */}
      <br />
      <DashDAKTable />
    </div>
  );
};
