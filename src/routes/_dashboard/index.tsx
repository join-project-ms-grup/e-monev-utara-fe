import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../lib/config';
import DashRKPDTable from '../../components/tables/DashRKPDTable';
import { getPeriodeMulaiFromCookie, getRoleId } from '../../lib/usercookie';
import { useQuery } from '@tanstack/react-query';
import { getDashInfo } from '../../services/DashRKPDService';
import DashDAKTable from '../../components/tables/DashDAKTable';
import DashDAKChart from '../../components/charts/DashDAKChart';
import InputSearchBox from '../../components/inputs/InputSearchBox';

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
    <div className='space-y-6'>
      {getRoleId() !== 4 && <DashRKPD />}
      <div className='border-b border-b-[var(--color-1)]'></div>
      {getRoleId() !== 3 && <DashDAK />}
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
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-cyan-600 text-white'>
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
      <div className='inline-flex gap-2'>
        <div>
          <label htmlFor='tahun_ke'>Tahun</label>
          <InputSearchBox
            id='tahun_ke'
            className='w-42 h-9'
            btnclassName='bg-white'
            placeholder='Pilih Tahun...'
            options={[]}
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
        <div className='flex flex-col'>
          <label htmlFor='periode'>Periode Laporan</label>
          <div className='inline-flex gap-2'>
            <InputSearchBox
              id='periode'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Periode...'
              options={[]}
            />
            <InputSearchBox
              id='periode2'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Waktu...'
              options={[]}
              disabled
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      <DashDAKChart />
      <br />
      <DashDAKTable />
    </div>
  );
};
