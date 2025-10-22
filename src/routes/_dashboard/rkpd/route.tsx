import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import toast from 'react-hot-toast';
import { getPeriodeFromCookie, getRoleId } from '../../../lib/usercookie';

export const Route = createFileRoute('/_dashboard/rkpd')({
  beforeLoad: () => {
    const roleId = getRoleId();
    if (roleId) {
      if ([4].includes(roleId)) {
        toast.error('Tidak memiliki izin akses.');
        throw redirect({ to: '/', replace: true });
      }
    }
    if(!getPeriodeFromCookie()){
      throw redirect({ to: '/', replace: true });
    }
  },
  staticData: {
    title: 'RKPD',
  },
  component: Outlet,
});
