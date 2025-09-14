import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import SKPDTable from '../../../components/tables/SKPDTable';

export const Route = createFileRoute('/_dashboard/master/skpd')({
  head: () => ({
    meta: [
      {
        title: `SKPD - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'SKPD',
  },
  component: RouteComponent,
  context: () => ({
    getTitle: () => 'SKPD',
  }),
});

function RouteComponent() {
  return (
    <>
      <SKPDTable />
    </>
  );
}
