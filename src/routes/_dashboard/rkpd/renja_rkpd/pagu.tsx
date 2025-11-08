import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RKPD_PaguTable from '../../../../components/tables/rkpd/renja_rkpd/RKPD_PaguTable';

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd/pagu')({
  head: () => ({
    meta: [
      {
        title: `Pagu - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Pagu',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RKPD_PaguTable />;
}
