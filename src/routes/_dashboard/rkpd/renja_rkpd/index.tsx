import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd/')({
  loader: () => {
    throw redirect({ to: '/rkpd/renja_rkpd/rekening', replace: true });
  },
});
