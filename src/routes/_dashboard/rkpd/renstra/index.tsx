import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/renstra/')({
    loader: () => {
        throw redirect({ to: '/rkpd/renstra/iop', replace: true })
    }
})
