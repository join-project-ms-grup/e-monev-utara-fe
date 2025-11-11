import api, { type ApiResponse } from "../lib/api";

//#region RKPD
export interface RealisasiIndikator {
    id: number;
    name: string;
    satuan: string;
    target_capaian: {
        id_rincian: number;
        tahun_ke: number;
        target: number;
        capaianTriwulan: {
            triwulan?: string | number;
            capaian?: string | number
        }[];
        capaianTotal: number;
        persenCapaian: number;
    }
}

export interface RealisasiPagu {
    id_pagu: number;
    target: number | string;
    realisasi_per_triwulan: {
        triwulan?: string | number;
        realisasi?: string | number
    }[];
    total_realisasi: number;
    persen_realisasi: number;
}

export interface RealisasiMaster {
    id: number;
    kode: string | number;
    name: string;
    type: string;
    parent: number;
    pagu?: RealisasiPagu;
    indikator?: RealisasiIndikator[];
}
export interface RealisasiMasterUrusan extends RealisasiMaster {
    bidang?: RealisasiMasterBidang[];
}
export interface RealisasiMasterBidang extends RealisasiMaster {
    program?: RealisasiMasterProgram[];
}
export interface RealisasiMasterProgram extends RealisasiMaster {
    kegiatan?: RealisasiMasterKegiatan[];
}
export interface RealisasiMasterKegiatan extends RealisasiMaster {
    subKegiatan?: RealisasiMasterSubKegiatan[];
}
export interface RealisasiMasterSubKegiatan extends RealisasiMaster {
}
export type RealisasiMasterTree = RealisasiMasterUrusan & RealisasiMasterBidang & RealisasiMasterProgram & RealisasiMasterKegiatan & RealisasiMasterSubKegiatan;

export interface RealisasiFormRKPD {
    rekening_kode?: string;
    rekening_name?: string;
    indikator_name?: string;
    satuan?: string;
    id_pagu?: number;
    id_rincian?: number;
    target?: number;
    target_anggaran?: number;
    total_capaian?: number;
    total_anggaran?: number;
    persen_capaian?: number;
    persen_anggaran?: number;
    realisasi_1?: string | number;
    realisasi_2?: string | number;
    realisasi_3?: string | number;
    realisasi_4?: string | number;
    capaian_1?: string | number
    capaian_2?: string | number
    capaian_3?: string | number
    capaian_4?: string | number
}

export interface RealisasiGetForm {
    skpd_periode_id: number;
    tahun_ke: number;
}

export interface AddCapaianRKPDForm {
    id_rincian: number;
    capaian: { triwulan: number; capaian: number }[];
}

export interface AddAnggaranRKPDForm {
    id_pagu: number;
    realisasi: { triwulan: number; realisasi: number }[];
}

export const getRealisasiRKPD = async (payload: RealisasiGetForm): Promise<RealisasiMasterTree[]> => {
    const response = await api.post<ApiResponse<RealisasiMasterTree[]>>(`/rkpd/realisasi/list`, payload);
    return response.data.data;
};

export const addCapaianRKPD = async (payload: AddCapaianRKPDForm): Promise<AddCapaianRKPDForm> => {
    const response = await api.post<ApiResponse<AddCapaianRKPDForm>>("/rkpd/realisasi/kinerja", payload);
    return response.data.data;
};

export const addAnggaranRKPD = async (payload: AddAnggaranRKPDForm): Promise<AddAnggaranRKPDForm> => {
    const response = await api.post<ApiResponse<AddAnggaranRKPDForm>>("/rkpd/realisasi/anggaran", payload);
    return response.data.data;
};

export const addPerhitunganRKPD = async (payload: PerhitunganRenstraRKPDForm): Promise<PerhitunganRenstraRKPDForm> => {
    const response = await api.post<ApiResponse<PerhitunganRenstraRKPDForm>>("/rkpd/realisasi/perhitungan", payload);
    return response.data.data;
};

export interface FlatRealisasiRKPD {
    level: string;
    id_master: number;
    type: string;
    kode_urusan: string;
    kode_bidang: string;
    kode_program: string;
    kode_kegiatan: string;
    kode_subKegiatan: string;

    rekening: string;

