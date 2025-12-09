import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/hasil_evaluasi')({
    staticData: {
        title: 'Hasil Evaluasi',
    },
    component: Outlet,
})