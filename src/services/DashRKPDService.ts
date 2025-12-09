import api, { type ApiResponse } from "../lib/api";

export interface DashboardInfo {
    totalSKPD: number,
    totalProgram: number,
    totalKegiatan: number,
    totalSubKegiatan: number
}

export const getDashInfo = async (): Promise<DashboardInfo> => {
    const response = await api.get<ApiResponse<DashboardInfo>>("/rkpd/info/dashboard-card-data");
    return response.data.data;
};

export interface DashboardRanking {
    triwulan: number;
    result: {
        rangking: number;
        kode: string;
        name: string;
        score: number;
        rata_rata_triwulan: {
            capaian: number;
            c_predikat: string;
            realisasi: number;
            r_predikat: string;
        };
        rata_rata_kumulatif: {
            capaian: number;
            c_predikat: string;
            realisasi: number;
            r_predikat: string;
        };
        total_realisasi: {
            triwulan: number;
            kumulatif: number;
        };
    }[]
}

export type DashboardRankingResult = {
    rangking: number;
    kode: string;
    name: string;
    score: number;
    rata_rata_triwulan: {
        capaian: number;
        c_predikat: string;
        realisasi: number;
        r_predikat: string;
    };
    rata_rata_kumulatif: {
        capaian: number;
        c_predikat: string;
        realisasi: number;
        r_predikat: string;
    };
    total_realisasi: {
        triwulan: number;
        kumulatif: number;
    };
};


export interface DashRankRKPDForm {
    periode_id: number;
    tahun_ke: number;
    triwulan: number;
}

export const getDashRankingRkpd = async (payload: DashRankRKPDForm): Promise<DashboardRanking> => {
    const response = await api.post<ApiResponse<DashboardRanking>>("/rkpd/info/ranking", payload);
    return response.data.data;
};