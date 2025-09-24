import api, { type ApiResponse } from "../lib/api";

export interface Master {
  id?: number;
  kode?: string | number;
  name?: string;
  rekening?: string;
  parent_id?: number;
}
export interface MasterUrusan extends Master {
  bidang?: MasterBidang[];
}
export interface MasterBidang extends Master {
  program?: MasterProgram[];
}
export interface MasterProgram extends Master {
  kegiatan?: MasterKegiatan[];
}
export interface MasterKegiatan extends Master {
  subKegiatan?: MasterSubKegiatan[];
}
export interface MasterSubKegiatan extends Master {
}
export type MasterTree = MasterUrusan & MasterBidang & MasterProgram & MasterKegiatan & MasterSubKegiatan;

/**
 * Ambil semua data
 */
export const getRekening = async (): Promise<MasterUrusan[]> => {
  const response = await api.get<ApiResponse<MasterUrusan[]>>("/master/list/all");

  const rawData = response.data.data;
  const cleanData = rawData.map((urusan) => ({
    rekening: 'urusan',
    ...urusan,
    bidang: urusan.bidang?.map((bid) => ({
      rekening: 'bidang',
      parent_id: urusan.id,
      ...bid,
      program: bid.program?.map((prog) => ({
        rekening: 'program',
        parent_id: bid.id,
        ...prog,
        kegiatan: prog.kegiatan?.map((keg) => ({
          rekening: 'kegiatan',
          parent_id: prog.id,
          ...keg,
          subKegiatan: keg.subKegiatan?.map((subkeg) => ({
            rekening: 'sub kegiatan',
            parent_id: keg.id,
            ...subkeg,
          })),
        })),
      })),
    })),
  }));
  return cleanData;
};

/**
 * Ambil semua urusan
 */
export const getUrusan = async (): Promise<Master[]> => {
  const response = await api.get<ApiResponse<Master[]>>("/master/list/urusan");
  return response.data.data;
};

/**
 * Ambil semua children
 */
export const getChildren = async (id: number): Promise<Master[]> => {
  const response = await api.get<ApiResponse<Master[]>>(`/master/list/children/${id}`);
  return response.data.data;
};

export interface MasterFilter {
  type?: string;
  id_urusan?: number;
  id_bidang?: number;
  id_program?: number;
  id_kegiatan?: number;
  id_subkegiatan?: number;
}

export const getMasterFilter = async (payload: MasterFilter): Promise<MasterUrusan[]> => {
  const response = await api.post<ApiResponse<MasterUrusan[]>>("/master/children-from", payload);
  const rawData = response.data.data;
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];
  const cleanData = dataArray.map((urusan) => ({
    rekening: 'urusan',
    ...urusan,
    bidang: urusan.bidang?.map((bid) => ({
      rekening: 'bidang',
      parent_id: urusan.id,
      ...bid,
      program: bid.program?.map((prog) => ({
        rekening: 'program',
        parent_id: bid.id,
        ...prog,
        kegiatan: prog.kegiatan?.map((keg) => ({
          rekening: 'kegiatan',
          parent_id: prog.id,
          ...keg,
          subKegiatan: keg.subKegiatan?.map((subkeg) => ({
            rekening: 'sub kegiatan',
            parent_id: keg.id,
            ...subkeg,
          })),
        })),
      })),
    })),
  }));
  return cleanData;
};

export const getMasterRaw = async (payload: MasterFilter): Promise<MasterUrusan[]> => {
  const response = await api.post<ApiResponse<any[]>>("/master/children-from", payload);
  const data = response.data.data;
  console.log(data)
  return data
};