import Cookies from 'js-cookie';

export interface UserCookie {
  nama: string;
  roleId: number;
  roleName: string;
  userSKPDId: number | null;
  username: string;
}

export interface PeriodeCookie{
  id: number;
  mulai: number;
  akhir: number;
}

/**
 * Ambil user dari cookie
 */
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

export function getUserSKPDID(): |number | null {
  const user = getUserFromCookie();
  return user?.userSKPDId ?? null;
}

/**
 * Ambil role id dari cookie
 */
export function getRoleId(): number | null {
  const user = getUserFromCookie();
  return user?.roleId ?? null;
}

/**
 * Cek apakah user developer
 */
export function isDev(): boolean {
  const roleId = getRoleId();
  return roleId === 1;
}
/**
 * Cek apakah user admin
 */
export function isAdmin(): boolean {
  const roleId = getRoleId();
  return roleId === 2;
}
/**
 * Logic untuk pemilihan periode developer
 */
export function skipPeriode(): boolean {
  const skipPeriode = Cookies.get('skip_periode');
  return skipPeriode === '1';
}


/**
 * Ambil periode dari cookie
 */
export function getPeriodeFromCookie(): PeriodeCookie | null {
  const rawCookie = Cookies.get('periode');
  if (!rawCookie) return null;

  try {
    const decoded = decodeURIComponent(rawCookie);
    const parsed: PeriodeCookie = JSON.parse(decoded);
    return parsed;
  } catch (error) {
    console.error('Failed to parse cookie:', error);
    return null;
  }
}
export function getPeriodeIDFromCookie() {
  const periode = getPeriodeFromCookie();
  return periode?.id ?? null;
}
export function getPeriodeMulaiFromCookie() {
  const periode = getPeriodeFromCookie();
  return periode?.mulai ?? null;
}
export function getPeriodeAkhirFromCookie() {
  const periode = getPeriodeFromCookie();
  return periode?.akhir ?? null;
}
