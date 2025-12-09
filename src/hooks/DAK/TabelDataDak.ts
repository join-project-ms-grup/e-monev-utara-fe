import { useQuery } from "@tanstack/react-query";
import { getSubJenisDAK } from "../../services/DAK/DAKJenisService";
import { getBidangDAK, getSubBidangDAK } from "../../services/DAK/DAKBidangService";

export const useJenisDakData = (kode_jenis: number) => {
    return useQuery({
        queryKey: ['tabel_sub_jenis_dak', kode_jenis],
        queryFn: () => getSubJenisDAK(kode_jenis),
    });
}

export const useBidangDakData = (kode_jenis: number) => {
    return useQuery({
        queryKey: ['tabel_bidang_dak', kode_jenis],
        queryFn: () => getBidangDAK(kode_jenis),
        enabled: !!(kode_jenis)
    });
}

export const useSubBidangDAK = (dak_bidangId: number) => {
    return useQuery({
        queryKey: ['tabel_sub_bidang_dak', dak_bidangId],
        queryFn: () => getSubBidangDAK(dak_bidangId),
        enabled: !!(dak_bidangId)
    });
}