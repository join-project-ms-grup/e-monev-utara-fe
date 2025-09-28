import { createFileRoute } from '@tanstack/react-router';
import RekeningTable from '../../../components/tables/master/RekeningTable';
import { SITE_NAME } from '../../../lib/config';

export const Route = createFileRoute('/_dashboard/master/rekening')({
  head: () => ({
    meta: [
      {
        title: `Rekening - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Rekening',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RekeningTable />
    </>
  );
}
