import api, { type ApiResponse } from "../lib/api";
import type { CapaianTriwulan } from "./CapaianService";
import type { RealisasiTriwulan } from "./RealisasiService";

export interface IndikatorTarget {
    tahun_ke?: string | number;
    target?: string | number;
}

export interface Indikator {
    id?: number
    name?: string;
    satuan?: string;
    target_akhir_periode?: number;
    target_tahun_dievaluasi?: number;
    triwulan?: CapaianTriwulan[];
    total_capaian?: number;
    persen_capaian?: string;
    total_capaian_periode?: number;
    persen_capaian_periode?: string;
}

export interface RKPDPagu {
    paguPeriode?: number;
    paguTahunEval?: number;
    triwulan?: RealisasiTriwulan[];
    totalRealisasi?: number;
    persenRealisasi?: string;
    totalRealisasiPeriode?: number;
    persenRealisasiPeriode?: string;
}

export interface RKPDMaster {
    id?: number;
    kode?: string | number;
    name?: string;
    type?: string;
    indikator?: Indikator[];
    pagu?: RKPDPagu;
}
export interface RKPDMasterUrusan extends RKPDMaster {
    bidang?: RKPDMasterBidang[];
}
export interface RKPDMasterBidang extends RKPDMaster {
    program?: RKPDMasterProgram[];
}
export interface RKPDMasterProgram extends RKPDMaster {
    kegiatan?: RKPDMasterKegiatan[];
}
export interface RKPDMasterKegiatan extends RKPDMaster {
    subKegiatan?: RKPDMasterSubKegiatan[];
}
export interface RKPDMasterSubKegiatan extends RKPDMaster {
}
export type RKPDMasterTree = RKPDMasterUrusan & RKPDMasterBidang & RKPDMasterProgram & RKPDMasterKegiatan & RKPDMasterSubKegiatan;

/**
 * Ambil semua data rkpd tahunan
 * @param id number
 */
export const getRKPDTahunan = async (skpd_periode_id: number, tahun_ke: number): Promise<RKPDMasterTree[]> => {
    const response = await api.get<ApiResponse<RKPDMasterTree[]>>(`/rkpd/laporan-tahunan/${skpd_periode_id}/${tahun_ke}`);
    return response.data.data;
};

/**
 * Ambil semua data rkpd 5 tahunan
 * @param id number
 */
export const getRKPD5Tahunan = async (skpd_periode_id: number): Promise<RKPDMasterTree[]> => {
    const response = await api.get<ApiResponse<RKPDMasterTree[]>>(`/rkpd/laporan/${skpd_periode_id}`);
    return response.data.data;
};

// 

export interface FlatRKPDRow {
    level: 'urusan' | 'bidang' | 'program' | 'kegiatan' | 'sub_kegiatan';
    kode?: string | number;
    name?: string;
    indikator?: {
        id?: number;
        name?: string;
        satuan?: string;
        target_tahun_dievaluasi?: number;
        target_akhir_periode?: number;
        triwulan?: { triwulan: number; capaian: number }[];
        total_capaian?: number;
        persen_capaian?: number | string;
        total_capaian_periode?: number;
        persen_capaian_periode?: number | string;
    }[];
    pagu?: {
        triwulan?: { triwulan: number; realisasi: string | number }[]
        paguPeriode?: number;
        paguTahunEval?: number;
        totalRealisasi?: number;
        persenRealisasi?: string;
        totalRealisasiPeriode?: number;
        persenRealisasiPeriode?: string;
    };
}

