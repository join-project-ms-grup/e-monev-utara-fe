import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/master/rekening/kegiatan')({
  head: () => ({
    meta: [
      {
        title: `Kegiatan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Kegiatan',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/master/rekening/kegiatan"!</div>;
}
