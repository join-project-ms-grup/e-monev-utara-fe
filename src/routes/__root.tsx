import { HeadContent, Outlet, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import type { AuthContextType } from '../contexts/AuthContext'

interface AuthType{
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<AuthType>()({
  component: RootComponent,
})

function RootComponent() {
  const router = useRouter();
  const user = router.options.context.auth;
  console.log(user)

  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  )
}