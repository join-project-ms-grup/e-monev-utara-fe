import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/dak/master')({
  staticData: {
    title: 'Master',
  },
  component: Outlet,
});
