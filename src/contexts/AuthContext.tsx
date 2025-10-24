import { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { getPeriodeFromCookie, type PeriodeCookie } from '../lib/usercookie';

export interface LoggedUserType {
  nama: string;
  roleId: string | null;
  roleName: string | null;
  opdId: number | null;
  username: string;
}

export interface AuthContextType {
  token: string | null;
  user: LoggedUserType | null;
  login: (data: { token: string; user: LoggedUserType }) => void;
  logout: () => void;
  periodeCookie: PeriodeCookie | null;
  refreshPeriodeCookie: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return Cookies.get('token') || null;
  });
  const [user, setUser] = useState<LoggedUserType | null>(() => {
    const saved = Cookies.get('me');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data: { token: string; user: LoggedUserType }) => {
    Cookies.set('token', data.token, { sameSite: 'strict' });
    Cookies.set('me', JSON.stringify(data.user), {
      sameSite: 'strict',
    });
    setToken(data.token);
    setUser(data.user);
    toast.success('Autentikasi berhasil');
  };

  const logout = () => {
    Cookies.remove('periode');
    Cookies.remove('token');
    Cookies.remove('me');
    setToken(null);
    setUser(null);
    toast.success('Logout berhasil');
  };

  const [periodeCookie, setPeriodeCookie] = useState(
    getPeriodeFromCookie() || null,
  );
  const refreshPeriodeCookie = () => {
    setPeriodeCookie(getPeriodeFromCookie());
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        periodeCookie,
        refreshPeriodeCookie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