export const flattenRKPD = (data: RKPDMasterUrusan[]): FlatRKPDRow[] => {
    const rows: FlatRKPDRow[] = [];

    data.forEach((urusan) => {
        rows.push({ level: 'urusan', kode: urusan.kode, name: urusan.name });

        urusan.bidang?.forEach((bidang) => {
            rows.push({ level: 'bidang', kode: `${urusan.kode} ${bidang.kode}`, name: bidang.name });

            bidang.program?.forEach((program) => {
                rows.push({
                    level: 'program',
                    kode: `${urusan.kode} ${bidang.kode} ${program.kode}`,
                    name: program.name,
                    indikator: program.indikator?.map(i => ({
                        id: i.id ?? 0,
                        name: i.name ?? '',
                        satuan: i.satuan ?? '',
                        target_tahun_dievaluasi: i.target_tahun_dievaluasi ?? 0,
                        target_akhir_periode: i.target_akhir_periode ?? 0,
                        triwulan: i.triwulan?.map(t => ({
                            triwulan: Number(t.triwulan ?? 0),
                            capaian: t.capaian ?? 0,
                        })) ?? [],
                        total_capaian: i.total_capaian ?? 0,
                        persen_capaian: i.persen_capaian ?? '0',
                        total_capaian_periode: i.total_capaian_periode ?? 0,
                        persen_capaian_periode: i.persen_capaian_periode ?? '0',
                    })),
                    pagu: program.pagu
                        ? {
                            triwulan: program.pagu.triwulan?.map(t => ({
                                triwulan: Number(t.triwulan ?? 0),
                                realisasi: t.realisasi ?? 0,
                            })) ?? [],
                            paguPeriode: program.pagu.paguPeriode ?? 0,
                            paguTahunEval: program.pagu.paguTahunEval ?? 0,
                            totalRealisasi: program.pagu.totalRealisasi ?? 0,
                            persenRealisasi: program.pagu.persenRealisasi ?? '0',
                            totalRealisasiPeriode: program.pagu.totalRealisasiPeriode ?? 0,
                            persenRealisasiPeriode: program.pagu.persenRealisasiPeriode ?? '0',
                        }
                        : undefined
                });

                program.kegiatan?.forEach((kegiatan) => {
                    rows.push({
                        level: 'kegiatan',
                        kode: `${urusan.kode} ${bidang.kode} ${program.kode} ${kegiatan.kode}`,
                        name: kegiatan.name,
                        indikator: kegiatan.indikator?.map(i => ({
                            id: i.id ?? 0,
                            name: i.name ?? '',
                            satuan: i.satuan ?? '',
                            target_tahun_dievaluasi: i.target_tahun_dievaluasi ?? 0,
                            target_akhir_periode: i.target_akhir_periode ?? 0,
                            triwulan: i.triwulan?.map(t => ({
                                triwulan: Number(t.triwulan ?? 0),
                                capaian: t.capaian ?? 0,
                            })) ?? [],
                            total_capaian: i.total_capaian ?? 0,
                            persen_capaian: i.persen_capaian ?? '0',
                            total_capaian_periode: i.total_capaian_periode ?? 0,
                            persen_capaian_periode: i.persen_capaian_periode ?? '0',
                        })),
                        pagu: kegiatan.pagu
                            ? {
                                triwulan: kegiatan.pagu.triwulan?.map(t => ({
                                    triwulan: Number(t.triwulan ?? 0),
                                    realisasi: t.realisasi ?? 0,
                                })) ?? [],
                                paguPeriode: kegiatan.pagu.paguPeriode ?? 0,
                                paguTahunEval: kegiatan.pagu.paguTahunEval ?? 0,
                                totalRealisasi: kegiatan.pagu.totalRealisasi ?? 0,
                                persenRealisasi: kegiatan.pagu.persenRealisasi ?? '0',
                                totalRealisasiPeriode: kegiatan.pagu.totalRealisasiPeriode ?? 0,
                                persenRealisasiPeriode: kegiatan.pagu.persenRealisasiPeriode ?? '0',
                            }
                            : undefined,
                    });

                    kegiatan.subKegiatan?.forEach((sub) => {
                        rows.push({
                            level: 'sub_kegiatan',
                            kode: `${urusan.kode} ${bidang.kode} ${program.kode} ${kegiatan.kode} ${sub.kode}`,
                            name: sub.name,
                            indikator: sub.indikator?.map(i => ({
                                id: i.id ?? 0,
                                name: i.name ?? '',
                                satuan: i.satuan ?? '',
                                target_tahun_dievaluasi: i.target_tahun_dievaluasi ?? 0,
                                target_akhir_periode: i.target_akhir_periode ?? 0,
                                triwulan: i.triwulan?.map(t => ({
                                    triwulan: Number(t.triwulan ?? 0),
                                    capaian: t.capaian ?? 0,
                                })) ?? [],
                                total_capaian: i.total_capaian ?? 0,
                                persen_capaian: i.persen_capaian ?? '0',
                                total_capaian_periode: i.total_capaian_periode ?? 0,
                                persen_capaian_periode: i.persen_capaian_periode ?? '0',
                            })),
                            pagu: sub.pagu
                                ? {
                                    triwulan: sub.pagu.triwulan?.map(t => ({
                                        triwulan: Number(t.triwulan ?? 0),
                                        realisasi: t.realisasi ?? 0,
                                    })) ?? [],
                                    paguPeriode: sub.pagu.paguPeriode ?? 0,
                                    paguTahunEval: sub.pagu.paguTahunEval ?? 0,
                                    totalRealisasi: sub.pagu.totalRealisasi ?? 0,
                                    persenRealisasi: sub.pagu.persenRealisasi ?? '0',
                                    totalRealisasiPeriode: sub.pagu.totalRealisasiPeriode ?? 0,
                                    persenRealisasiPeriode: sub.pagu.persenRealisasiPeriode ?? '0',
                                }
                                : undefined,
                        });
                    });
                });
            });
        });
    });

    return rows;
};

