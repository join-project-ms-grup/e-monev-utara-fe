import api, { type ApiResponse } from "../lib/api";
import type { SKPDForm, SKPDFormState, SKPDType } from "../types/data";

/**
 * Ambil semua SKPD
 */
export const getSKPD = async (): Promise<SKPDType[]> => {
  const response = await api.get<ApiResponse<SKPDType[]>>("/skpd/list");
  return response.data.data;
};

/**
 * Menambahkan data SKPD
 */
export const addSKPD = async (payload: SKPDForm): Promise<SKPDForm> => {
  const response = await api.post<ApiResponse<SKPDForm>>("/skpd/add", payload);
  return response.data.data;
};

/**
 * Update data SKPD
 */
export const updateSKPD = async (id: number, payload: SKPDFormState): Promise<SKPDFormState> => {
  const response = await api.put<ApiResponse<SKPDFormState>>(`/skpd/update/${id}`, payload);
  return response.data.data;
};

/**
 * Hapus data SKPD
 */
export const deleteSKPD = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/skpd/delete/${id}`);
  return response.data;
};