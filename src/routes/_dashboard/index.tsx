import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../lib/config';
import DashRKPDTable from '../../components/tables/DashRKPDTable';
import { getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import { useQuery } from '@tanstack/react-query';
import { getSKPD } from '../../services/SKPDService';
import { getRekeningFlat } from '../../services/MasterService';
import { useMemo } from 'react';

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
  // const { data: dataRekening } = useQuery({
  //   queryKey: ['list_rekening'],
  //   queryFn: async () => {
  //     const data = await getRekeningFlat();
  //     console.log(data);
  //     return data;
  //   },
  // });

  // const countByLevel = useMemo(() => {
  //   if (!dataRekening) return {};
  //   return dataRekening.reduce<Record<string, number>>((acc, item) => {
  //     const level = item.rekening as string;
  //     acc[level] = (acc[level] || 0) + 1;
  //     return acc;
  //   }, {});
  // }, [dataRekening]);

  const awalPeriode = getPeriodeMulaiFromCookie();
  return (
    <div className='space-y-2'>
      <div className='grid lg:grid-cols-4 md:grid-cols-2 gap-2'>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-cyan-600 text-white'>
          <h1>{dataSKPD?.length}</h1>
          <p>Jumlah</p>
          <p>
            <b>SKPD</b>
          </p>
          <p>Tahun {awalPeriode}</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-green-600 text-white'>
          {/* <h1>{countByLevel.program}</h1> */}
          <h1>216</h1>
          <p>Jumlah</p>
          <p>
            <b>Program</b>
          </p>
          <p>Tahun {awalPeriode}</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-amber-400 text-white'>
          {/* <h1>{countByLevel.kegiatan}</h1> */}
          <h1>1002</h1>
          <p>Jumlah</p>
          <p>
            <b>Kegiatan</b>
          </p>
          <p>Tahun {awalPeriode}</p>
        </div>
        <div className='flex flex-col px-4 py-6 rounded-lg shadow bg-violet-800 text-white'>
          {/* <h1>{countByLevel['sub kegiatan']}</h1> */}
          <h1>4502</h1>
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
