import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/rkpd/')({
  loader: () => {
    throw redirect({ to: '/', replace: true });
  },
});
