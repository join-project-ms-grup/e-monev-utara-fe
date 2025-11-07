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
    data_rekening: []
    data_skpd: RenjaSKPD;
}

export interface RenjaGetForm {
    skpd_periode_id: number;
    tahun_ke: number;
    bidang: number
}

export const getRenja = async (payload: RenjaGetForm): Promise<RenjaGetForm> => {
    const response = await api.post<ApiResponse<RenjaGetForm>>("/rkpd/renja/list-sub", payload);
    return response.data.data;
};

// export interface FlatRKPD {
//     level: string;
//     sasaran: string;
//     kode_urusan: string;
//     kode_bidang: string;
//     kode_program: string;
//     kode_kegiatan: string;
//     kode_subKegiatan: string;
//     rekening: string;
//     indikator_kinerja: string;
//     satuan: string;
//     target_rpjmd_kinerja: number | string;
//     target_rpjmd_anggaran: number | string;

//     realisasi_rpjmd_kinerja: number | string;
//     realisasi_rpjmd_anggaran: number | string;

//     target_rkpd_kinerja: number | string;
//     target_rkpd_anggaran: number | string;

//     realisasi_triwulan_I_kinerja: number | string;
//     realisasi_triwulan_I_anggaran: number | string;

//     realisasi_triwulan_II_kinerja: number | string;
//     realisasi_triwulan_II_anggaran: number | string;

//     realisasi_triwulan_III_kinerja: number | string;
//     realisasi_triwulan_III_anggaran: number | string;

//     realisasi_triwulan_IV_kinerja: number | string;
//     realisasi_triwulan_IV_anggaran: number | string;

//     realisasi_rkpd_kinerja: number | string;
//     realisasi_rkpd_anggaran: number | string;

//     realisasi_rpjmd_sd_tahun_kinerja: number | string;
//     realisasi_rpjmd_sd_tahun_anggaran: number | string;

//     tingkat_capaian_rpjmd_kinerja: number | string;
//     tingkat_capaian_rpjmd_anggaran: number | string;

//     perangkat_daerah: string;
// }

// export async function flatRKPD(
//     dataRespons: RKPDMasterUrusan[],
//     skpd: string
// ): Promise<FlatRKPD[]> {
//     const dataExcel: FlatRKPD[] = [];

//     const pushRow = (
//         level: string,
//         kodeParts: string[],
//         name: string,
//         indikator?: Indikator[],
//         pagu?: RKPDPagu
//     ) => {
//         const [kode_urusan, kode_bidang, kode_program, kode_kegiatan, kode_subKegiatan] = kodeParts;

//         if (indikator && indikator.length > 0) {
//             indikator.forEach((ind) => {
//                 const indikatorNames = ind.name?.toString().split('\n\n') ?? [''];
//                 const targetRpjmdList = ind.target_akhir_periode?.toString().split('\n\n') ?? [''];
//                 const realisasiRpjmdList = ind.total_capaian_periode?.toString().split('\n\n') ?? [''];
//                 const targetRkpdList = ind.target_tahun_dievaluasi?.toString().split('\n\n') ?? [''];

//                 indikatorNames.forEach((nama, idx) => {
//                     dataExcel.push({
//                         level,
//                         sasaran: '',

//                         kode_urusan,
//                         kode_bidang,
//                         kode_program,
//                         kode_kegiatan,
//                         kode_subKegiatan,

//                         rekening: name ?? '',
//                         indikator_kinerja: nama.trim(),
//                         satuan: ind.satuan ?? '',

//                         target_rpjmd_kinerja: targetRpjmdList[idx]?.trim() ?? '',
//                         target_rpjmd_anggaran: pagu?.paguPeriode ?? '',

//                         realisasi_rpjmd_kinerja: realisasiRpjmdList[idx]?.trim() ?? '',
//                         realisasi_rpjmd_anggaran: pagu?.totalRealisasiPeriode ?? '',

//                         target_rkpd_kinerja: targetRkpdList[idx]?.trim() ?? '',
//                         target_rkpd_anggaran: pagu?.paguTahunEval ?? '',

//                         realisasi_triwulan_I_kinerja:
//                             ind.triwulan?.find((t) => t.triwulan === 1)?.capaian ?? '',
//                         realisasi_triwulan_I_anggaran:
//                             pagu?.triwulan?.find((t) => t.triwulan === 1)?.realisasi ?? '',

//                         realisasi_triwulan_II_kinerja:
//                             ind.triwulan?.find((t) => t.triwulan === 2)?.capaian ?? '',
//                         realisasi_triwulan_II_anggaran:
//                             pagu?.triwulan?.find((t) => t.triwulan === 2)?.realisasi ?? '',

