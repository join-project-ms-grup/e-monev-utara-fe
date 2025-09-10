import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/master/rekening')({
  staticData: {
    title: 'Rekening',
  },
  component: Outlet,
});
