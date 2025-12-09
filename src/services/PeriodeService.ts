import api, { type ApiResponse } from "../lib/api";

export interface Periode {
    id?: number;
    mulai?: string | number;
    akhir?: string | number;
    skpds?: string | number[];
    status: boolean;
    created_at?: string;
    updated_at?: string;
}
export type PeriodeForm = Pick<Periode, 'id' | 'mulai' | 'akhir' | 'status' | 'skpds'>;

export interface SKPDPeriode {
    id?: number;
    periode_id?: number;
    periode?: string;
    skpd_id?: number;
    skpd_kode?: string;
    skpd_name?: string;
    status?: boolean;
}

/**
 * Ambil semua data periode
 */
export const getPeriode = async (): Promise<Periode[]> => {
    const response = await api.get<ApiResponse<Periode[]>>("/config/periode/list");
    return response.data.data;
};

/**
 * Menambahkan data periode
 */
export const addPeriode = async (payload: PeriodeForm): Promise<PeriodeForm> => {
    const response = await api.post<ApiResponse<PeriodeForm>>("/config/periode/add", payload);
    return response.data.data;
};

/**
 * Update data periode
 */
export const updatePeriode = async (id: number, payload: PeriodeForm): Promise<PeriodeForm> => {
    const response = await api.put<ApiResponse<PeriodeForm>>(`/config/periode/update/${id}`, payload);
    return response.data.data;
};

/**
 * Hapus data periode
 */
export const deletePeriode = async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/periode/delete/${id}`);
    return response.data;
};

/**
 * Ambil data SKPD by periode
 */
export const getSKPDPerRENSTRA = async (id: number) => {
    const response = await api.get<ApiResponse<SKPDPeriode[]>>(`/renstra/skpd-periode/list/${id}`);
    return response.data.data;
};
export const getSKPDPerRKPD = async (id: number) => {
    const response = await api.get<ApiResponse<SKPDPeriode[]>>(`/rkpd/skpd-periode/list/${id}`);
    return response.data.data;
};