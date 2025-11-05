import api, { type ApiResponse } from "../lib/api";

export interface DashboardInfo {
    totalSKPD: number,
    totalProgram: number,
    totalKegiatan: number,
    totalSubKegiatan: number
}

/**
 * Ambil semua info dashboard
 */
export const getDashInfo = async (): Promise<DashboardInfo> => {
    const response = await api.get<ApiResponse<DashboardInfo>>("info/dashboard-card-data");
    return response.data.data;
};