import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../configs/config';
import OrganisasiTable from '../../../components/tables/OrganisasiTable';

export const Route = createFileRoute('/_dashboard/master/organisasi')({
  head: () => ({
    meta: [
      {
        title: `Organisasi - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Organisasi',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <OrganisasiTable />
    </>
  );
}
