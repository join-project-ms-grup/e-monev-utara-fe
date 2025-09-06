import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/logout')({
    beforeLoad: ({ context }) => {
        const { token } = context.auth
        if (!token) {
            throw redirect({ to: "/auth" })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { logout } = useAuth()

    useEffect(() => {
        logout()
    }, [logout])

    return (
        <>
            <span>Logout...</span>
        </>
    )
}