//                         realisasi_triwulan_III_kinerja:
//                             ind.triwulan?.find((t) => t.triwulan === 3)?.capaian ?? '',
//                         realisasi_triwulan_III_anggaran:
//                             pagu?.triwulan?.find((t) => t.triwulan === 3)?.realisasi ?? '',

//                         realisasi_triwulan_IV_kinerja:
//                             ind.triwulan?.find((t) => t.triwulan === 4)?.capaian ?? '',
//                         realisasi_triwulan_IV_anggaran:
//                             pagu?.triwulan?.find((t) => t.triwulan === 4)?.realisasi ?? '',

//                         realisasi_rkpd_kinerja: ind.total_capaian ?? '',
//                         realisasi_rkpd_anggaran: pagu?.totalRealisasi ?? '',

//                         realisasi_rpjmd_sd_tahun_kinerja: ind.total_capaian_periode ?? '',
//                         realisasi_rpjmd_sd_tahun_anggaran: pagu?.totalRealisasiPeriode ?? '',

//                         tingkat_capaian_rpjmd_kinerja: ind.persen_capaian_periode ?? '',
//                         tingkat_capaian_rpjmd_anggaran: pagu?.persenRealisasiPeriode ?? '',

//                         perangkat_daerah: skpd,
//                     });
//                 });
//             });
//         } else {
//             dataExcel.push({
//                 level,
//                 sasaran: '',
//                 kode_urusan,
//                 kode_bidang,
//                 kode_program,
//                 kode_kegiatan,
//                 kode_subKegiatan,
//                 rekening: name ?? '',
//                 indikator_kinerja: '',
//                 satuan: '',
//                 target_rpjmd_kinerja: '',
//                 target_rpjmd_anggaran: pagu?.paguPeriode ?? '',
//                 realisasi_rpjmd_kinerja: '',
//                 realisasi_rpjmd_anggaran: pagu?.totalRealisasiPeriode ?? '',
//                 target_rkpd_kinerja: '',
//                 target_rkpd_anggaran: pagu?.paguTahunEval ?? '',
//                 realisasi_triwulan_I_kinerja: '',
//                 realisasi_triwulan_I_anggaran:
//                     pagu?.triwulan?.find((t) => t.triwulan === 1)?.realisasi ?? '',
//                 realisasi_triwulan_II_kinerja: '',
//                 realisasi_triwulan_II_anggaran:
//                     pagu?.triwulan?.find((t) => t.triwulan === 2)?.realisasi ?? '',
//                 realisasi_triwulan_III_kinerja: '',
//                 realisasi_triwulan_III_anggaran:
//                     pagu?.triwulan?.find((t) => t.triwulan === 3)?.realisasi ?? '',
//                 realisasi_triwulan_IV_kinerja: '',
//                 realisasi_triwulan_IV_anggaran:
//                     pagu?.triwulan?.find((t) => t.triwulan === 4)?.realisasi ?? '',
//                 realisasi_rkpd_kinerja: '',
//                 realisasi_rkpd_anggaran: pagu?.totalRealisasi ?? '',
//                 realisasi_rpjmd_sd_tahun_kinerja: '',
//                 realisasi_rpjmd_sd_tahun_anggaran: pagu?.totalRealisasiPeriode ?? '',
//                 tingkat_capaian_rpjmd_kinerja: '',
//                 tingkat_capaian_rpjmd_anggaran: pagu?.persenRealisasiPeriode ?? '',
//                 perangkat_daerah: skpd,
//             });
//         }
//     };

//     dataRespons.forEach((urusan) => {
//         pushRow('urusan', [urusan.kode?.toString() ?? '', '', '', '', ''], urusan.name ?? '', urusan.indikator, urusan.pagu);

//         urusan.bidang?.forEach((bidang) => {
//             pushRow('bidang', [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', '', '', ''], bidang.name ?? '', bidang.indikator, bidang.pagu);

//             bidang.program?.forEach((program) => {
//                 pushRow('program', [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', program.kode?.toString() ?? '', '', ''], program.name ?? '', program.indikator, program.pagu);

//                 program.kegiatan?.forEach((kegiatan) => {
//                     pushRow('kegiatan', [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', program.kode?.toString() ?? '', kegiatan.kode?.toString() ?? '', ''], kegiatan.name ?? '', kegiatan.indikator, kegiatan.pagu);

//                     kegiatan.subKegiatan?.forEach((sub) => {
//                         pushRow('sub_kegiatan', [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', program.kode?.toString() ?? '', kegiatan.kode?.toString() ?? '', sub.kode?.toString() ?? ''], sub.name ?? '', sub.indikator, sub.pagu);
//                     });
//                 });
//             });
//         });
//     });

//     return dataExcel;
// }