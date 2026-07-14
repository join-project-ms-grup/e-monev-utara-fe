import { useQuery } from "@tanstack/react-query";
import { getDashRankingRkpd, type DashRankRKPDForm } from "../../services/DashRKPDService";
import { GetRekapDAK, type RekapDAKPayload } from "../../services/DAK/DAKMonitoringService";

export const useGetDashRankRKPD = (payload: DashRankRKPDForm) => {
    return useQuery({
        queryKey: ['tabel_ranking_rkpd', payload.periode_id, payload.tahun_ke, payload.triwulan],
        queryFn: () => getDashRankingRkpd(payload),
        enabled: !!(payload.periode_id, payload.tahun_ke, payload.triwulan)
    });
}

export const useGetRekapDAK = (payload: RekapDAKPayload) => {
    return useQuery({
        queryKey: ['tabel_ranking_rkpd', payload.tahun, payload.triwulan, payload.jenis],
        queryFn: () => GetRekapDAK(payload),
        enabled: !!(payload.jenis, payload.tahun, payload.triwulan)
    });
}