import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/hasil_evaluasi/')({
    loader: () => {
        throw redirect({ to: '/rkpd/hasil_evaluasi/rkpd_tahunan', replace: true })
    }
})