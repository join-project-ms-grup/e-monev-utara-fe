import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getPeriodeFromCookie, getRoleId, isDev } from '../../../../lib/usercookie';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/_dashboard/dak/master')({
    beforeLoad: () => {
    const roleId = getRoleId();
    if (roleId) {
      if ([4].includes(roleId)) {
        toast.error('Tidak memiliki izin akses.');
        throw redirect({ to: '/', replace: true });
      }
    }
    if (!getPeriodeFromCookie() && !isDev()) {
      throw redirect({ to: '/', replace: true });
    }
  },
  staticData: {
    title: 'Master',
  },
  component: Outlet,
});
