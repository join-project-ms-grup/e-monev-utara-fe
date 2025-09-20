import api, { type ApiResponse } from "../lib/api";
import type { MasterType, UrusanType } from "../types/data";

/**
 * Ambil semua data
 */
export const getMaster = async (): Promise<UrusanType[]> => {
  const response = await api.get<ApiResponse<UrusanType[]>>("/master/list/all");
  return response.data.data;
};

/**
 * Ambil semua urusan
 */
export const getUrusan = async (): Promise<MasterType[]> => {
  const response = await api.get<ApiResponse<MasterType[]>>("/master/list/urusan");
  return response.data.data;
};
/**
 * Ambil semua children
 */
export const getChildren = async (id: number): Promise<MasterType[]> => {
  const response = await api.get<ApiResponse<MasterType[]>>(`/master/list/children/${id}`);
  return response.data.data;
};