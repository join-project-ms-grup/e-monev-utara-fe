import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config';
import RKPDTable from '../../../../components/tables/rkpd/hasil_evaluasi/RKPDTable';

export const Route = createFileRoute(
  '/_dashboard/rkpd/hasil_evaluasi/rkpd',
)({
  head: () => ({
    meta: [
      {
        title: `RKPD - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'RKPD',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RKPDTable />
    </>
  );
}
