import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import IndikatorTable from '../../../components/tables/rkpd/IndikatorTable';

export const Route = createFileRoute('/_dashboard/rkpd/indikator')({
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
  return <IndikatorTable />;
}
