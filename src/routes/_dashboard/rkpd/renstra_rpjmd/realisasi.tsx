import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RENSTRA_RealisasiTable from '../../../../components/tables/rkpd/renstra_rpjmd/RENSTRA_RealisasiTable';

export const Route = createFileRoute(
  '/_dashboard/rkpd/renstra_rpjmd/realisasi',
)({
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
  return <RENSTRA_RealisasiTable />
}
