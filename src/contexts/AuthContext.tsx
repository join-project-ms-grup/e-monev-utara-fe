import { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export interface UserDataType {
  nama: string;
  roleId: string | null;
  roleName: string | null;
  opdId: number | null;
  username: string;
}

export interface AuthContextType {
  token: string | null
  user: UserDataType | null
  login: (data: { token: string; user: UserDataType }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return Cookies.get('token') || null;
  });
  const [user, setUser] = useState<UserDataType | null>(() => {
    const saved = Cookies.get('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data: { token: string; user: UserDataType }) => {
    Cookies.set('token', data.token, { expires: 1, sameSite: 'strict' });
    Cookies.set('user', JSON.stringify(data.user), {
      expires: 1,
      sameSite: 'strict',
    });
    setToken(data.token);
    setUser(data.user);
    toast.success('Autentikasi berhasil');
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setToken(null);
    setUser(null);
    toast.success('Logout berhasil');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
