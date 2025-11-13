import type { ApiResponse } from "../lib/api";
import api from "../lib/api";

export interface CatatanForm {
    skpd_periode_id?: number
    type?: string
    pendorong?: string
    penghambat?: string
    tl_1?: string
    tl_2?: string
}

export const getCatatanEvaluasi = async (payload: Pick<CatatanForm, 'skpd_periode_id' | 'type'>): Promise<Omit<CatatanForm, 'type' | 'skpd_periode_id'>> => {
    const response = await api.post<ApiResponse<Omit<CatatanForm, 'type' | 'skpd_periode_id'>>>(`/renstra/hasil/get-catatan`, payload);
    return response.data.data;
};

export const updateCatatanEvaluasi = async (payload: CatatanForm): Promise<CatatanForm> => {
    const response = await api.post<ApiResponse<CatatanForm>>(`/renstra/hasil/cu-catatan`, payload);
    return response.data.data;
};