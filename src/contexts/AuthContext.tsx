import { createContext, useContext, useState } from "react"
import router from "../router"

export interface AuthContextType {
  token: string | null
  login: (newToken: string) => void
  logout: () => void
  loginDummy: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token")
  })

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    router.navigate({ to: "/" })
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    router.navigate({ to: "/auth" })
  }

  const loginDummy = () => {
    const dummy = "dummy-token-123"
    localStorage.setItem("token", dummy)
    setToken(dummy)
    console.log('AUTHCONTEXT')
    router.navigate({ to: "/" })
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loginDummy }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
