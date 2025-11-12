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


export interface RenstraMasterNew {
    catatan: {
        pendorong: string
        penghambat: string
        tl_1: string
        tl_2: string
    },
    hasil: {
        kode: string;
        name: string;
        bidang: {
            kode: string;
            name: string;
            program: {
                kode: string;
                name: string;
                outcome: {
                    outcome: string;
                    indikatorOutcome: {
                        nama: string;
                        satuan: string | null;
                        targetIndikatorOutcome: {
                            tahun: number;
                            tahun_ke: number | string;
                            target: number | string;
                            capaian: number | string;
                            persen: number | string;
                        }[]
                    }
                }[]
                kegiatan: {
                    kode: string;
                    name: string;
                    pagu: {
                        tahun: number;
                        tahun_ke: number | string;
                        pagu: number | string;
                        realisasi: number | string;
                        persen: number | string;
                    }[]
                    subKegiatan: {
                        kode: string;
                        name: string;
                        indikator: {
                            name: string;
                            target: {
                                tahun: number;
                                tahun_ke: number | string;
                                target: number | string;
                                capaian: number | string;
                                persen: number | string;
                            }[]
                        }[]
                        pagu: {
                            tahun: number;
                            tahun_ke: number | string;
                            pagu: number | string;
                            realisasi: number | string;
                            persen: number | string;
                        }[]
                    }[]
                }[]
            }[]
        }[]
    }[]
}

export const getRenstraNew = async (skpd_periode_id: number): Promise<RenstraMasterNew['hasil']> => {
    const response = await api.get<ApiResponse<RenstraMasterNew>>(`/renstra/hasil/renstra/${skpd_periode_id}`);
    return response.data.data.hasil;
};

export interface FlatRenstraNew {
    kode?: string;
    name?: string;
    type?: string;
    satuan?: string;

    ind_name?: string;

    pagu_tahun_1?: number;
    pagu_pagu_1?: number;
    pagu_realisasi_1?: number;
    pagu_persen_1?: number;

    pagu_tahun_2?: number;
    pagu_pagu_2?: number;
    pagu_realisasi_2?: number;
    pagu_persen_2?: number;

    pagu_tahun_3?: number;
    pagu_pagu_3?: number;
    pagu_realisasi_3?: number;
    pagu_persen_3?: number;

    pagu_tahun_4?: number;
    pagu_pagu_4?: number;
    pagu_realisasi_4?: number;
    pagu_persen_4?: number;

    pagu_tahun_5?: number;
    pagu_pagu_5?: number;
    pagu_realisasi_5?: number;
    pagu_persen_5?: number;

    target_tahun_1?: number;
    target_target_1?: number;
    target_capaian_1?: number;
    target_persen_1?: number;

    target_tahun_2?: number;
    target_target_2?: number;
    target_capaian_2?: number;
    target_persen_2?: number;

    target_tahun_3?: number;
    target_target_3?: number;
    target_capaian_3?: number;
    target_persen_3?: number;

    target_tahun_4?: number;
    target_target_4?: number;
    target_capaian_4?: number;
    target_persen_4?: number;

    target_tahun_5?: number;
    target_target_5?: number;
    target_capaian_5?: number;
    target_persen_5?: number;

}

export function flatRenstraNew(data: RenstraMasterNew['hasil']): FlatRenstraNew[] {
    const result: FlatRenstraNew[] = [];
    for (const urusan of data) {
        result.push({
            kode: urusan.kode,
            name: urusan.name,
            type: 'urusan',
        });

        for (const bidang of urusan.bidang) {
            result.push({
                kode: `${urusan.kode}.${bidang.kode}`,
                name: bidang.name,
                type: 'bidang',
            });

            for (const program of bidang.program) {
                result.push({
                    kode: `${urusan.kode}.${bidang.kode}.${program.kode}`,
                    name: program.name,
                    type: 'program',
                });
                for (const outcome of program.outcome) {
                    const io = outcome.indikatorOutcome
                    const t = io.targetIndikatorOutcome
                    const data: any = {
                        name: outcome.outcome,
                        ind_name: io.nama,
                        satuan: io.satuan ?? '-',
                    };

                    for (let i = 1; i <= 5; i++) {
                        const tahunData = t.find(item => item.tahun_ke === i);
                        data[`target_tahun_${i}`] = tahunData?.tahun;
                        data[`target_target_${i}`] = tahunData?.target;
                        data[`target_capaian_${i}`] = tahunData?.capaian;
                        data[`target_persen_${i}`] = tahunData?.persen;
                    }
                    result.push(data);
                }
                for (const kegiatan of program.kegiatan) {
                    const data: any = {
                        kode: `${urusan.kode}.${bidang.kode}.${program.kode}.${kegiatan.kode}`,
                        name: kegiatan.name,
                        type: 'kegiatan',
                    };
                    const p = kegiatan.pagu
                    for (let i = 1; i <= 5; i++) {
                        const tahunData = p.find(item => item.tahun_ke === i);
                        data[`pagu_tahun_${i}`] = tahunData?.tahun;
                        data[`pagu_pagu_${i}`] = tahunData?.pagu;
                        data[`pagu_realisasi_${i}`] = tahunData?.realisasi;
                        data[`pagu_persen_${i}`] = tahunData?.persen;
                    }
                    result.push(data);

                    for (const subkegiatan of kegiatan.subKegiatan) {
                        for (const indikator of subkegiatan.indikator) {
                            const data: any = {
                                kode: `${urusan.kode}.${bidang.kode}.${program.kode}.${kegiatan.kode}.${subkegiatan.kode}`,
                                name: subkegiatan.name,
                                ind_name: indikator.name,
                                type: 'sub_kegiatan',
                            };
                            const t = indikator.target
                            for (let i = 1; i <= 5; i++) {
                                const tahunData = t.find(item => item.tahun_ke === i);
                                data[`target_tahun_${i}`] = tahunData?.tahun;
                                data[`target_target_${i}`] = tahunData?.target;
                                data[`target_capaian_${i}`] = tahunData?.capaian;
                                data[`target_persen_${i}`] = tahunData?.persen;
                            }
                            const p = subkegiatan.pagu
                            for (let i = 1; i <= 5; i++) {
                                const tahunData = p.find(item => item.tahun_ke === i);
                                data[`pagu_tahun_${i}`] = tahunData?.tahun;
                                data[`pagu_pagu_${i}`] = tahunData?.pagu;
                                data[`pagu_realisasi_${i}`] = tahunData?.realisasi;
                                data[`pagu_persen_${i}`] = tahunData?.persen;
                            }
                            result.push(data);
                        }
                    }
                }
            }
        }
    }
    return result;
}