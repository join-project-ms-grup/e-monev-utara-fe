export interface RoleUserType {
    id: number;
    kode: number;
    name: string;
    author_id: number;
    created_at: string;
    updated_at: string;
}

export interface DataUserType {
    id: number;
    name: string;
    fullname: string;
    avatar: string;
    email: string;
    role_id: number;
    skpd_id: number;
    password: string;
    token: string;
    session: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    userRole: RoleUserType;
    userSkpd: number;
}

// Type SKPD
export interface SKPDType {
    id: number;
    kode: string | number;
    name: string;
    shortname: string;
    status: string | boolean;
    created_at: string;
    updated_at: string;
}
export type SKPDAddType = Pick<
  SKPDType,
  'kode' | 'name' | 'shortname'
>;
export type SKPDEditType = Omit<
  SKPDType,
  'created_at' | 'updated_at'
>;
export type SKPDDeleteype = Pick<
  SKPDType,
  'id' | 'name'
>;