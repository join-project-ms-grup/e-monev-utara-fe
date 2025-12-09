import api, { type ApiResponse } from "../lib/api";

export const getRKPD = async (skpd_periode_id: number): Promise<RKPDMaster['hasil']> => {
    const response = await api.get<ApiResponse<RKPDMaster>>(`/rkpd/hasil/laporan/${skpd_periode_id}`);
    return response.data.data.hasil;
};

export interface RKPDMaster {
    catatan: any;
    hasil: {
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
                    totalPagu: number;
                    pagu_per_tahun: {
                        tahun_ke: number;
                        pagu: number | string;
                    }[];
                    realisasi_per_tahun: {
                        tahun_ke: number;
                        realisasi: number | string;
                    }[]
                    rasio_per_tahun: {
                        tahun_ke: number;
                        rasio: number | string;
                    }[]
                }
                kegiatan: {
                    id: number;
                    parent: number;
                    kode: string;
                    name: string;
                    type: string;
                    pagu: {
                        totalPagu: number;
                        pagu_per_tahun: {
                            tahun_ke: number;
                            pagu: number | string;
                        }[];
                        realisasi_per_tahun: {
                            tahun_ke: number;
                            realisasi: number | string;
                        }[]
                        rasio_per_tahun: {
                            tahun_ke: number;
                            rasio: number | string;
                        }[]
                    }
                    subKegiatan: {
                        id: number;
                        parent: number;
                        kode: string;
                        name: string;
                        type: string;
                        indikator: {
                            id: number;
                            name: string;
                            satuan: string;
                            totalTarget: number
                            target_per_tahun: {
                                tahun_ke: number;
                                target: number | string;
                            }[]
                            capaian_per_tahun: {
                                tahun_ke: number;
                                capaian: number | string;
                            }[]
                            rasio_per_tahun: {
                                tahun_ke: number;
                                rasio: number | string;
                            }[]
                        }[]
                        pagu: {
                            totalPagu: number;
                            pagu_per_tahun: {
                                tahun_ke: number;
                                pagu: number | string;
                            }[];
                            realisasi_per_tahun: {
                                tahun_ke: number;
                                realisasi: number | string;
                            }[]
                            rasio_per_tahun: {
                                tahun_ke: number;
                                rasio: number | string;
                            }[]
                        }
                    }[]
                }[]
            }[]
        }[]
    }[]
}

export interface FlatRKPD {
    kode?: string;
    name?: string;
    type?: string;

    // program.pagu
    totalPagu?: number;
    pagu_per_tahun_1?: number | string;
    pagu_per_tahun_2?: number | string;
    pagu_per_tahun_3?: number | string;
    pagu_per_tahun_4?: number | string;
    pagu_per_tahun_5?: number | string;

    realisasi_per_tahun_1?: number | string;
    realisasi_per_tahun_2?: number | string;
    realisasi_per_tahun_3?: number | string;
    realisasi_per_tahun_4?: number | string;
    realisasi_per_tahun_5?: number | string;

    rasio_per_tahun_1?: number | string;
    rasio_per_tahun_2?: number | string;
    rasio_per_tahun_3?: number | string;
    rasio_per_tahun_4?: number | string;
    rasio_per_tahun_5?: number | string;

    // indikator
    ind_name?: string;
    ind_satuan?: string;
    ind_totalTarget?: number;
    ind_target_per_tahun_1?: number | string;
    ind_target_per_tahun_2?: number | string;
    ind_target_per_tahun_3?: number | string;
    ind_target_per_tahun_4?: number | string;
    ind_target_per_tahun_5?: number | string;

    ind_capaian_per_tahun_1?: number | string;
    ind_capaian_per_tahun_2?: number | string;
    ind_capaian_per_tahun_3?: number | string;
    ind_capaian_per_tahun_4?: number | string;
    ind_capaian_per_tahun_5?: number | string;

