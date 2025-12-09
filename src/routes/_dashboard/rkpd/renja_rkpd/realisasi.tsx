import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RKPD_RealisasiTable from '../../../../components/tables/rkpd/renja_rkpd/RKPD_RealisasiTable';

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd/realisasi')({
  head: () => ({
    meta: [
      {
        title: `Realisasi - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Realisasi',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RKPD_RealisasiTable />
}