// export const flattenRKPD = (data: RKPDMasterUrusan[]): FlatRKPDRow[] => {
//     const rows: FlatRKPDRow[] = [];

//     data.forEach((urusan) => {
//         // Urusan
//         rows.push({
//             level: 'urusan',
//             kode: urusan.kode,
//             name: urusan.name,
//         });

//         urusan.bidang?.forEach((bidang) => {
//             // Bidang
//             rows.push({
//                 level: 'bidang',
//                 kode: `${urusan.kode} ${bidang.kode}`,
//                 name: bidang.name,
//             });

//             bidang.program?.forEach((program) => {
//                 // Kalau program punya indikator → tambahkan satu baris per indikator
//                 if (program.indikator && program.indikator.length > 0) {
//                     program.indikator.forEach((indikator) => {
//                         rows.push({
//                             level: 'program',
//                             kode: `${urusan.kode} ${bidang.kode} ${program.kode}`,
//                             name: program.name,
//                             indikator_name: indikator.name,
//                             indikator_satuan: indikator.satuan,
//                             indikator_target_tahun_dievaluasi: indikator.target_tahun_dievaluasi,
//                             indikator_target_akhir_periode: indikator.target_akhir_periode,
//                             pagu_tahun_eval: program.pagu?.paguTahunEval,
//                             pagu_periode: program.pagu?.paguPeriode,
//                             total_realisasi: program.pagu?.totalRealisasi,
//                             persen_realisasi: program.pagu?.persenRealisasi,
//                         });
//                     });
//                 } else {
//                     // Kalau tidak punya indikator
//                     rows.push({
//                         level: 'program',
//                         kode: `${urusan.kode} ${bidang.kode} ${program.kode}`,
//                         name: program.name,
//                     });
//                 }

//                 program.kegiatan?.forEach((kegiatan) => {
//                     // Kalau kegiatan punya indikator
//                     if (kegiatan.indikator && kegiatan.indikator.length > 0) {
//                         kegiatan.indikator.forEach((indikator) => {
//                             rows.push({
//                                 level: 'kegiatan',
//                                 kode: `${urusan.kode} ${bidang.kode} ${program.kode} ${kegiatan.kode}`,
//                                 name: kegiatan.name,
//                                 indikator_name: indikator.name,
//                                 indikator_satuan: indikator.satuan,
//                                 indikator_target_tahun_dievaluasi: indikator.target_tahun_dievaluasi,
//                                 indikator_target_akhir_periode: indikator.target_akhir_periode,
//                                 pagu_tahun_eval: kegiatan.pagu?.paguTahunEval,
//                                 pagu_periode: kegiatan.pagu?.paguPeriode,
//                                 total_realisasi: kegiatan.pagu?.totalRealisasi,
//                                 persen_realisasi: kegiatan.pagu?.persenRealisasi,
//                             });
//                         });
//                     } else {
//                         rows.push({
//                             level: 'kegiatan',
//                             kode: `${urusan.kode} ${bidang.kode} ${program.kode} ${kegiatan.kode}`,
//                             name: kegiatan.name,
//                         });
//                     }

//                     kegiatan.subKegiatan?.forEach((sub) => {
//                         // Kalau sub_kegiatan punya indikator
//                         if (sub.indikator && sub.indikator.length > 0) {
//                             sub.indikator.forEach((indikator) => {
//                                 rows.push({
//                                     level: 'sub_kegiatan',
//                                     kode: `${urusan.kode} ${bidang.kode} ${program.kode} ${kegiatan.kode} ${sub.kode}`,
//                                     name: sub.name,
//                                     indikator_name: indikator.name,
//                                     indikator_satuan: indikator.satuan,
//                                     indikator_target_tahun_dievaluasi: indikator.target_tahun_dievaluasi,
//                                     indikator_target_akhir_periode: indikator.target_akhir_periode,
//                                     pagu_tahun_eval: sub.pagu?.paguTahunEval,
//                                     pagu_periode: sub.pagu?.paguPeriode,
//                                     total_realisasi: sub.pagu?.totalRealisasi,
//                                     persen_realisasi: sub.pagu?.persenRealisasi,
//                                 });
//                             });
//                         } else {
//                             rows.push({
//                                 level: 'sub_kegiatan',
//                                 kode: `${urusan.kode} ${bidang.kode} ${program.kode} ${kegiatan.kode} ${sub.kode}`,
//                                 name: sub.name,
//                             });
//                         }
//                     });
//                 });
//             });
//         });
//     });

//     return rows;
// };
