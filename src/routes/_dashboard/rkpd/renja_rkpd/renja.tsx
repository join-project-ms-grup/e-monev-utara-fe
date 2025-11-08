import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RKPD_RENJATable from '../../../../components/tables/rkpd/renja_rkpd/RKPD_RENJATable';

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd/renja')({
  head: () => ({
    meta: [
      {
        title: `Renja - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Renja',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RKPD_RENJATable />;
}
