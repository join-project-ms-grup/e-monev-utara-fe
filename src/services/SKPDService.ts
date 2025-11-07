import api, { type ApiResponse } from "../lib/api";

export interface SKPDType {
  id?: number;
  kode?: string | number;
  name?: string;
  shortname?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}
export type SKPDForm = Pick<SKPDType, 'id' | 'kode' | 'name' | 'shortname' | 'status'>;

/**
 * Ambil semua SKPD
 */
export const getSKPD = async (): Promise<SKPDType[]> => {
  const response = await api.get<ApiResponse<SKPDType[]>>("/config/skpd/list");
  return response.data.data;
};

/**
 * Menambahkan data SKPD
 */
export const addSKPD = async (payload: SKPDForm): Promise<SKPDForm> => {
  const response = await api.post<ApiResponse<SKPDForm>>("/config/skpd/add", payload);
  return response.data.data;
};

/**
 * Update data SKPD
 */
export const updateSKPD = async (id: number, payload: SKPDForm): Promise<SKPDForm> => {
  const response = await api.put<ApiResponse<SKPDForm>>(`/config/skpd/update/${id}`, payload);
  return response.data.data;
};

/**
 * Hapus data SKPD
 */
export const deleteSKPD = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/skpd/delete/${id}`);
  return response.data;
};