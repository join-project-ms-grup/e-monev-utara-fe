import api, { type ApiResponse } from "../lib/api";

export interface CapaianTriwulan {
    triwulan?: number;
    capaian?: number;
}

export interface CapaianIndikatorCapaian {
    capaianTotal?: number;
    perseCapaian?: number;
    capaianTriwulan?: CapaianTriwulan[];
}

export interface CapaianTarget {
    id_rincian?: number;
    tahun_ke?: number;
    target?: number;
}

export interface CapaianIndikator {
    id?: number;
    name?: string;
    satuan?: string;
    target?: CapaianTarget[];
    capaian?: CapaianIndikatorCapaian;
}

export interface CapaianMaster {
    id?: number;
    kode?: string | number;
    name?: string;
    type?: string;
    indikator?: CapaianIndikator[];
}
export interface CapaianMasterUrusan extends CapaianMaster {
    bidang?: CapaianMasterBidang[];
}
export interface CapaianMasterBidang extends CapaianMaster {
    program?: CapaianMasterProgram[];
}
export interface CapaianMasterProgram extends CapaianMaster {
    kegiatan?: CapaianMasterKegiatan[];
}
export interface CapaianMasterKegiatan extends CapaianMaster {
    subKegiatan?: CapaianMasterSubKegiatan[];
}
export interface CapaianMasterSubKegiatan extends CapaianMaster {
}
export type CapaianMasterTree = CapaianMasterUrusan & CapaianMasterBidang & CapaianMasterProgram & CapaianMasterKegiatan & CapaianMasterSubKegiatan;

export interface CapaianForm {
    indikator_name?: string;
    id_rincian?: number;
    capaian?: CapaianTriwulan[];
}

type CapaianNode = Record<string, any> & { children?: CapaianNode[] };
const levelKeys = ["bidang", "program", "kegiatan", "subKegiatan"];
const renameChildren = (data: CapaianNode[], level = 0): any[] => {
    return data.map(item => {
        const { children, ...rest } = item;
        const key = levelKeys[level];

        return {
            ...rest,
            ...(children && children.length
                ? { [key]: renameChildren(children, level + 1) }
                : {}),
        };
    });
};

/**
 * Ambil semua data realisasi
 */
export const getCapaian = async (skpd_periode_id: number, tahun_ke: number): Promise<CapaianMasterTree[]> => {
    const response = await api.get<ApiResponse<CapaianMasterTree[]>>(`/capaian/list/${skpd_periode_id}/${tahun_ke}`);
    // return response.data.data;
    const mappedData = renameChildren(response.data.data);
    console.log(mappedData)
    return mappedData;
};

/**
 * Menambahkan data realisasi
 */
export const addCapaian = async (payload: CapaianForm): Promise<CapaianForm> => {
    const response = await api.post<ApiResponse<CapaianForm>>("/capaian/update", payload);
    return response.data.data;
};