import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/renstra_rpjmd')({
    staticData: {
        title: 'RENSTRA - RPJMD',
    },
    component: Outlet,
})