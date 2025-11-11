import { useQuery } from "@tanstack/react-query";
import { getBidangDAK, getSubBidangDAK } from "../../services/DAK/DAKBidangService";
import { getTahunDAK } from "../../services/DAK/DAKTahunService";
import { getOPDDAK } from "../../services/DAK/DAKOPDService";
import { getSubJenisDAK } from "../../services/DAK/DAKJenisService";
import { getRekBidangDAK, getRekKegiatanDAK, getRekProgramDAK, getRekSubKegiatanDAK, getRekUrusanDAK } from "../../services/DAK/DAKRekeningService";
import type { OptionItem } from "../../components/inputs/InputSearchBox";
import { getIdentifikasiDetailDAK } from "../../services/DAK/DAKIdentifikasiService";

//#region LIST BIDANG
export const useListBidangDAK = (jenis_dak: number) => {
    const { data } = useQuery({
        queryKey: ['list_bidang_dak', jenis_dak],
        queryFn: () => getBidangDAK(jenis_dak),
        enabled: !!(jenis_dak)
    });
    return (
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}
//#endregion

export const useListSubBidangDAK = (dak_bidangId: number) => {
    const { data } = useQuery({
        queryKey: ['list_sub_bidang_dak', dak_bidangId],
        queryFn: () => getSubBidangDAK(dak_bidangId),
        enabled: !!(dak_bidangId),
    });
    return (
        data?.flatMap((bidang) =>
            bidang.sub.map((subItem) => ({
                label: subItem.name,
                value: subItem.id.toString(),
            }))
        ) as OptionItem[] || []
    )
}

export const useListTahunDAK = () => {
    const { data } = useQuery({
        queryKey: ['list_tahun_dak'],
        queryFn: getTahunDAK,
    });
    return (
        data?.map((item) => ({
            label: `${item.tahun}`,
            value: item.tahun?.toString(),
        })) as OptionItem[] || []
    );
};

export const useListOPDDAK = () => {
    const { data } = useQuery({
        queryKey: ['list_opd_dak'],
        queryFn: getOPDDAK,
    });
    return (
        data?.map((item) => ({
            label: `${item.fullname}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}
export const useListSubJenisDAK = (kode_jenis: number) => {
    const { data } = useQuery({
        queryKey: ['list_sub_jenis_dak', kode_jenis],
        queryFn: () => getSubJenisDAK(kode_jenis),
        enabled: !!(kode_jenis),
    });
    return (
        data?.map((item) => ({
            label: `${item.nama}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}

// Rekening DAK
export const useListRekUrusanDAK = () => {
    const { data } = useQuery({
        queryKey: ['list_rek_urusan_dak'],
        queryFn: getRekUrusanDAK,
    });
    return (
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}
export const useListRekBidangDAK = (id_urusan: number | null) => {
    const { data } = useQuery({
        queryKey: ['list_rek_bidang_dak', id_urusan],
        queryFn: () => getRekBidangDAK(id_urusan),
        enabled: !!(id_urusan)
    });
    return (
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}

export const useListRekProgramDAK = (id_urusan: number, id_bidang: number | null) => {
    const { data } = useQuery({
        queryKey: ['list_rek_program_dak', id_urusan, id_bidang],
        queryFn: () => getRekProgramDAK(id_urusan, id_bidang),
        enabled: !!(id_urusan && id_bidang)
    });
    return (
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}

export const useListRekKegiatanDAK = (id_urusan: number, id_bidang: number, id_program: number | null) => {
    const { data } = useQuery({
        queryKey: ['list_rek_kegiatan_dak', id_urusan, id_bidang, id_program],
        queryFn: () => getRekKegiatanDAK(id_urusan, id_bidang, id_program),
        enabled: !!(id_urusan && id_bidang && id_program)
    });
    return (
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}

export const useListRekSubKegiatanDAK = (id_urusan: number, id_bidang: number, id_program: number, id_kegiatan: number | null) => {
    const { data } = useQuery({
        queryKey: ['list_rek_sub_kegiatan_dak', id_urusan, id_bidang, id_program, id_kegiatan],
        queryFn: () => getRekSubKegiatanDAK(id_urusan, id_bidang, id_program, id_kegiatan),
        enabled: !!(id_urusan && id_bidang && id_program && id_kegiatan)
    });
    return (
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}

//#region GET DETAIL DAK
export const useGetIdentDetailDAK = (id_ident: number | null) => {
    const { data } = useQuery({
        queryKey: ['detail_identifikasi_dak', id_ident],
        queryFn: () => getIdentifikasiDetailDAK(Number(id_ident)),
        enabled: !!(id_ident)
    });
    return data
}
//#endregion
