import Cookies from 'js-cookie';

export interface UserCookie {
  nama: string;
  roleId: number;
  roleName: string;
  opdId: number | null;
  username: string;
}

export function getUserFromCookie(): UserCookie | null {
  const rawCookie = Cookies.get('me');
  if (!rawCookie) return null;

  try {
    const decoded = decodeURIComponent(rawCookie);
    const parsed: UserCookie = JSON.parse(decoded);
    return parsed;
  } catch (error) {
    console.error('Failed to parse cookie:', error);
    return null;
  }
}

export function getRoleId(): number | null {
  const user = getUserFromCookie();
  return user?.roleId ?? null;
}
