import api, { type ApiResponse } from "../lib/api";

export interface RenjaMasterUrusan extends RenjaMaster {
  bidang?: RenjaMasterBidang[];
}
export interface RenjaMasterBidang extends RenjaMaster {
  program?: RenjaMasterProgram[];
}
export interface RenjaMasterProgram extends RenjaMaster {
  kegiatan?: RenjaMasterKegiatan[];
}
export interface RenjaMasterKegiatan extends RenjaMaster {
  subKegiatan?: RenjaMasterSubKegiatan[];
}
export interface RenjaMasterSubKegiatan extends RenjaMaster {
}
export type RenjaMasterTree = RenjaMasterUrusan & RenjaMasterBidang & RenjaMasterProgram & RenjaMasterKegiatan & RenjaMasterSubKegiatan;

export interface RenjaMaster {
  id: number;
  kode: string;
  name: string;
  type?: string;
  pagu?: number;
}

export interface RenjaSKPD {
  kode: string;
  nama: string;
  pagu: string;
}

export interface Renja {
  data_rekening: RenjaMasterTree[]
  data_skpd: RenjaSKPD;
}

export interface RenjaGetForm {
  skpd_periode_id: number;
  tahun_ke: number;
  bidang: number | null
}

export interface RenjaDetailGetForm {
  skpd_periode_id: number;
  tahun_ke: number;
  sub_id: number
}

export interface RenjaDetail {
  skpd: string;
  urusan: string;
  bidang: string;
  program: string;
  kegiatan: string;
  subKegiatan: string;
  waktu: string;
  pagu: string;
  lokasi: string;
  indikator: [
    {
      name: string;
      target: string;
    },
  ],
}

export const getRenjaRENSTRA = async (payload: RenjaGetForm): Promise<Renja> => {
  const response = await api.post<ApiResponse<Renja>>("/renstra/renja/list-sub", payload);
  return response.data.data;
};

export const getRenjaDetailRENSTRA = async (payload: RenjaDetailGetForm): Promise<RenjaDetail> => {
  const response = await api.post<ApiResponse<RenjaDetail>>("/renstra/renja/detail-sub", payload);
  return response.data.data;
};

export const getRenjaRKPD = async (payload: RenjaGetForm): Promise<Renja> => {
  const response = await api.post<ApiResponse<Renja>>("/rkpd/renja/list-sub", payload);
  return response.data.data;
};

export const getRenjaDetailRKPD = async (payload: RenjaDetailGetForm): Promise<RenjaDetail> => {
  const response = await api.post<ApiResponse<RenjaDetail>>("/rkpd/renja/detail-sub", payload);
  return response.data.data;
};


export interface FlatRenja {
  level: string;
  id: number;
  kode_urusan: string;
  kode_bidang: string;
  kode_program: string;
  kode_kegiatan: string;
  kode_subKegiatan: string;
  rekening: string;
  pagu: number | string;
  perangkat_daerah: string;
  parent?: number;
}

export async function flatRenja(
  dataRespons: Renja,
): Promise<FlatRenja[]> {
  const dataExcel: FlatRenja[] = [];
  const skpd = dataRespons.data_skpd?.nama ?? "";

  const pushRow = (
    level: string,
    id: number,
    kodeParts: string[],
    name: string,
    pagu?: number,
    parent?: number,
  ) => {
    const [kode_urusan, kode_bidang, kode_program, kode_kegiatan, kode_subKegiatan] =
      kodeParts;

    dataExcel.push({
      level,
      id,
      kode_urusan,
      kode_bidang,
      kode_program,
      kode_kegiatan,
      kode_subKegiatan,
      rekening: name ?? "",
      pagu: pagu ?? "",
      perangkat_daerah: skpd,
      parent
    });
  };

  const dataRekening = dataRespons.data_rekening as RenjaMasterUrusan[];

  dataRekening.forEach((urusan) => {
    pushRow(
      "urusan",
      urusan.id,
      [urusan.kode ?? "", "", "", "", ""],
      urusan.name,
      urusan.pagu,
    );

    urusan.bidang?.forEach((bidang) => {
      pushRow(
        "bidang",
        bidang.id,
        [urusan.kode ?? "", bidang.kode ?? "", "", "", ""],
        bidang.name,
        bidang.pagu,
        urusan.id
      );

      bidang.program?.forEach((program) => {
        pushRow(
          "program",
          program.id,
          [urusan.kode ?? "", bidang.kode ?? "", program.kode ?? "", "", ""],
          program.name,
          program.pagu,
          bidang.id
        );

        program.kegiatan?.forEach((kegiatan) => {
          pushRow(
            "kegiatan",
            kegiatan.id,
            [
              urusan.kode ?? "",
              bidang.kode ?? "",
              program.kode ?? "",
              kegiatan.kode ?? "",
              "",
            ],
            kegiatan.name,
            kegiatan.pagu,
            program.id
          );

          kegiatan.subKegiatan?.forEach((sub) => {
            pushRow(
              "sub_kegiatan",
              sub.id,
              [
                urusan.kode ?? "",
                bidang.kode ?? "",
                program.kode ?? "",
                kegiatan.kode ?? "",
                sub.kode ?? "",
              ],
              sub.name,
              sub.pagu,
              kegiatan.id
            );
          });
        });
      });
    });
  });

  return dataExcel;
}
