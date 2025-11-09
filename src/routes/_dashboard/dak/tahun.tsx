import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import TahunDakTable from '../../../components/tables/dak/TahunDakTable';

export const Route = createFileRoute('/_dashboard/dak/tahun')({
  head: () => ({
    meta: [
      {
        title: `Tahun DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Tahun DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <TahunDakTable />
}
