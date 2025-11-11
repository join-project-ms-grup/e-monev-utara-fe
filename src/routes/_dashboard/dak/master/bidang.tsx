import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/dak/master/bidang')({
  head: () => ({
    meta: [
      {
        title: `Bidang DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Bidang DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/dak/master/bidang"!</div>;
}
