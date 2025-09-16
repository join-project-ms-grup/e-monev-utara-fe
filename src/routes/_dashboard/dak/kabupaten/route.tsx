import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/dak/kabupaten')({
  staticData: {
    title: 'DAK Kabupaten',
  },
  component: Outlet,
});
