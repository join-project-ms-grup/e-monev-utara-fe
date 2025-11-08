import { createFileRoute } from '@tanstack/react-router';
import RENSTRA_RekeningTable from '../../../../components/tables/rkpd/renstra_rpjmd/RENSTRA_RekeningTable';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/rkpd/renstra_rpjmd/rekening')(
  {
    head: () => ({
      meta: [
        {
          title: `Rekening - ${SITE_NAME}`,
        },
      ],
    }),
    staticData: {
      title: 'Rekening',
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <RENSTRA_RekeningTable />;
}
