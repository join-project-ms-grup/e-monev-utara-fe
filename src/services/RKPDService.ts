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
 */
export const getRKPD = async (skpd_periode_id: number, tahun_ke: number): Promise<RKPDMasterTree[]> => {
    const response = await api.get<ApiResponse<RKPDMasterTree[]>>(`/rkpd/laporan-tahunan/${skpd_periode_id}/${tahun_ke}`);
    return response.data.data;
};


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

// 

export interface IndikatorTarget5T {
    tahun_ke?: number | string;
    target?: number;
}

export interface IndikatorCapaian5T {
    tahun_ke?: number | string;
    capaian?: number;
}

export interface IndikatorRasio5T {
    tahun_ke?: number | string;
    rasio?: number | string;
}

export interface Indikator5T {
    id?: number;
    name?: string;
    satuan?: string;
    totalTarget?: number;
    target_per_tahun?: IndikatorTarget5T[];
    capaian_per_tahun?: IndikatorCapaian5T[];
    rasio_per_tahun?: IndikatorRasio5T[];
}

export interface RKPDPaguTahun5T {
    tahun_ke?: number | string;
    pagu?: number;
}

export interface RKPDRealisasiTahun5T {
    tahun_ke?: number | string;
    realisasi?: number;
}

export interface RKPDRasioTahun5T {
    tahun_ke?: number | string;
    rasio?: number | string;
}

export interface RKPDPagu5T {
    totalPagu?: number;
    pagu_per_tahun?: RKPDPaguTahun5T[];
    realisasi_per_tahun?: RKPDRealisasiTahun5T[];
    rasio_per_tahun?: RKPDRasioTahun5T[];
}

export interface RKPDMaster5T {
    id?: number;
    kode?: string | number;
    name?: string;
    type?: string;
    indikator?: Indikator5T[];
    pagu?: RKPDPagu5T;
}

export interface RKPDMasterUrusan5T extends RKPDMaster5T {
    bidang?: RKPDMasterBidang5T[];
}

export interface RKPDMasterBidang5T extends RKPDMaster5T {
    program?: RKPDMasterProgram5T[];
}

export interface RKPDMasterProgram5T extends RKPDMaster5T {
    kegiatan?: RKPDMasterKegiatan5T[];
}

export interface RKPDMasterKegiatan5T extends RKPDMaster5T {
    subKegiatan?: RKPDMasterSubKegiatan5T[];
}

export interface RKPDMasterSubKegiatan5T extends RKPDMaster5T { }

export type RKPDMasterTree5T =
    RKPDMasterUrusan5T &
    RKPDMasterBidang5T &
    RKPDMasterProgram5T &
    RKPDMasterKegiatan5T &
    RKPDMasterSubKegiatan5T;

/**
 * Ambil semua data rkpd 5 tahunan
 */
export const getRKPD5Tahunan = async (skpd_periode_id: number): Promise<RKPDMasterTree5T[]> => {
    const response = await api.get<ApiResponse<RKPDMasterTree5T[]>>(`/rkpd/laporan/${skpd_periode_id}`);
    return response.data.data;
};

export interface FlatRKPD5TRow {
    level: 'urusan' | 'bidang' | 'program' | 'kegiatan' | 'sub_kegiatan';
    kode?: string | number;
    name?: string;
    indikator?: {
        id: number;
        name: string;
        satuan: string;
        totalTarget: number;
        target_per_tahun: {
            tahun_ke: number;
            target: number;
        }[];
        capaian_per_tahun: {
            tahun_ke: number;
            capaian: number;
        }[];
        rasio_per_tahun: {
            tahun_ke: number;
            rasio: number | string;
        }[];
    }[];
    pagu: {
        totalPagu: number;
        pagu_per_tahun: {
            tahun_ke: number;
            pagu: number;
        }[];
        realisasi_per_tahun: {
            tahun_ke: number;
            realisasi: number;
        }[];
        rasio_per_tahun: {
            tahun_ke: number;
            rasio: number | string;
        }[];
    };
}

