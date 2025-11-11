import api, { type ApiResponse } from "../../lib/api";


export interface JenisDAK {
    id?: number;
    kode?: string | number;
    jenis?: string;
}

export const getJenisDAK = async (): Promise<JenisDAK[]> => {
    const response = await api.get<ApiResponse<JenisDAK[]>>("/dak/jenis/list");
    return response.data.data;
};

export interface SubJenisDAK {
    id?: number,
    jenis_dak?: number,
    nama?: string,
    keterangan?: string,
    status?: boolean,
    created_at?: string,
    updated_at?: string,
}

export const getSubJenisDAK = async (kode_jenis: number): Promise<SubJenisDAK[]> => {
    const response = await api.post<ApiResponse<SubJenisDAK[]>>("/dak/jenis/list-sub", { kode_jenis });
    return response.data.data;
};

export interface SubJenisDAKForm {
    id?: number;
    kode_jenis?: string | number;
    nama: string;
    keterangan: string | null
    status?: boolean
}

export const addSubjenisDAK = async (payload: SubJenisDAKForm): Promise<SubJenisDAKForm> => {
    const response = await api.post<ApiResponse<SubJenisDAKForm>>("/dak/jenis/add-sub", payload);
    return response.data.data;
};

export const updateSubJenisDAK = async (payload: SubJenisDAKForm): Promise<SubJenisDAKForm> => {
    const response = await api.put<ApiResponse<SubJenisDAKForm>>("/dak/jenis/update-sub", payload);
    return response.data.data;
};