import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import CapaianTable from '../../../components/tables/rkpd/CapaianTable';

export const Route = createFileRoute('/_dashboard/rkpd/capaian')({
  head: () => ({
    meta: [
      {
        title: `Capaian - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Capaian',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <CapaianTable />;
}
