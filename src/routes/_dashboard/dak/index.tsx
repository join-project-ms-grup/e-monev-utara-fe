import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dak/')({
    loader: () => {
        throw redirect({ to: '/dak/daftardak', replace: true })
    }
})
