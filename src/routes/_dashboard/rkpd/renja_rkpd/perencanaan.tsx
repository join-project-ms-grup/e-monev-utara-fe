import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RKPD_PerencanaanTable from '../../../../components/tables/rkpd/renja_rkpd/RKPD_PerencanaanTable';

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd/perencanaan')({
  head: () => ({
    meta: [
      {
        title: `Perencanaan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Perencanaan',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RKPD_PerencanaanTable />;
}
