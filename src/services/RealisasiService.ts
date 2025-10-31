import api, { type ApiResponse } from "../lib/api";

export interface RealisasiTriwulan {
    triwulan?: string | number;
    realisasi?: string | number;
}

export interface RealisasiPagu {
    id_pagu: number;
    pagu: number;
    realisasi: number;
    realisasi_per_triwulan?: RealisasiTriwulan[];
}

export interface RealisasiMaster extends RealisasiPagu {
    id?: number;
    kodeFull?: (string | number)[];
    kode?: string | number;
    name?: string;
    type?: string;
}
export interface RealisasiMasterUrusan extends RealisasiMaster {
    bidang?: RealisasiMasterBidang[];
}
export interface RealisasiMasterBidang extends RealisasiMaster {
    program?: RealisasiMasterProgram[];
}
export interface RealisasiMasterProgram extends RealisasiMaster {
    kegiatan?: RealisasiMasterKegiatan[];
}
export interface RealisasiMasterKegiatan extends RealisasiMaster {
    subKegiatan?: RealisasiMasterSubKegiatan[];
}
export interface RealisasiMasterSubKegiatan extends RealisasiMaster {
}
export type RealisasiMasterTree = RealisasiMasterUrusan & RealisasiMasterBidang & RealisasiMasterProgram & RealisasiMasterKegiatan & RealisasiMasterSubKegiatan;

export interface RealisasiForm {
    master_name?: string;
    id_pagu?: number;
    realisasi?: RealisasiTriwulan[];
}

/**
 * Ambil semua data realisasi
 */
export const getRealisasi = async (skpd_periode_id: number, tahun_ke: number): Promise<RealisasiMasterTree[]> => {
  try {
    const response = await api.get<ApiResponse<RealisasiMasterTree[]>>(`/realisasi-anggaran/list/${skpd_periode_id}/${tahun_ke}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

type ChildKey = 'bidang' | 'program' | 'kegiatan' | 'subKegiatan';
/**
 * Ambil semua flat data realisasi
 */
export const getRealisasiFlat = async (
    skpd_periode_id: number, tahun_ke: number,
): Promise<(RealisasiMaster & { parentId?: number | string; depth: number; })[]> => {
    const treeData = await getRealisasi(skpd_periode_id, tahun_ke);
    const flatData: (RealisasiMaster & { parentId?: number | string; depth: number; })[] = [];

    const childKeys: ChildKey[] = ['bidang', 'program', 'kegiatan', 'subKegiatan'];

    function flattenNode(
        node: RealisasiMaster,
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
                children.forEach((child: RealisasiMaster) =>
                    flattenNode(child, node.id, kodeFull, depth + 1)
                );
            }
        });
    }
    treeData.forEach((item) => flattenNode(item));
    return flatData;
};

/**
 * Menambahkan data realisasi
 */
export const addRealisasi = async (payload: RealisasiForm): Promise<RealisasiForm> => {
    const response = await api.post<ApiResponse<RealisasiForm>>("/realisasi-anggaran/update", payload);
    return response.data.data;
};