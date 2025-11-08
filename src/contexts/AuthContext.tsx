import { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import {
  getPeriodeFromCookie,
  skipPeriode,
  type PeriodeCookie,
} from '../lib/usercookie';

export interface LoggedUserType {
  nama: string;
  roleId: string | null;
  roleName: string | null;
  userSKPDId: number | null;
  username: string;
}

export interface AuthContextType {
  token: string | null;
  user: LoggedUserType | null;
  login: (data: { token: string; user: LoggedUserType }) => void;
  logout: () => void;
  periodeCookie: PeriodeCookie | null;
  skipPeriodeCookie: boolean;
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
    refreshPeriodeCookie();
    setToken(data.token);
    setUser(data.user);
    toast.success('Autentikasi berhasil');
  };
  const [periodeCookie, setPeriodeCookie] = useState(
    getPeriodeFromCookie() || null,
  );
  const [skipPeriodeCookie, setSkipPeriodeCookie] = useState(
    skipPeriode(),
  );
  const refreshPeriodeCookie = () => {
    const localPCookie = getPeriodeFromCookie();
    setPeriodeCookie(localPCookie);
    if (localPCookie) {
      toast.success(`Periode: ${localPCookie.mulai} - ${localPCookie.akhir}`);
    }

    const localSkipPCookie = skipPeriode();
    setSkipPeriodeCookie(localSkipPCookie);
  };

  const logout = () => {
    Cookies.remove('skip_periode');
    Cookies.remove('periode');
    refreshPeriodeCookie();
    Cookies.remove('token');
    Cookies.remove('me');
    setToken(null);
    setUser(null);
    toast.success('Logout berhasil');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        periodeCookie,
        skipPeriodeCookie,
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
