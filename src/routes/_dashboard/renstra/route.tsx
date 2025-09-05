import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/renstra')({
    staticData: {
        title: 'Renstra',
    },
    component: Outlet,
})
