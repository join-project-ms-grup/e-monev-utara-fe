import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import MasalahDakTable from '../../../../components/tables/dak/MasalahDakTable';

export const Route = createFileRoute('/_dashboard/dak/master/masalah')({
  head: () => ({
    meta: [
      {
        title: `Masalah DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Masalah DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MasalahDakTable />
}
