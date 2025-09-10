import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/master/rekening/')({
  loader: () => {
    throw redirect({ to: '/master/rekening/urusan', replace: true });
  },
});
