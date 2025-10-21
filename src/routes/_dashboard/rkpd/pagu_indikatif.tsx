import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import PaguIndikatifTable from '../../../components/tables/rkpd/PaguIndikatifTable';

export const Route = createFileRoute('/_dashboard/rkpd/pagu_indikatif')({
  head: () => ({
    meta: [
      {
        title: `Pagu Indikatif - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Pagu Indikatif',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <PaguIndikatifTable />;
}
