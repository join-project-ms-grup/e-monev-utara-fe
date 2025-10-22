import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getPeriodeFromCookie } from '../../../lib/usercookie';

export const Route = createFileRoute('/_dashboard/konfigurasi')({
  beforeLoad: () => {
    if (!getPeriodeFromCookie()) {
      throw redirect({ to: '/', replace: true });
    }
  },
  staticData: {
    title: 'Konfigurasi',
  },
  component: Outlet,
});
