import { createFileRoute, Outlet } from '@tanstack/react-router'


export const Route = createFileRoute('/_dashboard/konfigurasi')({
    staticData: {
        title: 'Konfigurasi',
    },
    component: Outlet,
})
