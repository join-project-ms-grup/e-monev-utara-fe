// import type { RoleType } from "../services/RoleService";

/**
 * User type
 */
// export interface UserType {
//   id: number;
//   name: string;
//   fullname: string;
//   avatar: string;
//   email: string;
//   role_id: number | null;
//   skpd_id: number | null;
//   password: string;
//   token: string;
//   session: string;
//   status: boolean;
//   created_at: string;
//   updated_at: string;
//   userRole: RoleType;
//   userSkpd: number;
// }
/**
 * User type untuk form
 */
// export type UserForm = Pick<UserType, 'name' | 'fullname' | 'email' | 'role_id' | 'skpd_id' | 'password'>;
/**
 * User type untuk form dengan id
 */
// export type UserFormState = UserForm & { id?: number | null };
/**
 * User type untuk delete
 */
// export type UserDeleteForm = Pick<UserType, 'id' | 'fullname'>;

/**
 * Master type
 */
export interface MasterType {
  id: number;
  kode: string;
  name: string;
  type: string;
  parent: number;
}
export interface UrusanType extends MasterType {
  bidang: BidangType[];
}
export interface BidangType extends MasterType {
  program: ProgramType[];
}
export interface ProgramType extends MasterType {
  kegiatan: KegiatanType[];
}
export interface KegiatanType extends MasterType {
  subKegiatan: SubKegiatanType[];
}
export interface SubKegiatanType extends MasterType {}