import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/iku/')({
    loader: () => {
        throw redirect({ to: '/rkpd/iku/iku_tagging', replace: true })
    }
})
