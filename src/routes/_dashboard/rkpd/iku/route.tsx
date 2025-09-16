import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/iku')({
    staticData: {
        title: 'Indikator Kinerja Utama',
    },
    component: Outlet,
})