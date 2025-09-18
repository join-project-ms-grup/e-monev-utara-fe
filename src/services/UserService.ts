import api, { type ApiResponse } from "../lib/api";
import type { UserForm, UserType } from "../types/data";

/**
 * Ambil semua user
 */
export const getUsers = async (): Promise<UserType[]> => {
  const response = await api.get<ApiResponse<UserType[]>>("/user/list");
  return response.data.data;
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
 * Hapus data user
 */
export const deleteUser = async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/user/delete/${id}`);
    return response.data;
};