import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/master/')({
  loader: () => {
    throw redirect({ to: '/master/organisasi', replace: true })
  }
})
