import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RKPD_IndikatorTable from '../../../../components/tables/rkpd/renja_rkpd/RKPD_RENJATable';

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd/indikator')({
  head: () => ({
    meta: [
      {
        title: `Indikator - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RKPD_IndikatorTable />
}
