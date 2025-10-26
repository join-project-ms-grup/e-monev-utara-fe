import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config';
import RKPD5TahunanTable from '../../../../components/tables/rkpd/hasil_evaluasi/RKPD5TahunanTable';

export const Route = createFileRoute(
  '/_dashboard/rkpd/hasil_evaluasi/rkpd_5_tahunan',
)({
  head: () => ({
    meta: [
      {
        title: `RKPD 5 Tahunan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'RKPD 5 Tahunan',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RKPD5TahunanTable />
    </>
  );
}
