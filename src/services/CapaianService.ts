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
    kodeFull?: (string | number)[];
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
    const mappedData = renameChildren(response.data.data);
    return mappedData;
};

type ChildKey = 'bidang' | 'program' | 'kegiatan' | 'subKegiatan';
/**
 * Ambil semua flat data capaian
 */
export const getCapaianFlat = async (
    skpd_periode_id: number, tahun_ke: number,
): Promise<(CapaianMaster & { parentId?: number | string; depth: number; })[]> => {
    const treeData = await getCapaian(skpd_periode_id, tahun_ke);
    const flatData: (CapaianMaster & { parentId?: number | string; depth: number; })[] = [];

    const childKeys: ChildKey[] = ['bidang', 'program', 'kegiatan', 'subKegiatan'];

    function flattenNode(
        node: CapaianMaster,
        parentId?: number | string,
        parentKodeFull: (string | number)[] = [],
        depth = 0
    ): void {
        const kodeFull = [...parentKodeFull, node.kode ?? ''];
        const flatNode = {
            ...node,
            parentId,
            depth,
            kodeFull,
        };
        childKeys.forEach((key) => delete (flatNode as any)[key]);
        flatData.push(flatNode);
        childKeys.forEach((key) => {
            const children = (node as any)[key];
            if (Array.isArray(children)) {
                children.forEach((child: CapaianMaster) =>
                    flattenNode(child, node.id, kodeFull, depth + 1)
                );
            }
        });
    }
    treeData.forEach((item) => flattenNode(item));
    console.log('capaian flat', flatData)
    return flatData;
};

/**
 * Menambahkan data realisasi
 */
export const addCapaian = async (payload: CapaianForm): Promise<CapaianForm> => {
    const response = await api.post<ApiResponse<CapaianForm>>("/capaian/update", payload);
    return response.data.data;
};