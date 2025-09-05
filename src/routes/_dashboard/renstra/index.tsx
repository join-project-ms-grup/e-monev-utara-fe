import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/renstra/')({
    loader: () => {
        throw redirect({ to: '/renstra/iop', replace: true })
    }
})
