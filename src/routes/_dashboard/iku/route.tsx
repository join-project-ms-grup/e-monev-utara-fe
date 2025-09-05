import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/iku')({
    staticData: {
        title: 'Indikator Kinerja Utama',
    },
    component: Outlet,
})