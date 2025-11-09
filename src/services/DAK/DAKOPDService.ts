import api, { type ApiResponse } from "../../lib/api";


export interface OPDDAK {
    id?: number;
    kode?: string | number;
    fullname?: string;
    shortname?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface OPDDAKForm {
    id?: number;
    kode?: string | number;
    shortname?: string;
    fullname?: string;
    status?: boolean;
}

/**
 * Ambil semua SKPD
 */
export const getOPDDAK = async (): Promise<OPDDAK[]> => {
    const response = await api.get<ApiResponse<OPDDAK[]>>("/dak/opd/list");
    return response.data.data;
};

/**
 * Menambahkan data SKPD
 */
export const addOPDDAK = async (payload: OPDDAKForm): Promise<OPDDAKForm> => {
    const response = await api.post<ApiResponse<OPDDAKForm>>("/dak/opd/add", payload);
    return response.data.data;
};

/**
 * Update data SKPD
 */
export const updateOPDDAK = async (payload: OPDDAKForm): Promise<OPDDAKForm> => {
    const response = await api.put<ApiResponse<OPDDAKForm>>(`/dak/opd/update/`, payload);
    return response.data.data;
};