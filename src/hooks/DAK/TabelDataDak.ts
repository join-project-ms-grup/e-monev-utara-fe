import { useQuery } from "@tanstack/react-query";
import { getSubJenisDAK } from "../../services/DAK/DAKJenisService";

export const useJenisDakData = (kode_jenis: number) => {
    return useQuery({
        queryKey: ['tabel_sub_jenis_dak', kode_jenis],
        queryFn: () => getSubJenisDAK(kode_jenis),
    });
}