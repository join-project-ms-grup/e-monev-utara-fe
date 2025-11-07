import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/master/')({
  loader: () => {
    throw redirect({ to: '/master/rekening', replace: true })
  }
})
