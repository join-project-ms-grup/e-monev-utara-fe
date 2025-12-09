import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/ikd')({
    staticData: {
        title: 'Indikator Kinerja Daerah',
    },
    component: Outlet,
})