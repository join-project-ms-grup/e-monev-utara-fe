import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <h4>Ini Layout Auth</h4>
    <Outlet />
    </>
  )
}
