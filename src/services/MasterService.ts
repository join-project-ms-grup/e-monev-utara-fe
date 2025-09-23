import api, { type ApiResponse } from "../lib/api";

export interface Master {
  id?: number;
  kode?: string | number;
  name?: string;
  type?: string;
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
export const getMaster = async (): Promise<Master[]> => {
  const response = await api.get<ApiResponse<Master[]>>("/master/list/all");
  return response.data.data;
};

/**
 * Ambil semua data
 */
export const getRekening = async (): Promise<MasterUrusan[]> => {
  const response = await api.get<ApiResponse<MasterUrusan[]>>("/master/list/all");

  const rawData = response.data.data;
  const cleanData = rawData.map((urusan) => ({
    ...urusan,
    bidang: urusan.bidang?.map((bid) => ({
      group: urusan.name,
      ...bid,
      program: bid.program?.map((prog) => ({
        group: bid.name,
        ...prog,
        kegiatan: prog.kegiatan?.map((keg) => ({
          group: prog.name,
          ...keg,
          subKegiatan: keg.subKegiatan?.map((subkeg) => ({
            group: keg.name,
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
    ...urusan,
    bidang: urusan.bidang?.map((bid) => ({
      ...bid,
      program: bid.program?.map((prog) => ({
        ...prog,
        kegiatan: prog.kegiatan?.map((keg) => ({
          ...keg,
          subKegiatan: keg.subKegiatan?.map((subkeg) => ({
            ...subkeg
          })),
        })),
      })),
    })),
  }));
  return cleanData;
};
// export const getMasterFilter = async (payload: MasterFilter): Promise<MasterUrusan[]> => {
//   const response = await api.post<ApiResponse<any[]>>("/master/children-from", payload);
//   const rawData = response.data.data;
//   const dataArray = Array.isArray(rawData) ? rawData : [rawData];
//   const cleanData = dataArray.map((urusan) => ({
//     id: urusan.id_urusan,
//     kode: urusan.kode_urusan,
//     name: urusan.urusan,
//     bidang: urusan.bidang?.map((bid: any) => ({
//       id: bid.id_bidang,
//       kode: bid.kode_bidang,
//       name: bid.bidang,
//       program: bid.program?.map((prog: any) => ({
//         id: prog.program,
//         kode: prog.kode_program,
//         name: prog.program,
//         kegiatan: prog.kegiatan?.map((keg: any) => ({
//           id: keg.kegiatan,
//           kode: keg.kode_kegiatan,
//           name: keg.kegiatan,
//           subKegiatan: keg.sub_kegiatan?.map((subkeg: any) => ({
//             id: subkeg.id_sub_kegiatan,
//             kode: subkeg.kode_sub_kegiatan,
//             name: subkeg.sub_kegiatan,
//           })),
//         })),
//       })),
//     })),
//   }));
//   return cleanData;
// };

export const getMasterRaw = async (payload: MasterFilter): Promise<MasterUrusan[]> => {
  const response = await api.post<ApiResponse<any[]>>("/master/children-from", payload);
  const data = response.data.data;
  console.log(data)
  return data
};