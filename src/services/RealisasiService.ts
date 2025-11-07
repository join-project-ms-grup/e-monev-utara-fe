import api, { type ApiResponse } from "../lib/api";

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

export interface RealisasiForm {
    rekening_kode?: string;
    rekening_name?: string;
    indikator_name?: string;
    id_pagu?: number;
    id_rincian?: number;
    realisasi?: {
        triwulan?: string | number;
        realisasi?: string | number
    }[];
    capaian?: {
        triwulan?: string | number;
        capaian?: string | number
    }[];
}

export interface RealisasiGetForm {
    skpd_periode_id: number;
    tahun_ke: number;
}

/**
 * Ambil semua data realisasi
 */
export const getRealisasi = async (payload: RealisasiGetForm): Promise<RealisasiMasterTree[]> => {
    const response = await api.post<ApiResponse<RealisasiMasterTree[]>>(`/rkpd/realisasi/list`, payload);
    return response.data.data;
};

export interface FlatRealisasi {
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
): Promise<FlatRealisasi[]> {
    const dataExcel: FlatRealisasi[] = [];

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

