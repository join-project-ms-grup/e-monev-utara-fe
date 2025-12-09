import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RENSTRA_Perencanaan from '../../../../components/tables/rkpd/renstra_rpjmd/RENSTRA_Perencanaan';

export const Route = createFileRoute('/_dashboard/rkpd/renstra_rpjmd/perencanaan')({
  head: () => ({
    meta: [
      {
        title: `Perencanaan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Perencanaan',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RENSTRA_Perencanaan />;
}
