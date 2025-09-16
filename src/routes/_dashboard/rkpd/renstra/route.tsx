import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { getRoleId } from '../../../../lib/usercookie';

export const Route = createFileRoute('/_dashboard/rkpd/renstra')({
  beforeLoad: () => {
    const roleId = getRoleId();
    if (roleId) {
      if ([4].includes(roleId)) {
        toast.error('Tidak memiliki izin akses.');
        throw redirect({ to: '/', replace: true });
      }
    }
  },
  staticData: {
    title: 'Renstra',
  },
  component: Outlet,
});
