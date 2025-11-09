import { createFileRoute } from '@tanstack/react-router';
import RekeningDakTable from '../../../components/tables/dak/RekeningDakTable';
import { SITE_NAME } from '../../../lib/config';

export const Route = createFileRoute('/_dashboard/dak/rekening')({
  head: () => ({
    meta: [
      {
        title: `Rekening DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Rekening DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RekeningDakTable />;
}
