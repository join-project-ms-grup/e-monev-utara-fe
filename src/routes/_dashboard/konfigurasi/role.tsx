import { createFileRoute, redirect } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import RoleTable from '../../../components/tables/master/RoleTable';
import { getRoleId } from '../../../lib/usercookie';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/_dashboard/konfigurasi/role')({
  beforeLoad: () => {
    const roleId = getRoleId();
    if (roleId) {
      if (![1, 2].includes(roleId)) {
        toast.error('Tidak memiliki izin akses.');
        throw redirect({ to: '/', replace: true });
      }
    }
  },
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
