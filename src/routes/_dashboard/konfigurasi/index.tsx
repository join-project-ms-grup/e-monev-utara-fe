import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/konfigurasi/')({
    loader: () => {
        throw redirect({ to: '/konfigurasi/user', replace: true })
    },
})
