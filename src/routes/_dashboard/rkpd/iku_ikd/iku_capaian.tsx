import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import CapaianIKUTable from '../../../../components/tables/rkpd/iku_ikd/CapaianIKUTable';

export const Route = createFileRoute('/_dashboard/rkpd/iku_ikd/iku_capaian')({
  head: () => ({
    meta: [
      {
        title: `Realisasi Indikator Kinerja Utama - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Realisasi Indikator Kinerja Utama',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CapaianIKUTable />
    </>
  );
}
