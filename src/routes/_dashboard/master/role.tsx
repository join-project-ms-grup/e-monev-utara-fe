import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import RoleTable from '../../../components/tables/RoleTable';

export const Route = createFileRoute('/_dashboard/master/role')({
  head: () => ({
    meta: [
      {
        title: `Role - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Role',
  },
  component: RouteComponent,
  context: () => ({
    getTitle: () => 'Role',
  }),
});

function RouteComponent() {
  return (
    <>
      <RoleTable />
    </>
  );
}
