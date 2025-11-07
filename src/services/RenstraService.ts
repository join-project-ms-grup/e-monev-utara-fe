import type { ApiResponse } from "../lib/api";
import api from "../lib/api";

export interface IndikatorTargetRenstra {
    tahun_ke?: number | string;
    target?: number;
}

export interface IndikatorCapaianRenstra {
    tahun_ke?: number | string;
    capaian?: number;
}

export interface IndikatorRasioRenstra {
    tahun_ke?: number | string;
    rasio?: number | string;
}

export interface IndikatorRenstra {
    id?: number;
    name?: string;
    satuan?: string;
    totalTarget?: number;
    target_per_tahun?: IndikatorTargetRenstra[];
    capaian_per_tahun?: IndikatorCapaianRenstra[];
    rasio_per_tahun?: IndikatorRasioRenstra[];
}

export interface RenstraPaguTahun {
    tahun_ke?: number | string;
    pagu?: number;
}

export interface RenstraRealisasiTahun {
    tahun_ke?: number | string;
    realisasi?: number;
}

export interface RenstraRasioTahun {
    tahun_ke?: number | string;
    rasio?: number | string;
}

export interface RenstraPagu {
    totalPagu?: number;
    pagu_per_tahun?: RenstraPaguTahun[];
    realisasi_per_tahun?: RenstraRealisasiTahun[];
    rasio_per_tahun?: RenstraRasioTahun[];
}

export interface RenstraMaster {
    id?: number;
    kode?: string | number;
    name?: string;
    type?: string;
    indikator?: IndikatorRenstra[];
    pagu?: RenstraPagu;
}

export interface RenstraMasterUrusan extends RenstraMaster {
    bidang?: RenstraMasterBidang[];
}

export interface RenstraMasterBidang extends RenstraMaster {
    program?: RenstraMasterProgram[];
}

export interface RenstraMasterProgram extends RenstraMaster {
    kegiatan?: RenstraMasterKegiatan[];
}

export interface RenstraMasterKegiatan extends RenstraMaster {
    subKegiatan?: RenstraMasterSubKegiatan[];
}

export interface RenstraMasterSubKegiatan extends RenstraMaster { }

export type RenstraMasterTree =
    RenstraMasterUrusan &
    RenstraMasterBidang &
    RenstraMasterProgram &
    RenstraMasterKegiatan &
    RenstraMasterSubKegiatan;

/**
 * Ambil semua data renstra
 */
export const getRenstra = async (skpd_periode_id: number): Promise<RenstraMasterTree[]> => {
    const response = await api.get<ApiResponse<RenstraMasterTree[]>>(`/renstra/hasil/renstra/${skpd_periode_id}`);
    return response.data.data;
};

export interface FlatRenstra {
    level: string;
    sasaran: string;
    kode_urusan: string;
    kode_bidang: string;
    kode_program: string;
    kode_kegiatan: string;
    kode_subKegiatan: string;
    rekening: string;
    indikator_kinerja: string;
    satuan: string;
    target_rpjmd_kinerja: number | string;
    target_rpjmd_anggaran: number | string;
    realisasi_rpjmd_kinerja: number | string;
    realisasi_rpjmd_anggaran: number | string;
    target_rkpd_kinerja: number | string;
    target_rkpd_anggaran: number | string;
    realisasi_triwulan_I_kinerja: number | string;
    realisasi_triwulan_I_anggaran: number | string;
    realisasi_triwulan_II_kinerja: number | string;
    realisasi_triwulan_II_anggaran: number | string;
    realisasi_triwulan_III_kinerja: number | string;
    realisasi_triwulan_III_anggaran: number | string;
    realisasi_triwulan_IV_kinerja: number | string;
    realisasi_triwulan_IV_anggaran: number | string;
    realisasi_rkpd_kinerja: number | string;
    realisasi_rkpd_anggaran: number | string;
    realisasi_rpjmd_sd_tahun_kinerja: number | string;
    realisasi_rpjmd_sd_tahun_anggaran: number | string;
    tingkat_capaian_rpjmd_kinerja: number | string;
    tingkat_capaian_rpjmd_anggaran: number | string;
    tingkat_capaian_rkpd_kinerja: number | string;
    tingkat_capaian_rkpd_anggaran: number | string;
    perangkat_daerah: string;
    target_per_tahun: IndikatorTargetRenstra[];
    capaian_per_tahun: IndikatorCapaianRenstra[];
    rasio_per_tahun: IndikatorRasioRenstra[];
    pagu_per_tahun: RenstraPaguTahun[];
    realisasi_per_tahun: RenstraRealisasiTahun[];
    rasio_per_tahun_pagu: RenstraRasioTahun[];
    total_target: number | string;
    total_realisasi: number | string;
}


export interface FlatRenstraRow {
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

export const flattenRenstra = (data: RenstraMasterUrusan[]): FlatRenstraRow[] => {
    const rows: FlatRenstraRow[] = [];

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