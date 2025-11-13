import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/rkpd/iku_ikd/')({
  loader: () => {
    throw redirect({ to: '/rkpd/iku_ikd/tagging', replace: true });
  },
});
