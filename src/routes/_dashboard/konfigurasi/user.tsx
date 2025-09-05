import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/konfigurasi/user')({
    head: () => ({
        meta: [
            {
                title: `User - ${SITE_NAME}`,
            },
        ],
    }),
    staticData: {
        title: 'User',
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Konfigurasi - User</h4>
            <span>Ini halaman konfigurasi user</span>
        </>
    )
}
