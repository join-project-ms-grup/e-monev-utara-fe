import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import BidangTable from '../../../../components/tables/master/BidangTable';

export const Route = createFileRoute('/_dashboard/master/rekening/bidang')({
  head: () => ({
    meta: [
      {
        title: `Bidang - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Bidang',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <BidangTable />
    </>
  );
}
