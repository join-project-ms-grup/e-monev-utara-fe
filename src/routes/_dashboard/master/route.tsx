import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/master')({
    staticData: {
        title: 'Master',
    },
    component: Outlet,
})
