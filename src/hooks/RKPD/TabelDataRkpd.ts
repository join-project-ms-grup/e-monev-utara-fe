import { useQuery } from "@tanstack/react-query";
import { getDashRankingRkpd, type DashRankRKPDForm } from "../../services/DashRKPDService";

export const useGetDashRankRKPD = (payload: DashRankRKPDForm) => {
    return useQuery({
        queryKey: ['tabel_ranking_rkpd', payload.periode_id, payload.tahun_ke, payload.triwulan],
        queryFn: () => getDashRankingRkpd(payload),
        enabled: !!(payload.periode_id, payload.tahun_ke, payload.triwulan)
    });
}