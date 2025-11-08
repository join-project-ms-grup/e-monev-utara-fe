import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/renja_rkpd')({
    staticData: {
        title: 'RENJA - RKPD',
    },
    component: Outlet,
})