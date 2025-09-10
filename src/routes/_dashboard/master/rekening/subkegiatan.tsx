import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/master/rekening/subkegiatan')({
    head: () => ({
      meta: [
        {
          title: `Sub Kegiatan - ${SITE_NAME}`,
        },
      ],
    }),
    staticData: {
      title: 'Sub Kegiatan',
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <div>Hello "/_dashboard/master/rekening/subkegiatan"!</div>;
}
