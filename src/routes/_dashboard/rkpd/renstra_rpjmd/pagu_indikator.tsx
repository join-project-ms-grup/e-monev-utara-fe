import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import RENSTRA_PaguIndikator from '../../../../components/tables/rkpd/renstra_rpjmd/RENSTRA_PaguIndikator';

export const Route = createFileRoute('/_dashboard/rkpd/renstra_rpjmd/pagu_indikator')({
  head: () => ({
    meta: [
      {
        title: `Pagu Indikator - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Pagu Indikator',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RENSTRA_PaguIndikator />;
}
