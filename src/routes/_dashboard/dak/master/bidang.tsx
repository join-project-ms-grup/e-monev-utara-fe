import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import BidangDakTable from '../../../../components/tables/dak/BidangDakTable';

export const Route = createFileRoute('/_dashboard/dak/master/bidang')({
  head: () => ({
    meta: [
      {
        title: `Bidang DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Bidang DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <BidangDakTable/>
}