    id_indikator?: number;
    indikator_kinerja?: string;
    satuan?: string;
    id_rincian?: number;
    tahun_ke?: number;
    target?: number | string;
    capaian_triwulan_I?: number | string;
    capaian_triwulan_II?: number | string;
    capaian_triwulan_III?: number | string;
    capaian_triwulan_IV?: number | string;
    total_capaian?: number | string;
    persen_capaian?: number | string;

    id_pagu?: number;
    target_anggaran?: number | string;
    realisasi_triwulan_I?: number | string;
    realisasi_triwulan_II?: number | string;
    realisasi_triwulan_III?: number | string;
    realisasi_triwulan_IV?: number | string;
    total_realisasi?: number | string;
    persen_realisasi?: number | string;

    perangkat_daerah: string;
    parent?: number;
}

export async function flatRealisasi(
    dataRespons: RealisasiMasterUrusan[],
    skpd: string
): Promise<FlatRealisasiRKPD[]> {
    const dataExcel: FlatRealisasiRKPD[] = [];

    const pushRow = (
        level: string,
        master: RealisasiMaster,
        kodeParts: string[]
    ) => {
        const [kode_urusan, kode_bidang, kode_program, kode_kegiatan, kode_subKegiatan] = kodeParts;

        if (master.indikator && master.indikator.length > 0) {
            master.indikator.forEach((ind) => {
                const capaian = ind.target_capaian;
                dataExcel.push({
                    level,
                    id_master: master.id,
                    type: master.type,
                    kode_urusan,
                    kode_bidang,
                    kode_program,
                    kode_kegiatan,
                    kode_subKegiatan,
                    rekening: master.name,

                    id_indikator: ind.id,
                    indikator_kinerja: ind.name,
                    satuan: ind.satuan,
                    id_rincian: capaian.id_rincian,
                    tahun_ke: capaian.tahun_ke,
                    target: capaian.target,
                    capaian_triwulan_I: capaian.capaianTriwulan.find(t => t.triwulan === 1)?.capaian ?? '',
                    capaian_triwulan_II: capaian.capaianTriwulan.find(t => t.triwulan === 2)?.capaian ?? '',
                    capaian_triwulan_III: capaian.capaianTriwulan.find(t => t.triwulan === 3)?.capaian ?? '',
                    capaian_triwulan_IV: capaian.capaianTriwulan.find(t => t.triwulan === 4)?.capaian ?? '',
                    total_capaian: capaian.capaianTotal,
                    persen_capaian: capaian.persenCapaian,

                    id_pagu: master.pagu?.id_pagu,
                    target_anggaran: master.pagu?.target,
                    realisasi_triwulan_I: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 1)?.realisasi ?? '',
                    realisasi_triwulan_II: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 2)?.realisasi ?? '',
                    realisasi_triwulan_III: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 3)?.realisasi ?? '',
                    realisasi_triwulan_IV: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 4)?.realisasi ?? '',
                    total_realisasi: master.pagu?.total_realisasi,
                    persen_realisasi: master.pagu?.persen_realisasi,

                    perangkat_daerah: skpd,
                    parent: master.parent,
                });
            });
        } else {
            dataExcel.push({
                level,
                id_master: master.id,
                type: master.type,
                kode_urusan,
                kode_bidang,
                kode_program,
                kode_kegiatan,
                kode_subKegiatan,
                rekening: master.name,

                target: '',
                capaian_triwulan_I: '',
                capaian_triwulan_II: '',
                capaian_triwulan_III: '',
                capaian_triwulan_IV: '',
                total_capaian: '',
                persen_capaian: '',

                id_pagu: master.pagu?.id_pagu,
                target_anggaran: master.pagu?.target,
                realisasi_triwulan_I: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 1)?.realisasi ?? '',
                realisasi_triwulan_II: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 2)?.realisasi ?? '',
                realisasi_triwulan_III: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 3)?.realisasi ?? '',
                realisasi_triwulan_IV: master.pagu?.realisasi_per_triwulan.find(t => t.triwulan === 4)?.realisasi ?? '',
                total_realisasi: master.pagu?.total_realisasi,
                persen_realisasi: master.pagu?.persen_realisasi,

                perangkat_daerah: skpd,
                parent: master.parent,
            });
        }
    };

    dataRespons.forEach(urusan => {
        pushRow('urusan', urusan, [urusan.kode?.toString() ?? '', '', '', '', '']);
        urusan.bidang?.forEach(bidang => {
            pushRow('bidang', bidang, [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', '', '', '']);
            bidang.program?.forEach(program => {
                pushRow('program', program, [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', program.kode?.toString() ?? '', '', '']);
                program.kegiatan?.forEach(kegiatan => {
                    pushRow('kegiatan', kegiatan, [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', program.kode?.toString() ?? '', kegiatan.kode?.toString() ?? '', '']);
                    kegiatan.subKegiatan?.forEach(sub => {
                        pushRow('sub_kegiatan', sub, [urusan.kode?.toString() ?? '', bidang.kode?.toString() ?? '', program.kode?.toString() ?? '', kegiatan.kode?.toString() ?? '', sub.kode?.toString() ?? '']);
                    });
                });
            });
        });
    });

    return dataExcel;
}
//#endregion

export interface RealisasiRenstraMaster {
    id: number;
    kode: string;
    name: string;
    type: string;
    bidang: {
        id: number;
        parent: number;
        kode: string;
        name: string;
        type: string;
        program: {
            id: number;
            parent: number;
            kode: string;
            name: string;
            type: string;
            pagu: {
                id_pagu: number;
                target: number;
                realisasi: number;
                persen_realisasi: number;
            };
            outcome: {
                outcome: string;
                indikator: {
                    id: number;
                    name: string;
                    satuan: string;
                    target_capaian: {
                        id: number;
                        target: number;
                        capaian: number;
                        persen: number;
                    }
                }
            }[];
            kegiatan: {
                id: number;
                parent: number;
                kode: string;
                name: string;
                type: string;
                pagu: {
                    id_pagu: number;
                    target: number;
                    realisasi: number;
                    persen_realisasi: number;
                };
                subKegiatan: {
                    id: number;
                    parent: number;
                    kode: string;
                    name: string;
                    indikator: {
                        id: number;
                        name: string;
                        satuan: string;
                        target_capaian: {
                            id_rincian: number;
                            tahun_ke: number;
                            target: number;
                            capaian: number;
                            persen: number;
                        }
                    }[];
                    pagu: {
                        id_pagu: number;
                        target: number;
                        realisasi: number;
                        persen_realisasi: number;
                    };
                }[]
            }[]
        }[]
    }[]
}

export const getRealisasiRENSTRA = async (payload: RealisasiGetForm): Promise<RealisasiRenstraMaster[]> => {
    const response = await api.post<ApiResponse<RealisasiRenstraMaster[]>>(`/renstra/realisasi/list`, payload);
    return response.data.data;
};

export interface FlatRealisasiRENSTRA {
    id?: number;
    kode?: string;
    nama?: string;
    type?: string;
    id_parent?: number;

    pagu_id?: number;
    pagu_target?: number;
    pagu_realisasi?: number;
    pagu_persen_realisasi?: number;

    outcome_name?: string;

    indikator_id?: number;
    indikator_name?: string;
    indikator_satuan?: string;

    target_capaian_o_id?: number;
    target_capaian_o_target?: number;
    target_capaian_o_capaian?: number;
    target_capaian_o_persen?: number;

    target_capaian_i_id?: number;
    target_capaian_i_tahun_ke?: number;
    target_capaian_i_target?: number;
    target_capaian_i_capaian?: number;
    target_capaian_i_persen?: number;
}

export function flatRealisasiRENSTRA(data: RealisasiRenstraMaster[]): FlatRealisasiRENSTRA[] {
    const result: FlatRealisasiRENSTRA[] = [];

    for (const urusan of data) {
        result.push({
            id: urusan.id,
            kode: urusan.kode,
            nama: urusan.name,
            type: urusan.type,
        });

        for (const bidang of urusan.bidang) {
            result.push({
                id: bidang.id,
                id_parent: bidang.parent,
                kode: urusan.kode + '.' + bidang.kode,
                nama: bidang.name,
                type: bidang.type,
            });

            for (const program of bidang.program) {
                for (const outcome of program.outcome) {
                    for (const indikator of outcome.indikator ? [outcome.indikator] : []) {
                        result.push({
                            id: program.id,
                            id_parent: program.parent,
                            kode: urusan.kode + '.' + bidang.kode + '.' + program.kode,
                            nama: program.name,
                            type: program.type,
                            pagu_id: program.pagu?.id_pagu,
                            pagu_target: program.pagu?.target,
                            pagu_realisasi: program.pagu?.realisasi,
                            pagu_persen_realisasi: program.pagu?.persen_realisasi,
                            //  
                            outcome_name: outcome.outcome,
                            indikator_id: indikator.id,
                            indikator_name: indikator.name,
                            indikator_satuan: indikator.satuan,
                            target_capaian_o_id: indikator.target_capaian.id,
                            target_capaian_o_capaian: indikator.target_capaian.capaian,
                            target_capaian_o_target: indikator.target_capaian.target,
                            target_capaian_o_persen: indikator.target_capaian.persen,
                        });
                    }
                }

                for (const kegiatan of program.kegiatan) {
                    result.push({
                        id: kegiatan.id,
                        id_parent: kegiatan.parent,
                        kode: urusan.kode + '.' + bidang.kode + '.' + program.kode + '.' + kegiatan.kode,
                        nama: kegiatan.name,
                        type: kegiatan.type,
                        pagu_id: kegiatan.pagu.id_pagu,
                        pagu_target: kegiatan.pagu.target,
                        pagu_realisasi: kegiatan.pagu.realisasi,
                        pagu_persen_realisasi: kegiatan.pagu.persen_realisasi,
                    });

                    for (const sub of kegiatan.subKegiatan) {
                        for (const indikator of sub.indikator) {
                            result.push({
                                id: sub.id,
                                id_parent: sub.parent,
                                kode: urusan.kode + '.' + bidang.kode + '.' + program.kode + '.' + kegiatan.kode + '.' + sub.kode,
                                nama: sub.name,
                                pagu_id: sub.pagu.id_pagu,
                                pagu_target: sub.pagu.target,
                                pagu_realisasi: sub.pagu.realisasi,
                                pagu_persen_realisasi: sub.pagu.persen_realisasi,
                                type: 'subkegiatan',
                                // 
                                indikator_id: indikator.id,
                                indikator_name: indikator.name,
                                indikator_satuan: indikator.satuan,
                                target_capaian_i_id: indikator.target_capaian.id_rincian,
                                target_capaian_i_capaian: indikator.target_capaian.capaian,
                                target_capaian_i_tahun_ke: indikator.target_capaian.tahun_ke,
                                target_capaian_i_target: indikator.target_capaian.target,
                                target_capaian_i_persen: indikator.target_capaian.persen,
                            });
                        }
                    }
                }
            }
        }
    }

    return result;
}

export interface AnggaranRenstraForm {
    id_pagu: number;
    realisasi: number;
}

export const addAnggaranRENSTRA = async (payload: AnggaranRenstraForm): Promise<AnggaranRenstraForm> => {
    const response = await api.post<ApiResponse<AnggaranRenstraForm>>("/renstra/realisasi/anggaran", payload);
    return response.data.data;
};

export interface OutcomeCapRenstraForm {
    id_target: number;
    capaian: number;
}

export const addOutcomeCapRENSTRA = async (payload: OutcomeCapRenstraForm): Promise<OutcomeCapRenstraForm> => {
    const response = await api.post<ApiResponse<OutcomeCapRenstraForm>>("/renstra/realisasi/capaian-outcome", payload);
    return response.data.data;
};

export interface CapaianRenstraForm {
    id_rincian: number;
    capaian: number;
}

export const addCapaianRENSTRA = async (payload: CapaianRenstraForm): Promise<CapaianRenstraForm> => {
    const response = await api.post<ApiResponse<CapaianRenstraForm>>("/renstra/realisasi/capaian", payload);
    return response.data.data;
};

export interface PerhitunganRenstraRKPDForm {
    id_indikator: number;
    type: string | null;
    perhitungan: string;
}

export const addPerhitunganRENSTRA = async (payload: PerhitunganRenstraRKPDForm): Promise<PerhitunganRenstraRKPDForm> => {
    const response = await api.post<ApiResponse<PerhitunganRenstraRKPDForm>>("/renstra/realisasi/perhitungan", payload);
    return response.data.data;
};