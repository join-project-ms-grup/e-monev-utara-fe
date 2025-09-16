import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/dak/kabupaten/identifikasi')({
  head: () => ({
    meta: [
      {
        title: `Identifikasi DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Identifikasi DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/dak/kabupaten/identifikasi"!</div>;
}
