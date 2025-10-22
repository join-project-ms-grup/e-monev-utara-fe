import api, { type ApiResponse } from "../lib/api";

export interface Pagu {
    tahun_ke?: number | string;
    pagu?: number | string;
}

export interface PaguMaster {
    id?: number;
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

export interface PaguForm{
  skpd_periode_id?: number | string;
  master_id?:number | string;
  target?: Pagu[];
}

/**
 * Ambil semua data pagu
 */
export const getPagu = async (id: number): Promise<PaguMasterTree[]> => {
    const response = await api.get<ApiResponse<PaguMasterTree[]>>(`/pagu/list/${id}`);
    return response.data.data;
};

/**
 * Menambahkan data pagu
 */
export const addPagu = async (payload: PaguForm): Promise<PaguForm> => {
    const response = await api.post<ApiResponse<PaguForm>>("/pagu/add", payload);
    return response.data.data;
};

/**
 * Update data pagu
 */
export const updatePagu = async (payload: PaguForm): Promise<PaguForm> => {
    const response = await api.put<ApiResponse<PaguForm>>("/pagu/update", payload);
    return response.data.data;
};