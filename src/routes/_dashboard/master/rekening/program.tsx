import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import ProgramTable from '../../../../components/tables/master/ProgramTable';

export const Route = createFileRoute('/_dashboard/master/rekening/program')({
  head: () => ({
    meta: [
      {
        title: `Program - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Program',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ProgramTable />
    </>
  );
}
