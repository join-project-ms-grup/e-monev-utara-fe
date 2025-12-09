import api, { type ApiResponse } from "../lib/api";

export interface IndikatorTarget {
  tahun_ke?: string | number;
  target?: string | number;
}

export interface Indikator {
  id?: number
  name?: string;
  satuan?: string;
  target?: IndikatorTarget[];
}

export interface IndikatorMaster {
  id?: number;
  kodeFull?: (string | number)[];
  kode?: string | number;
  name?: string;
  type?: string;
  indikator?: Indikator[];
}
export interface IndikatorMasterUrusan extends IndikatorMaster {
  bidang?: IndikatorMasterBidang[];
}
export interface IndikatorMasterBidang extends IndikatorMaster {
  program?: IndikatorMasterProgram[];
}
export interface IndikatorMasterProgram extends IndikatorMaster {
  kegiatan?: IndikatorMasterKegiatan[];
}
export interface IndikatorMasterKegiatan extends IndikatorMaster {
  subKegiatan?: IndikatorMasterSubKegiatan[];
}
export interface IndikatorMasterSubKegiatan extends IndikatorMaster {
}
export type IndikatorMasterTree = IndikatorMasterUrusan & IndikatorMasterBidang & IndikatorMasterProgram & IndikatorMasterKegiatan & IndikatorMasterSubKegiatan;

export interface IndikatorForm {
  id?: number;
  skpd_periode_id?: string | number;
  master_id?: string | number;
  name?: string;
  satuan?: string;
  target?: IndikatorTarget[];
}

/**
 * Ambil semua data indikator
 */
export const getIndikator = async (id: number): Promise<IndikatorMasterTree[]> => {
  const response = await api.get<ApiResponse<IndikatorMasterTree[]>>(`/rkpd/indikator/list/${id}`);
  return response.data.data;
};

type ChildKey = 'bidang' | 'program' | 'kegiatan' | 'subKegiatan';
/**
 * Ambil semua flat data indikator
 */
export const getIndikatorFlat = async (
  id: number
): Promise<(IndikatorMaster & { parentId?: number | string; depth: number; })[]> => {
  const treeData = await getIndikator(id);
  const flatData: (IndikatorMaster & { parentId?: number | string; depth: number; })[] = [];

  const childKeys: ChildKey[] = ['bidang', 'program', 'kegiatan', 'subKegiatan'];

  function flattenNode(
    node: IndikatorMaster,
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
        children.forEach((child: IndikatorMaster) =>
          flattenNode(child, node.id, kodeFull, depth + 1)
        );
      }
    });
  }
  treeData.forEach((item) => flattenNode(item));
  return flatData;
};

/**
 * Menambahkan data indikator
 */
export const addIndikator = async (payload: IndikatorForm): Promise<IndikatorForm> => {
  const response = await api.post<ApiResponse<IndikatorForm>>("/rkpd/indikator/add", payload);
  return response.data.data;
};

/**
 * Update data indikator
 */
export const updateIndikator = async (id: number, payload: IndikatorForm): Promise<IndikatorForm> => {
  const response = await api.put<ApiResponse<IndikatorForm>>(`/rkpd/indikator/update/${id}`, payload);
  return response.data.data;
};