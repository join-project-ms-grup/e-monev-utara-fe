import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getPeriodeFromCookie } from '../../../lib/usercookie';

export const Route = createFileRoute('/_dashboard/master')({
  beforeLoad: () => {
    if (!getPeriodeFromCookie()) {
      throw redirect({ to: '/', replace: true });
    }
  },
  staticData: {
    title: 'Master',
  },
  component: Outlet,
});
