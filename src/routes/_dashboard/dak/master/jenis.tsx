import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import JenisDakTable from '../../../../components/tables/dak/JenisDakTable';

export const Route = createFileRoute('/_dashboard/dak/master/jenis')({
  head: () => ({
    meta: [
      {
        title: `Jenis DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Jenis DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <JenisDakTable />
}
