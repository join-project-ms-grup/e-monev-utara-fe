import api, { type ApiResponse } from "../lib/api";

export interface RoleType {
    id?: number;
    kode?: string | number;
    name?: string;
    author_id?: number;
    created_at?: string;
    updated_at?: string;
}
export type RoleForm = Pick<RoleType, 'id' | 'kode' | 'name'>;

/**
 * Ambil semua role untuk Developer
 */
export const getRoleDev = async (): Promise<RoleType[]> => {
    const response = await api.get<ApiResponse<RoleType[]>>("/role/list/dev");
    return response.data.data;
};

/**
 * Ambil semua role untuk Admin
 */
export const getRoleAdmin = async (): Promise<RoleForm[]> => {
    const response = await api.get<ApiResponse<RoleForm[]>>("/role/list");
    return response.data.data;
};

/**
 * Menambahkan data role
 */
export const addRole = async (payload: RoleForm): Promise<RoleForm> => {
    const response = await api.post<ApiResponse<RoleForm>>("/role/add", payload);
    return response.data.data;
};

/**
 * Update data role
 */
export const updateRole = async (id: number, payload: RoleForm): Promise<RoleForm> => {
    const response = await api.put<ApiResponse<RoleForm>>(`/role/update/${id}`, payload);
    return response.data.data;
};

/**
 * Hapus data role
 */
export const deleteRole = async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/role/delete/${id}`);
    return response.data;
};