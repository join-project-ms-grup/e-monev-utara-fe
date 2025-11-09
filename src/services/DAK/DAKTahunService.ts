import api, { type ApiResponse } from "../../lib/api";


export interface TahunDAK {
    id?: number;
    tahun?: string | number;
    keterangan?: string;
    status?: boolean;
}

export interface TahunDAKForm {
    id?: number;
    tahun?: string | number;
    keterangan?: string;
}

export const getTahunDAK = async (): Promise<TahunDAK[]> => {
    const response = await api.get<ApiResponse<TahunDAK[]>>("/dak/tahun/list");
    return response.data.data;
};

export const addTahunDAK = async (payload: TahunDAKForm): Promise<TahunDAKForm> => {
    const response = await api.post<ApiResponse<TahunDAKForm>>("/dak/tahun/set", payload);
    return response.data.data;
};

export const updateTahunDAK = async (payload: TahunDAKForm): Promise<TahunDAKForm> => {
    const response = await api.put<ApiResponse<TahunDAKForm>>(`/dak/tahun/update/`, payload);
    return response.data.data;
};

export const toggleTahunDAK = async (id: number): Promise<any> => {
    const response = await api.patch<ApiResponse<any>>(`/dak/tahun/status/`, {id: id});
    return response.data.data;
};