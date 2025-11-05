import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../lib/config';
import DashRKPDTable from '../../components/tables/DashRKPDTable';
import { getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import { useQuery } from '@tanstack/react-query';
import { getSKPD } from '../../services/SKPDService';
import { getRekeningFlat } from '../../services/MasterService';
import { useMemo } from 'react';
import { getDashInfo } from '../../services/DashRKPDService';

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
  const { data: dataSKPD } = useQuery({
    queryKey: ['list_skpd'],
    queryFn: async () => getSKPD(),
  });
  const { data: dataInfo } = useQuery({
    queryKey: ['list_dash_info'],
    queryFn: async () => getDashInfo(),
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
}
