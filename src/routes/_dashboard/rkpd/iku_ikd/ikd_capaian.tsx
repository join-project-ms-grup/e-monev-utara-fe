import { createFileRoute } from '@tanstack/react-router';
import CapaianIKDTable from '../../../../components/tables/rkpd/iku_ikd/CapaianIKDTable';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/rkpd/iku_ikd/ikd_capaian')({
  head: () => ({
    meta: [
      {
        title: `Capaian Indikator Kinerja Daerah - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Capaian Indikator Kinerja Daerah',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CapaianIKDTable />
    </>
  );
}
