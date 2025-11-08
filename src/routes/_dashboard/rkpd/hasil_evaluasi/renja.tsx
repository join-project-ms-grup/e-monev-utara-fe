import { createFileRoute } from '@tanstack/react-router';
import RenjaTable from '../../../../components/tables/rkpd/hasil_evaluasi/RenjaTable';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/rkpd/hasil_evaluasi/renja')({
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
