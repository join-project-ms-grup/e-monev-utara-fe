import api, { type ApiResponse } from "../lib/api";

export interface Master {
  id?: number;
  kode?: string | number;
  name?: string;
  rekening?: string;
  parent?: string | number;
  type?: string;
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
      parent: urusan.id,
      ...bid,
      program: bid.program?.map((prog) => ({
        rekening: 'program',
        parent: bid.id,
        ...prog,
        kegiatan: prog.kegiatan?.map((keg) => ({
          rekening: 'kegiatan',
          parent: prog.id,
          ...keg,
          subKegiatan: keg.subKegiatan?.map((subkeg) => ({
            rekening: 'sub kegiatan',
            parent: keg.id,
            ...subkeg,
          })),
        })),
      })),
    })),
  }));
  console.log('GETREKENING', cleanData)
  return cleanData;
};

export const getRekeningFlat = async (): Promise<Master[]> => {
  const response = await api.get<ApiResponse<MasterUrusan[]>>("/master/list/all");
  const rawData = response.data.data;

  const flatData: Master[] = [];

  rawData.forEach((urusan) => {
    flatData.push({
      rekening: "urusan",
      id: urusan.id,
      kode: urusan.kode,
      name: urusan.name,
      parent: '',
      type: urusan.type,
    });

    urusan.bidang?.forEach((bid) => {
      flatData.push({
        rekening: "bidang",
        id: bid.id,
        kode: bid.kode,
        name: bid.name,
        parent: urusan.id,
        type: bid.type,
      });

      bid.program?.forEach((prog) => {
        flatData.push({
          rekening: "program",
          id: prog.id,
          kode: prog.kode,
          name: prog.name,
          parent: bid.id,
          type: prog.type,
        });

        prog.kegiatan?.forEach((keg) => {
          flatData.push({
            rekening: "kegiatan",
            id: keg.id,
            kode: keg.kode,
            name: keg.name,
            parent: prog.id,
            type: keg.type,
          });

          keg.subKegiatan?.forEach((sub) => {
            flatData.push({
              rekening: "sub kegiatan",
              id: sub.id,
              kode: sub.kode,
              name: sub.name,
              parent: keg.id,
              type: sub.type,
            });
          });
        });
      });
    });
  });

  return flatData;
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
      parent: urusan.id,
      ...bid,
      program: bid.program?.map((prog) => ({
        rekening: 'program',
        parent: bid.id,
        ...prog,
        kegiatan: prog.kegiatan?.map((keg) => ({
          rekening: 'kegiatan',
          parent: prog.id,
          ...keg,
          subKegiatan: keg.subKegiatan?.map((subkeg) => ({
            rekening: 'sub kegiatan',
            parent: keg.id,
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

/**
 * Menambahkan data master
 */
export const addMaster = async (payload: Master): Promise<Master> => {
  const response = await api.post<ApiResponse<Master>>("/master/add", payload);
  return response.data.data;
};

/**
 * Update data master
 */
export const updateMaster = async (id: number, payload: Master): Promise<Master> => {
  const response = await api.put<ApiResponse<Master>>(`/master/update/${id}`, payload);
  return response.data.data;
};