    ind_rasio_per_tahun_1?: number | string;
    ind_rasio_per_tahun_2?: number | string;
    ind_rasio_per_tahun_3?: number | string;
    ind_rasio_per_tahun_4?: number | string;
    ind_rasio_per_tahun_5?: number | string;


    // rasio pertahun 1-5

    // pagu pertahun 1-5
    // realisasi pertahun 1-5
    // rasio pertahun 1-5
}

export function flatRKPD(data: RKPDMaster['hasil']): FlatRKPD[] {
    const result: FlatRKPD[] = [];

    for (const urusan of data) {
        result.push({
            kode: urusan.kode,
            name: urusan.name,
            type: urusan.type,
        });

        for (const bidang of urusan.bidang) {
            result.push({
                kode: `${urusan.kode}.${bidang.kode}`,
                name: bidang.name,
                type: bidang.type,
            });

            for (const program of bidang.program) {
                result.push({
                    kode: `${urusan.kode}.${bidang.kode}.${program.kode}`,
                    name: program.name,
                    type: program.type,
                    totalPagu: program.pagu.totalPagu,
                    pagu_per_tahun_1: program.pagu.pagu_per_tahun.find(item => item.tahun_ke === 1)?.pagu,
                    pagu_per_tahun_2: program.pagu.pagu_per_tahun.find(item => item.tahun_ke === 2)?.pagu,
                    pagu_per_tahun_3: program.pagu.pagu_per_tahun.find(item => item.tahun_ke === 3)?.pagu,
                    pagu_per_tahun_4: program.pagu.pagu_per_tahun.find(item => item.tahun_ke === 4)?.pagu,
                    pagu_per_tahun_5: program.pagu.pagu_per_tahun.find(item => item.tahun_ke === 5)?.pagu,
                    realisasi_per_tahun_1: program.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 1)?.realisasi,
                    realisasi_per_tahun_2: program.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 2)?.realisasi,
                    realisasi_per_tahun_3: program.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 3)?.realisasi,
                    realisasi_per_tahun_4: program.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 4)?.realisasi,
                    realisasi_per_tahun_5: program.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 5)?.realisasi,
                    rasio_per_tahun_1: program.pagu.rasio_per_tahun.find(item => item.tahun_ke === 1)?.rasio,
                    rasio_per_tahun_2: program.pagu.rasio_per_tahun.find(item => item.tahun_ke === 2)?.rasio,
                    rasio_per_tahun_3: program.pagu.rasio_per_tahun.find(item => item.tahun_ke === 3)?.rasio,
                    rasio_per_tahun_4: program.pagu.rasio_per_tahun.find(item => item.tahun_ke === 4)?.rasio,
                    rasio_per_tahun_5: program.pagu.rasio_per_tahun.find(item => item.tahun_ke === 5)?.rasio,
                });
                for (const kegiatan of program.kegiatan) {
                    result.push({
                        kode: `${urusan.kode}.${bidang.kode}.${program.kode}.${kegiatan.kode}`,
                        name: kegiatan.name,
                        type: kegiatan.type,
                        totalPagu: kegiatan.pagu.totalPagu,
                        pagu_per_tahun_1: kegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 1)?.pagu,
                        pagu_per_tahun_2: kegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 2)?.pagu,
                        pagu_per_tahun_3: kegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 3)?.pagu,
                        pagu_per_tahun_4: kegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 4)?.pagu,
                        pagu_per_tahun_5: kegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 5)?.pagu,
                        realisasi_per_tahun_1: kegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 1)?.realisasi,
                        realisasi_per_tahun_2: kegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 2)?.realisasi,
                        realisasi_per_tahun_3: kegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 3)?.realisasi,
                        realisasi_per_tahun_4: kegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 4)?.realisasi,
                        realisasi_per_tahun_5: kegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 5)?.realisasi,
                        rasio_per_tahun_1: kegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 1)?.rasio,
                        rasio_per_tahun_2: kegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 2)?.rasio,
                        rasio_per_tahun_3: kegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 3)?.rasio,
                        rasio_per_tahun_4: kegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 4)?.rasio,
                        rasio_per_tahun_5: kegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 5)?.rasio,
                    })
                    for (const subkegiatan of kegiatan.subKegiatan) {
                        for (const indikator of subkegiatan.indikator) {
                            result.push({
                                kode: `${urusan.kode}.${bidang.kode}.${program.kode}.${kegiatan.kode}.${subkegiatan.kode}`,
                                name: subkegiatan.name,
                                type: subkegiatan.type,
                                ind_name: indikator.name,
                                ind_satuan: indikator.satuan,
                                ind_totalTarget: indikator.totalTarget,
                                ind_target_per_tahun_1: indikator.target_per_tahun.find(item => item.tahun_ke === 1)?.target,
                                ind_target_per_tahun_2: indikator.target_per_tahun.find(item => item.tahun_ke === 2)?.target,
                                ind_target_per_tahun_3: indikator.target_per_tahun.find(item => item.tahun_ke === 3)?.target,
                                ind_target_per_tahun_4: indikator.target_per_tahun.find(item => item.tahun_ke === 4)?.target,
                                ind_target_per_tahun_5: indikator.target_per_tahun.find(item => item.tahun_ke === 5)?.target,
                                ind_capaian_per_tahun_1: indikator.capaian_per_tahun.find(item => item.tahun_ke === 1)?.capaian,
                                ind_capaian_per_tahun_2: indikator.capaian_per_tahun.find(item => item.tahun_ke === 2)?.capaian,
                                ind_capaian_per_tahun_3: indikator.capaian_per_tahun.find(item => item.tahun_ke === 3)?.capaian,
                                ind_capaian_per_tahun_4: indikator.capaian_per_tahun.find(item => item.tahun_ke === 4)?.capaian,
                                ind_capaian_per_tahun_5: indikator.capaian_per_tahun.find(item => item.tahun_ke === 5)?.capaian,
                                ind_rasio_per_tahun_1: indikator.rasio_per_tahun.find(item => item.tahun_ke === 1)?.rasio,
                                ind_rasio_per_tahun_2: indikator.rasio_per_tahun.find(item => item.tahun_ke === 2)?.rasio,
                                ind_rasio_per_tahun_3: indikator.rasio_per_tahun.find(item => item.tahun_ke === 3)?.rasio,
                                ind_rasio_per_tahun_4: indikator.rasio_per_tahun.find(item => item.tahun_ke === 4)?.rasio,
                                ind_rasio_per_tahun_5: indikator.rasio_per_tahun.find(item => item.tahun_ke === 5)?.rasio,
                                totalPagu: subkegiatan.pagu.totalPagu,
                                pagu_per_tahun_1: subkegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 1)?.pagu,
                                pagu_per_tahun_2: subkegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 2)?.pagu,
                                pagu_per_tahun_3: subkegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 3)?.pagu,
                                pagu_per_tahun_4: subkegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 4)?.pagu,
                                pagu_per_tahun_5: subkegiatan.pagu.pagu_per_tahun.find(item => item.tahun_ke === 5)?.pagu,
                                realisasi_per_tahun_1: subkegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 1)?.realisasi,
                                realisasi_per_tahun_2: subkegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 2)?.realisasi,
                                realisasi_per_tahun_3: subkegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 3)?.realisasi,
                                realisasi_per_tahun_4: subkegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 4)?.realisasi,
                                realisasi_per_tahun_5: subkegiatan.pagu.realisasi_per_tahun.find(item => item.tahun_ke === 5)?.realisasi,
                                rasio_per_tahun_1: subkegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 1)?.rasio,
                                rasio_per_tahun_2: subkegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 2)?.rasio,
                                rasio_per_tahun_3: subkegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 3)?.rasio,
                                rasio_per_tahun_4: subkegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 4)?.rasio,
                                rasio_per_tahun_5: subkegiatan.pagu.rasio_per_tahun.find(item => item.tahun_ke === 5)?.rasio,
                            })
                        }
                    }
                }
            }
        }
    }

    console.log(result)
    return result;
}

