import api, { type ApiResponse } from "../lib/api";

export interface Pagu {
  tahun_ke?: number | string;
  pagu?: number | string;
}

export interface PaguMaster {
  id?: number;
  kodeFull?: (string | number)[];
  kode?: string | number;
  name?: string;
  type?: string;
  pagu?: Pagu[];
}
export interface PaguMasterUrusan extends PaguMaster {
  bidang?: PaguMasterBidang[];
}
export interface PaguMasterBidang extends PaguMaster {
  program?: PaguMasterProgram[];
}
export interface PaguMasterProgram extends PaguMaster {
  kegiatan?: PaguMasterKegiatan[];
}
export interface PaguMasterKegiatan extends PaguMaster {
  subKegiatan?: PaguMasterSubKegiatan[];
}
export interface PaguMasterSubKegiatan extends PaguMaster {
}
export type PaguMasterTree = PaguMasterUrusan & PaguMasterBidang & PaguMasterProgram & PaguMasterKegiatan & PaguMasterSubKegiatan;

export interface PaguForm {
  skpd_periode_id?: number | string;
  master_id?: number | string;
  master_name?: string;
  target?: Pagu[];
}

/**
 * Ambil semua data pagu
 */
export const getPaguRENSTRA = async (id: number): Promise<PaguMasterTree[]> => {
  const response = await api.get<ApiResponse<PaguMasterTree[]>>(`/renstra/pagu/list/${id}`);
  return response.data.data;
};
export const getPaguRKPD = async (id: number): Promise<PaguMasterTree[]> => {
  const response = await api.get<ApiResponse<PaguMasterTree[]>>(`/rkpd/pagu/list/${id}`);
  return response.data.data;
};

type ChildKey = 'bidang' | 'program' | 'kegiatan' | 'subKegiatan';

/**
 * Ambil semua flat data pagu
 */
export const getPaguFlat = async (
  treeData: PaguMaster[]
): Promise<(PaguMaster & { parentId?: number | string; depth: number; })[]> => {
  const flatData: (PaguMaster & { parentId?: number | string; depth: number; })[] = [];

  const childKeys: ChildKey[] = ['bidang', 'program', 'kegiatan', 'subKegiatan'];

  function flattenNode(
    node: PaguMaster,
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
        children.forEach((child: PaguMaster) =>
          flattenNode(child, node.id, kodeFull, depth + 1)
        );
      }
    });
  }
  treeData.forEach((item) => flattenNode(item));
  return flatData;
};


/**
 * Menambahkan data pagu
 */
export const addPagu = async (payload: PaguForm): Promise<PaguForm> => {
  const response = await api.post<ApiResponse<PaguForm>>("/rkpd/pagu/add", payload);
  return response.data.data;
};

/**
 * Update data pagu
 */
export const updatePagu = async (payload: PaguForm): Promise<PaguForm> => {
  const response = await api.put<ApiResponse<PaguForm>>("/rkpd/pagu/update", payload);
  return response.data.data;
};