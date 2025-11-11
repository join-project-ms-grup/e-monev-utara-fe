import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/dak/master/')({
  loader: () => {
    throw redirect({ to: '/dak/master/rekening', replace: true });
  },
});