// 
export interface RKPDTriwulanMaster {
    catatan: {
        pendorong: string
        penghambat: string
        tl_1: string
        tl_2: string
    },
    hasil: {
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
                    paguPeriode: number;
                    paguTahunEval: number;
                    triwulan: {
                        triwulan: number;
                        realisasi: number | string;
                    }[];
                    totalRealisasi: number;
                    persenRealisasi: string;
                    totalRealisasiPeriode: number;
                    persenRealisasiPeriode: string;
                }
                kegiatan: {
                    id: number;
                    parent: number;
                    kode: string;
                    name: string;
                    type: string;
                    pagu: {
                        paguPeriode: number;
                        paguTahunEval: number;
                        triwulan: {
                            triwulan: number;
                            realisasi: number | string;
                        }[];
                        totalRealisasi: number;
                        persenRealisasi: string;
                        totalRealisasiPeriode: number;
                        persenRealisasiPeriode: string;
                    }
                    subKegiatan: {
                        id: number;
                        parent: number;
                        kode: string;
                        name: string;
                        type: string;
                        indikator: {
                            id: number;
                            name: string;
                            satuan: string;
                            target_akhir_periode: number
                            target_tahun_dievaluasi: number
                            triwulan: {
                                triwulan: number;
                                capaian: number | string;
                            }[];
                            total_capaian: number;
                            persen_capaian: string;
                            total_capaian_periode: number;
                            persen_capaian_periode: string;

                        }[]
                        pagu: {
                            paguPeriode: number;
                            paguTahunEval: number;
                            triwulan: {
                                triwulan: number;
                                realisasi: number | string;
                            }[];
                            totalRealisasi: number;
                            persenRealisasi: string;
                            totalRealisasiPeriode: number;
                            persenRealisasiPeriode: string;
                        }
                    }[]
                }[]
            }[]
        }[]
    }[]
}

