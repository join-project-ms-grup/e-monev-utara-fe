import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config';
import RenstraTable from '../../../../components/tables/rkpd/hasil_evaluasi/RenstraTable';

export const Route = createFileRoute(
  '/_dashboard/rkpd/hasil_evaluasi/renstra',
)({
  head: () => ({
    meta: [
      {
        title: `Renstra - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Renstra',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RenstraTable />
    </>
  );
}
