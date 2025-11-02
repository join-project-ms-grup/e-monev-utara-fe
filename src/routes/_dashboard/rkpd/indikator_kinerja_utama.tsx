import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import IKUTable from '../../../components/tables/rkpd/IKUTable';

export const Route = createFileRoute(
  '/_dashboard/rkpd/indikator_kinerja_utama',
)({
  head: () => ({
    meta: [
      {
        title: `Indikator Kinerja Utama - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Kinerja Utama',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <IKUTable />;
}
