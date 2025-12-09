import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/rkpd/iku_ikd')({
    staticData: {
        title: 'IKU - IKD',
    },
    component: Outlet,
})
