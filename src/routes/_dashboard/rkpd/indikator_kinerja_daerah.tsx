import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import IKDTable from '../../../components/tables/rkpd/IKDTable';

export const Route = createFileRoute(
  '/_dashboard/rkpd/indikator_kinerja_daerah',
)({
  head: () => ({
    meta: [
      {
        title: `Indikator Kinerja Daerah - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Kinerja Daerah',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <IKDTable />;
}
