import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config';
import PeriodeTable from '../../../components/tables/PeriodeTable';

export const Route = createFileRoute('/_dashboard/master/periode')({
  head: () => ({
    meta: [
      {
        title: `Periode - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Periode',
  },
  component: RouteComponent,
  context: () => ({
    getTitle: () => 'Periode',
  }),
});

function RouteComponent() {
  return (
    <>
      <PeriodeTable />
    </>
  );
}
