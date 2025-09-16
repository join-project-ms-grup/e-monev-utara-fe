import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';

export const Route = createFileRoute('/_dashboard/dak/daftardak')({
  head: () => ({
    meta: [
      {
        title: `Daftar dan Jenis DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Daftar dan Jenis DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/dak/daftardak"!</div>;
}
