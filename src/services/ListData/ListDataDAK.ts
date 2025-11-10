import { useQuery } from "@tanstack/react-query";
import { getBidangDAK, getSubBidangDAK } from "../DAK/DAKBidangService";
import { getTahunDAK } from "../DAK/DAKTahunService";
import { getOPDDAK } from "../DAK/DAKOPDService";
import { getSubJenisDAK } from "../DAK/DAKJenisService";

export const ListBidangDAK = () => {
    const { data } = useQuery({
        queryKey: ['list_bidang_dak'],
        queryFn: () => getBidangDAK(1),
    });
    const list =
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) || [];
    return list
}

export const ListSubBidangDAK = (dak_bidangId: number) => {
    const { data } = useQuery({
        queryKey: ['list_sub_bidang_dak', dak_bidangId],
        queryFn: () => getSubBidangDAK(dak_bidangId),
        enabled: !dak_bidangId,
    });
    const list =
        data?.flatMap((bidang) =>
            bidang.sub.map((subItem) => ({
                label: subItem.name,
                value: subItem.id.toString(),
            }))
        ) || [];
    return list
}

export const ListTahunDAK = () => {
    const { data } = useQuery({
        queryKey: ['list_tahun_dak'],
        queryFn: getTahunDAK,
    });
    const list =
        data?.map((item) => ({
            label: `${item.tahun}`,
            value: item.id?.toString(),
        })) || [];
    return list
}

export const ListOPDDAK = () => {
    const { data } = useQuery({
        queryKey: ['list_opd_dak'],
        queryFn: getOPDDAK,
    });
    const list =
        data?.map((item) => ({
            label: `${item.fullname}`,
            value: item.id?.toString(),
        })) || [];
    return list
}
export const ListSubJenisDAK = (kode_jenis: number) => {
    const { data } = useQuery({
        queryKey: ['list_sub_jenis_dak', kode_jenis],
        queryFn: () => getSubJenisDAK(kode_jenis),
        enabled: !kode_jenis,
    });
    const list =
        data?.map((item) => ({
            label: `${item.nama}`,
            value: item.id?.toString(),
        })) || [];
    return list
}