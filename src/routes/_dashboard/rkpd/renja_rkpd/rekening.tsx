import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RKPD_RekeningTable from '../../../../components/tables/rkpd/renja_rkpd/RKPD_RekeningTable';

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd/rekening')({
  head: () => ({
    meta: [
      {
        title: `Rekening - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Rekening',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RKPD_RekeningTable />;
}
