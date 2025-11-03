import api, { type ApiResponse } from "../lib/api";
import { isAdmin } from "../lib/usercookie";
import type { RoleType } from "./RoleService";

export interface UserType {
  id?: number;
  name?: string;
  fullname?: string;
  avatar?: string;
  email?: string;
  role_id?: number | string;
  skpd_id?: number | string;
  password?: string;
  passwordConfirm?: string;
  token?: string;
  session?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
  userRole?: RoleType;
  userSkpd?: number;
}
export type UserForm = Pick<UserType, 'id' | 'name' | 'fullname' | 'email' | 'role_id' | 'skpd_id' | 'password' | 'passwordConfirm'>;

/**
 * Ambil semua user
 */
export const getUsers = async (): Promise<UserType[]> => {
  const response = await api.get<ApiResponse<UserType[]>>("/user/list");
  const users = response.data.data;

  if (isAdmin()) {
    return users.filter(user => user.role_id !== 1);
  }

  return users;
};


/**
 * Menambahkan data user
 */
export const addUser = async (payload: UserForm): Promise<UserForm> => {
    const response = await api.post<ApiResponse<UserForm>>("/user/add", payload);
    return response.data.data;
};

/**
 * Update data user
 */
export const updateUser = async (id: number, payload: UserForm): Promise<UserForm> => {
    const response = await api.put<ApiResponse<UserForm>>(`/user/update/${id}`, payload);
    return response.data.data;
};

/**
 * Patch status user
 */
export const setStatusUser = async (id: number) => {
  const response = await api.patch<ApiResponse<UserForm>>(`/user/status/${id}`);
  return response.data.data;
};

/**
 * Hapus data user
 */
export const deleteUser = async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/user/delete/${id}`);
    return response.data;
};