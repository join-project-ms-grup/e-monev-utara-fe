import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/renstra_rpjmd/')({
    loader: () => {
        throw redirect({ to: '/rkpd/renstra_rpjmd/rekening', replace: true })
    }
})
