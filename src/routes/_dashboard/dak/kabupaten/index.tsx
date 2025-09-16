import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/dak/kabupaten/')({
  loader: () => {
    throw redirect({ to: '/dak/kabupaten/identifikasi', replace: true });
  },
});
