import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/iku/')({
    loader: () => {
        throw redirect({ to: '/iku/iku_tagging', replace: true })
    }
})
