import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/dak/kabupaten/monitoring')({
  head: () => ({
    meta: [
      {
        title: `Monitoring DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Monitoring DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/dak/kabupaten/monitoring"!</div>;
}
