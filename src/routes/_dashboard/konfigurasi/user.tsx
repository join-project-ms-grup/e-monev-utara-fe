import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'
import UserTable from '../../../components/tables/UserTable'

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
            <UserTable />
        </>
    )
}
