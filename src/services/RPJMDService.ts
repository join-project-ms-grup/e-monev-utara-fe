import api, { type ApiResponse } from "../lib/api";

export interface RPJMDMaster {
    kode: string;
    name: string;
    type: string;
    bidang: {
        kode: string;
        name: string;
        type: string;
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
                        tahun_ke: number;
                        target: number;
                        capaian: number;
                        persen: number;
                    }[];
                };
            }[];
            pagu: {
                pagu: {
                    tahun: number;
                    tahun_ke: number;
                    pagu: string;
                    realisasi: string;
                    persen: number;
                }[];
            };
        }[];
    }[];
}

/**
 * Ambil semua data rpjmd
 */
export const getRPJMD = async (skpd_periode_id: number): Promise<RPJMDMaster[]> => {
    const response = await api.get<ApiResponse<RPJMDMaster[]>>(`/renstra/hasil/rpjmd/${skpd_periode_id}`);
    return response.data.data;
};

export interface FlatRPJMDFull {
    rpjmd_kode: string;
    rpjmd_name: string;
    rpjmd_type: string;
    bidang_kode: string;
    bidang_name: string;
    bidang_type: string;
    program_kode: string;
    program_name: string;
    outcome_name: string;
    indikator_name: string;
    indikator_satuan: string | null;

    // Target Indikator Outcome
    tahun_ke_1?: number;
    tahun_1?: number;
    target_1?: number;
    capaian_1?: number;
    persen_1?: number;

    tahun_ke_2?: number;
    tahun_2?: number;
    target_2?: number;
    capaian_2?: number;
    persen_2?: number;

    tahun_ke_3?: number;
    tahun_3?: number;
    target_3?: number;
    capaian_3?: number;
    persen_3?: number;

    tahun_ke_4?: number;
    tahun_4?: number;
    target_4?: number;
    capaian_4?: number;
    persen_4?: number;

    tahun_ke_5?: number;
    tahun_5?: number;
    target_5?: number;
    capaian_5?: number;
    persen_5?: number;

    // Pagu
    pagu_tahun_ke_1?: number;
    pagu_tahun_1?: number;
    pagu_1?: string;
    realisasi_1?: string;
    persen_pagu_1?: number;

    pagu_tahun_ke_2?: number;
    pagu_tahun_2?: number;
    pagu_2?: string;
    realisasi_2?: string;
    persen_pagu_2?: number;

    pagu_tahun_ke_3?: number;
    pagu_tahun_3?: number;
    pagu_3?: string;
    realisasi_3?: string;
    persen_pagu_3?: number;

    pagu_tahun_ke_4?: number;
    pagu_tahun_4?: number;
    pagu_4?: string;
    realisasi_4?: string;
    persen_pagu_4?: number;

    pagu_tahun_ke_5?: number;
    pagu_tahun_5?: number;
    pagu_5?: string;
    realisasi_5?: string;
    persen_pagu_5?: number;
}

export const flatRPJMD = (data: RPJMDMaster[]): FlatRPJMDFull[] => {
    const result: FlatRPJMDFull[] = [];

    data.forEach(rpjmd => {
        rpjmd.bidang.forEach(bidang => {
            bidang.program.forEach(program => {

                const paguByTahunKe: Record<number, typeof program.pagu.pagu[0]> = {};
                program.pagu?.pagu.forEach(paguItem => {
                    paguByTahunKe[paguItem.tahun_ke] = paguItem;
                });

                program.outcome.forEach(outc => {
                    const indikator = outc.indikatorOutcome; // objek tunggal

                    const row: FlatRPJMDFull = {
                        rpjmd_kode: rpjmd.kode,
                        rpjmd_name: rpjmd.name,
                        rpjmd_type: rpjmd.type,
                        bidang_kode: bidang.kode,
                        bidang_name: bidang.name,
                        bidang_type: bidang.type,
                        program_kode: program.kode,
                        program_name: program.name,
                        outcome_name: outc.outcome,
                        indikator_name: indikator.nama,
                        indikator_satuan: indikator.satuan,

                        // Inisialisasi semua kolom supaya TS aman
                        tahun_ke_1: undefined, tahun_1: undefined, target_1: undefined, capaian_1: undefined, persen_1: undefined,
                        tahun_ke_2: undefined, tahun_2: undefined, target_2: undefined, capaian_2: undefined, persen_2: undefined,
                        tahun_ke_3: undefined, tahun_3: undefined, target_3: undefined, capaian_3: undefined, persen_3: undefined,
                        tahun_ke_4: undefined, tahun_4: undefined, target_4: undefined, capaian_4: undefined, persen_4: undefined,
                        tahun_ke_5: undefined, tahun_5: undefined, target_5: undefined, capaian_5: undefined, persen_5: undefined,

                        pagu_tahun_ke_1: undefined, pagu_tahun_1: undefined, pagu_1: undefined, realisasi_1: undefined, persen_pagu_1: undefined,
                        pagu_tahun_ke_2: undefined, pagu_tahun_2: undefined, pagu_2: undefined, realisasi_2: undefined, persen_pagu_2: undefined,
                        pagu_tahun_ke_3: undefined, pagu_tahun_3: undefined, pagu_3: undefined, realisasi_3: undefined, persen_pagu_3: undefined,
                        pagu_tahun_ke_4: undefined, pagu_tahun_4: undefined, pagu_4: undefined, realisasi_4: undefined, persen_pagu_4: undefined,
                        pagu_tahun_ke_5: undefined, pagu_tahun_5: undefined, pagu_5: undefined, realisasi_5: undefined, persen_pagu_5: undefined,
                    };

                    indikator.targetIndikatorOutcome.forEach(target => {
                        const i = target.tahun_ke;

                        // targetIndikatorOutcome
                        (row as any)[`tahun_ke_${i}`] = target.tahun_ke;
                        (row as any)[`tahun_${i}`] = target.tahun;
                        (row as any)[`target_${i}`] = target.target;
                        (row as any)[`capaian_${i}`] = target.capaian;
                        (row as any)[`persen_${i}`] = target.persen;

                        // pagu
                        const paguItem = paguByTahunKe[i];
                        if (paguItem) {
                            (row as any)[`pagu_tahun_ke_${i}`] = paguItem.tahun_ke;
                            (row as any)[`pagu_tahun_${i}`] = paguItem.tahun;
                            (row as any)[`pagu_${i}`] = paguItem.pagu;
                            (row as any)[`realisasi_${i}`] = paguItem.realisasi;
                            (row as any)[`persen_pagu_${i}`] = paguItem.persen;
                        }
                    });

                    result.push(row);
                });

            });
        });
    });

    return result;
};