export const flattenRKPD5T = (data: RKPDMasterUrusan5T[]): FlatRKPD5TRow[] => {
    const rows: FlatRKPD5TRow[] = [];

    data.forEach((urusan) => {
        rows.push({
            level: 'urusan',
            kode: urusan.kode,
            name: urusan.name,
            pagu: {
                totalPagu: 0,
                pagu_per_tahun: [],
                realisasi_per_tahun: [],
                rasio_per_tahun: [],
            },
        });

        urusan.bidang?.forEach((bidang) => {
            rows.push({
                level: 'bidang',
                kode: `${urusan.kode} ${bidang.kode}`,
                name: bidang.name,
                pagu: {
                    totalPagu: 0,
                    pagu_per_tahun: [],
                    realisasi_per_tahun: [],
                    rasio_per_tahun: [],
                },
            });

            bidang.program?.forEach((program) => {
                rows.push({
                    level: 'program',
                    kode: `${urusan.kode} ${bidang.kode} ${program.kode}`,
                    name: program.name,
                    indikator: program.indikator?.map(i => ({
                        id: i.id ?? 0,
                        name: i.name ?? '',
                        satuan: i.satuan ?? '',
                        totalTarget: i.totalTarget ?? 0,
                        target_per_tahun: i.target_per_tahun?.map(t => ({
                            tahun_ke: Number(t.tahun_ke ?? 0),
                            target: t.target ?? 0,
                        })) ?? [],
                        capaian_per_tahun: i.capaian_per_tahun?.map(c => ({
                            tahun_ke: Number(c.tahun_ke ?? 0),
                            capaian: c.capaian ?? 0,
                        })) ?? [],
                        rasio_per_tahun: i.rasio_per_tahun?.map(r => ({
                            tahun_ke: Number(r.tahun_ke ?? 0),
                            rasio: r.rasio ?? '0',
                        })) ?? [],
                    })),
                    pagu: program.pagu
                        ? {
                            totalPagu: program.pagu.totalPagu ?? 0,
                            pagu_per_tahun: program.pagu.pagu_per_tahun?.map(p => ({
                                tahun_ke: Number(p.tahun_ke ?? 0),
                                pagu: p.pagu ?? 0,
                            })) ?? [],
                            realisasi_per_tahun: program.pagu.realisasi_per_tahun?.map(r => ({
                                tahun_ke: Number(r.tahun_ke ?? 0),
                                realisasi: r.realisasi ?? 0,
                            })) ?? [],
                            rasio_per_tahun: program.pagu.rasio_per_tahun?.map(r => ({
                                tahun_ke: Number(r.tahun_ke ?? 0),
                                rasio: r.rasio ?? '0',
                            })) ?? [],
                        }
                        : {
                            totalPagu: 0,
                            pagu_per_tahun: [],
                            realisasi_per_tahun: [],
                            rasio_per_tahun: [],
                        },
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
                            totalTarget: i.totalTarget ?? 0,
                            target_per_tahun: i.target_per_tahun?.map(t => ({
                                tahun_ke: Number(t.tahun_ke ?? 0),
                                target: t.target ?? 0,
                            })) ?? [],
                            capaian_per_tahun: i.capaian_per_tahun?.map(c => ({
                                tahun_ke: Number(c.tahun_ke ?? 0),
                                capaian: c.capaian ?? 0,
                            })) ?? [],
                            rasio_per_tahun: i.rasio_per_tahun?.map(r => ({
                                tahun_ke: Number(r.tahun_ke ?? 0),
                                rasio: r.rasio ?? '0',
                            })) ?? [],
                        })),
                        pagu: kegiatan.pagu
                            ? {
                                totalPagu: kegiatan.pagu.totalPagu ?? 0,
                                pagu_per_tahun: kegiatan.pagu.pagu_per_tahun?.map(p => ({
                                    tahun_ke: Number(p.tahun_ke ?? 0),
                                    pagu: p.pagu ?? 0,
                                })) ?? [],
                                realisasi_per_tahun: kegiatan.pagu.realisasi_per_tahun?.map(r => ({
                                    tahun_ke: Number(r.tahun_ke ?? 0),
                                    realisasi: r.realisasi ?? 0,
                                })) ?? [],
                                rasio_per_tahun: kegiatan.pagu.rasio_per_tahun?.map(r => ({
                                    tahun_ke: Number(r.tahun_ke ?? 0),
                                    rasio: r.rasio ?? '0',
                                })) ?? [],
                            }
                            : {
                                totalPagu: 0,
                                pagu_per_tahun: [],
                                realisasi_per_tahun: [],
                                rasio_per_tahun: [],
                            },
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
                                totalTarget: i.totalTarget ?? 0,
                                target_per_tahun: i.target_per_tahun?.map(t => ({
                                    tahun_ke: Number(t.tahun_ke ?? 0),
                                    target: t.target ?? 0,
                                })) ?? [],
                                capaian_per_tahun: i.capaian_per_tahun?.map(c => ({
                                    tahun_ke: Number(c.tahun_ke ?? 0),
                                    capaian: c.capaian ?? 0,
                                })) ?? [],
                                rasio_per_tahun: i.rasio_per_tahun?.map(r => ({
                                    tahun_ke: Number(r.tahun_ke ?? 0),
                                    rasio: r.rasio ?? '0',
                                })) ?? [],
                            })),
                            pagu: sub.pagu
                                ? {
                                    totalPagu: sub.pagu.totalPagu ?? 0,
                                    pagu_per_tahun: sub.pagu.pagu_per_tahun?.map(p => ({
                                        tahun_ke: Number(p.tahun_ke ?? 0),
                                        pagu: p.pagu ?? 0,
                                    })) ?? [],
                                    realisasi_per_tahun: sub.pagu.realisasi_per_tahun?.map(r => ({
                                        tahun_ke: Number(r.tahun_ke ?? 0),
                                        realisasi: r.realisasi ?? 0,
                                    })) ?? [],
                                    rasio_per_tahun: sub.pagu.rasio_per_tahun?.map(r => ({
                                        tahun_ke: Number(r.tahun_ke ?? 0),
                                        rasio: r.rasio ?? '0',
                                    })) ?? [],
                                }
                                : {
                                    totalPagu: 0,
                                    pagu_per_tahun: [],
                                    realisasi_per_tahun: [],
                                    rasio_per_tahun: [],
                                },
                        });
                    });
                });
            });
        });
    });

    return rows;
};