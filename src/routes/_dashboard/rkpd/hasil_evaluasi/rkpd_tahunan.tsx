import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config';
import RKPDTahunanTable from '../../../../components/tables/rkpd/hasil_evaluasi/RKPDTahunanTable';

export const Route = createFileRoute(
  '/_dashboard/rkpd/hasil_evaluasi/rkpd_tahunan',
)({
  head: () => ({
    meta: [
      {
        title: `RKPD Tahunan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'RKPD Tahunan',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RKPDTahunanTable />
    </>
  );
}
