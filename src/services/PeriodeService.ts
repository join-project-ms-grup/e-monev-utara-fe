import api, { type ApiResponse } from "../lib/api";

export interface Periode {
    id?: number;
    mulai?: string | number;
    akhir?: string | number;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}
export type PeriodeForm = Pick<Periode, 'id' | 'mulai' | 'akhir' | 'status'>;

/**
 * Ambil semua data periode
 */
export const getPeriode = async (): Promise<Periode[]> => {
    const response = await api.get<ApiResponse<Periode[]>>("/periode/list");
    return response.data.data;
};

/**
 * Menambahkan data periode
 */
export const addPeriode = async (payload: PeriodeForm): Promise<PeriodeForm> => {
    const response = await api.post<ApiResponse<PeriodeForm>>("/periode/add", payload);
    return response.data.data;
};

/**
 * Update data periode
 */
export const updatePeriode = async (id: number, payload: PeriodeForm): Promise<PeriodeForm> => {
    const response = await api.put<ApiResponse<PeriodeForm>>(`/periode/update/${id}`, payload);
    return response.data.data;
};

/**
 * Hapus data periode
 */
export const deletePeriode = async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/periode/delete/${id}`);
    return response.data;
};