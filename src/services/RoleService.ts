import api, { type ApiResponse } from "../lib/api";
import type { RoleAdminType, RoleDevType } from "../types/data";

// type ApiResponse<T> = {
//     success: boolean;
//     message: string;
//     data: T;
// };

export const getRoleDev = async (): Promise<RoleDevType[]> => {
    const response = await api.get<ApiResponse<RoleDevType[]>>("/role/list/dev");
    return response.data.data;
};

export const getRoleAdmin = async (): Promise<RoleAdminType[]> => {
    const response = await api.get<ApiResponse<RoleAdminType[]>>("/role/list");
    return response.data.data;
};

export const addRole = async (payload: RoleAdminType): Promise<RoleAdminType> => {
    const response = await api.post<ApiResponse<RoleAdminType>>("/role/add", payload);
    return response.data.data;
};

export const updateRole = async (id: number, payload: RoleAdminType): Promise<RoleAdminType> => {
    const response = await api.put<ApiResponse<RoleAdminType>>(`/role/update/${id}`, payload);
    return response.data.data;
};

export const deleteRole = async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/role/delete/${id}`);
    return response.data;
};