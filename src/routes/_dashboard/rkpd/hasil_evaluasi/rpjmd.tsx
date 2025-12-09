import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RPJMDTable from '../../../../components/tables/rkpd/hasil_evaluasi/RPJMDTable';

export const Route = createFileRoute('/_dashboard/rkpd/hasil_evaluasi/rpjmd')({
  head: () => ({
    meta: [
      {
        title: `RPJMD - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'RPJMD',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RPJMDTable />;
}
