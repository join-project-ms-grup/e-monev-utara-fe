import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import RenjaTable from '../../../components/tables/rkpd/hasil_evaluasi/RenjaTable';

export const Route = createFileRoute('/_dashboard/rkpd/renja')({
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
  return <RenjaTable />;
}
