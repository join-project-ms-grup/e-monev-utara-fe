import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/master/rekening/program')({
  head: () => ({
    meta: [
      {
        title: `Program - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Program',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/master/rekening/program"!</div>;
}
