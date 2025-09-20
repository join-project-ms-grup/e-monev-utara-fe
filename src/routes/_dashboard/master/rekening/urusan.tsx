import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import UrusanTable from '../../../../components/tables/master/UrusanTable';

export const Route = createFileRoute('/_dashboard/master/rekening/urusan')({
  head: () => ({
    meta: [
      {
        title: `Urusan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Urusan',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <UrusanTable />
    </>
  );
}
