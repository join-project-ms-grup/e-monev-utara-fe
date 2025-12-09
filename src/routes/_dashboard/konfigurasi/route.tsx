import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getPeriodeFromCookie, getRoleId, isDev } from '../../../lib/usercookie';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/_dashboard/konfigurasi')({
  beforeLoad: () => {
    const roleId = getRoleId();
    if (roleId) {
      if ([4,3].includes(roleId)) {
        toast.error('Tidak memiliki izin akses.');
        throw redirect({ to: '/', replace: true });
      }
    }
    if (!getPeriodeFromCookie() && !isDev()) {
      throw redirect({ to: '/', replace: true });
    }
  },
  staticData: {
    title: 'Konfigurasi',
  },
  component: Outlet,
});
