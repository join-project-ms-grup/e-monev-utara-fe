import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import RealisasiTable from '../../../components/tables/rkpd/RealisasiTable';

export const Route = createFileRoute('/_dashboard/rkpd/realisasi')({
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
  return (
    <>
      <RealisasiTable />
    </>
  );
}
