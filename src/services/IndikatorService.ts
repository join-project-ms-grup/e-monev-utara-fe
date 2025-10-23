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
  const response = await api.get<ApiResponse<IndikatorMasterTree[]>>(`/indikator/list/${id}`);
  return response.data.data;
};

/**
 * Menambahkan data indikator
 */
export const addIndikator = async (payload: IndikatorForm): Promise<IndikatorForm> => {
  const response = await api.post<ApiResponse<IndikatorForm>>("/indikator/add", payload);
  return response.data.data;
};

/**
 * Update data indikator
 */
export const updateIndikator = async (payload: IndikatorForm): Promise<IndikatorForm> => {
  const response = await api.put<ApiResponse<IndikatorForm>>("/indikator/update", payload);
  return response.data.data;
};