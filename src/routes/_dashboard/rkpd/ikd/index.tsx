import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/ikd/')({
    loader: () => {
        throw redirect({ to: '/rkpd/ikd/ikd_tagging', replace: true })
    }
})
