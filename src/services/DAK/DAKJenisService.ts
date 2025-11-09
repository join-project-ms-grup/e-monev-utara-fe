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

export const getSubJenisDAK = async (id: number): Promise<SubJenisDAK[]> => {
    const response = await api.post<ApiResponse<SubJenisDAK[]>>("/dak/jenis/list-sub", { kode_jenis: id });
    return response.data.data;
};