export interface FlatRKPDTriwulan {
    kode?: string;
    name?: string;
    type?: string;

    // program.pagu
    paguPeriode?: number;
    paguTahunEval?: number;
    pagu_triwulan_realisasi_1?: number | string;
    pagu_triwulan_realisasi_2?: number | string;
    pagu_triwulan_realisasi_3?: number | string;
    pagu_triwulan_realisasi_4?: number | string;

    totalRealisasi?: number;
    persenRealisasi?: string;
    totalRealisasiPeriode?: number;
    persenRealisasiPeriode?: string;

    // indikator
    ind_name?: string;
    ind_satuan?: string;
    ind_target_akhir_periode?: number;
    ind_target_tahun_dievaluasi?: number;
    ind_triwulan_capaian_1?: number | string
    ind_triwulan_capaian_2?: number | string
    ind_triwulan_capaian_3?: number | string
    ind_triwulan_capaian_4?: number | string
    total_capaian?: number;
    persen_capaian?: string;
    total_capaian_periode?: number;
    persen_capaian_periode?: string;
}


export const getRKPDTriwulan = async (skpd_periode_id: number, tahun: number): Promise<RKPDMaster['hasil']> => {
    const response = await api.get<ApiResponse<RKPDMaster>>(`/rkpd/hasil/laporan-tahunan/${skpd_periode_id}/${tahun}`);
    return response.data.data.hasil;
};

