import api from "../lib/api";
import type { SKPDAddType, SKPDEditType, SKPDType } from "../types/data";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const getSKPD = async (): Promise<SKPDType[]> => {
  const response = await api.get<ApiResponse<SKPDType[]>>("/skpd/list");
  return response.data.data;
};

export const addSKPD = async (payload: SKPDAddType): Promise<SKPDType> => {
  const response = await api.post<ApiResponse<SKPDType>>("/skpd/add", payload);
  return response.data.data;
};

export const updateSKPD = async (id: number, payload: Omit<SKPDEditType,'id'>): Promise<SKPDType> => {
  const response = await api.put<ApiResponse<SKPDType>>(`/skpd/update/${id}`, payload);
  return response.data.data;
};

export const deleteSKPD = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/skpd/delete/${id}`);
  return response.data;
};