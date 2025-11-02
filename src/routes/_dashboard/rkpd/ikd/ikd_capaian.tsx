import { createFileRoute } from '@tanstack/react-router';
import CapaianIKDTable from '../../../../components/tables/rkpd/ikd/CapaianIKDTable';
import { SITE_NAME } from '../../../../lib/config';

export const Route = createFileRoute('/_dashboard/rkpd/ikd/ikd_capaian')({
  head: () => ({
    meta: [
      {
        title: `Capaian Indikator IKD - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Capaian Indikator IKD',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CapaianIKDTable />
    </>
  );
}