export function flatRKPDTriwulan(data: RKPDTriwulanMaster['hasil']): FlatRKPDTriwulan[] {
    const result: FlatRKPDTriwulan[] = [];

    for (const urusan of data) {
        result.push({
            kode: urusan.kode,
            name: urusan.name,
            type: urusan.type,
        });

        for (const bidang of urusan.bidang) {
            result.push({
                kode: `${urusan.kode}.${bidang.kode}`,
                name: bidang.name,
                type: bidang.type,
            });

            for (const program of bidang.program) {
                result.push({
                    kode: `${urusan.kode}.${bidang.kode}.${program.kode}`,
                    name: program.name,
                    type: program.type,
                    paguPeriode: program.pagu.paguPeriode,
                    paguTahunEval: program.pagu.paguTahunEval,
                    pagu_triwulan_realisasi_1: program.pagu.triwulan.find(item => item.triwulan === 1)?.realisasi,
                    pagu_triwulan_realisasi_2: program.pagu.triwulan.find(item => item.triwulan === 2)?.realisasi,
                    pagu_triwulan_realisasi_3: program.pagu.triwulan.find(item => item.triwulan === 3)?.realisasi,
                    pagu_triwulan_realisasi_4: program.pagu.triwulan.find(item => item.triwulan === 4)?.realisasi,
                    totalRealisasi: program.pagu.totalRealisasi,
                    persenRealisasi: program.pagu.persenRealisasi,
                    totalRealisasiPeriode: program.pagu.totalRealisasiPeriode,
                    persenRealisasiPeriode: program.pagu.persenRealisasiPeriode
                });
                for (const kegiatan of program.kegiatan) {
                    result.push({
                        kode: `${urusan.kode}.${bidang.kode}.${program.kode}.${kegiatan.kode}`,
                        name: kegiatan.name,
                        type: kegiatan.type,
                        paguPeriode: kegiatan.pagu.paguPeriode,
                        paguTahunEval: kegiatan.pagu.paguTahunEval,
                        pagu_triwulan_realisasi_1: kegiatan.pagu.triwulan.find(item => item.triwulan === 1)?.realisasi ?? 0,
                        pagu_triwulan_realisasi_2: kegiatan.pagu.triwulan.find(item => item.triwulan === 2)?.realisasi ?? 0,
                        pagu_triwulan_realisasi_3: kegiatan.pagu.triwulan.find(item => item.triwulan === 3)?.realisasi ?? 0,
                        pagu_triwulan_realisasi_4: kegiatan.pagu.triwulan.find(item => item.triwulan === 4)?.realisasi ?? 0,
                        totalRealisasi: kegiatan.pagu.totalRealisasi,
                        persenRealisasi: kegiatan.pagu.persenRealisasi,
                        totalRealisasiPeriode: kegiatan.pagu.totalRealisasiPeriode,
                        persenRealisasiPeriode: kegiatan.pagu.persenRealisasiPeriode
                    })
                    for (const subkegiatan of kegiatan.subKegiatan) {
                        for (const indikator of subkegiatan.indikator) {
                            result.push({
                                kode: `${urusan.kode}.${bidang.kode}.${program.kode}.${kegiatan.kode}.${subkegiatan.kode}`,
                                name: subkegiatan.name,
                                type: subkegiatan.type,
                                ind_name: indikator.name,
                                ind_satuan: indikator.satuan,
                                ind_target_akhir_periode: indikator.target_akhir_periode,
                                ind_target_tahun_dievaluasi: indikator.target_tahun_dievaluasi,
                                ind_triwulan_capaian_1: indikator.triwulan.find(item => item.triwulan === 1)?.capaian,
                                ind_triwulan_capaian_2: indikator.triwulan.find(item => item.triwulan === 2)?.capaian,
                                ind_triwulan_capaian_3: indikator.triwulan.find(item => item.triwulan === 3)?.capaian,
                                ind_triwulan_capaian_4: indikator.triwulan.find(item => item.triwulan === 4)?.capaian,
                                total_capaian: indikator.total_capaian,
                                persen_capaian: indikator.persen_capaian,
                                total_capaian_periode: indikator.total_capaian_periode,
                                persen_capaian_periode: indikator.persen_capaian_periode,
                            })
                        }
                    }
                }
            }
        }
    }
    return result;
}
