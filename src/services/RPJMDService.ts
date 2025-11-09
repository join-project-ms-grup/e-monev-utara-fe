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

export interface FlatRPJMD {
    kode?: string;
    name?: string;
    type?: string;

    outcome_name?: string;
    indikator_o_name?: string;
    indikator_o_satuan?: string;

    target_io_tahun_1?: number;
    target_io_tahun_ke_1?: number;
    target_io_target_1?: number;
    target_io_capaian_1?: number;
    target_io_persen_1?: number;

    target_io_tahun_2?: number;
    target_io_tahun_ke_2?: number;
    target_io_target_2?: number;
    target_io_capaian_2?: number;
    target_io_persen_2?: number;

    target_io_tahun_3?: number;
    target_io_tahun_ke_3?: number;
    target_io_target_3?: number;
    target_io_capaian_3?: number;
    target_io_persen_3?: number;

    target_io_tahun_4?: number;
    target_io_tahun_ke_4?: number;
    target_io_target_4?: number;
    target_io_capaian_4?: number;
    target_io_persen_4?: number;

    target_io_tahun_5?: number;
    target_io_tahun_ke_5?: number;
    target_io_target_5?: number;
    target_io_capaian_5?: number;
    target_io_persen_5?: number;

    pagu_tahun_1?: number;
    pagu_tahun_ke_1?: number;
    pagu_pagu_1?: number;
    pagu_realisasi_1?: number;
    pagu_persen_1?: number;

    pagu_tahun_2?: number;
    pagu_tahun_ke_2?: number;
    pagu_pagu_2?: number;
    pagu_realisasi_2?: number;
    pagu_persen_2?: number;

    pagu_tahun_3?: number;
    pagu_tahun_ke_3?: number;
    pagu_pagu_3?: number;
    pagu_realisasi_3?: number;
    pagu_persen_3?: number;

    pagu_tahun_4?: number;
    pagu_tahun_ke_4?: number;
    pagu_pagu_4?: number;
    pagu_realisasi_4?: number;
    pagu_persen_4?: number;

    pagu_tahun_5?: number;
    pagu_tahun_ke_5?: number;
    pagu_pagu_5?: number;
    pagu_realisasi_5?: number;
    pagu_persen_5?: number;
}

export function flatRPJMD(data: RPJMDMaster[]): FlatRPJMD[] {
    const result: FlatRPJMD[] = [];

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
                    type: 'program',
                });

                for (const outcome of program.outcome) {
                    const indikator = outcome.indikatorOutcome;
                    if (indikator) {
                        const target = indikator.targetIndikatorOutcome;
                        const targets = [1, 2, 3, 4, 5].map(tahun => target.find(item => item.tahun_ke === tahun));
                        const pagu = program.pagu?.pagu;
                        const pagus = [1, 2, 3, 4, 5].map(tahun => pagu.find(item => item.tahun_ke === tahun));
                        const data = {
                            kode: `${urusan.kode}.${bidang.kode}.${program.kode}`,
                            name: outcome.outcome,
                            // outcome_name: outcome.outcome,
                            indikator_o_name: indikator.nama,
                            indikator_o_satuan: indikator.satuan ?? ''
                        };

                        targets.forEach((t, i) => {
                            const idx = i + 1;
                            (data as any)[`target_io_tahun_${idx}`] = t?.tahun_ke;
                            (data as any)[`target_io_tahun_ke_${idx}`] = t?.tahun_ke;
                            (data as any)[`target_io_target_${idx}`] = t?.target;
                            (data as any)[`target_io_capaian_${idx}`] = t?.capaian;
                            (data as any)[`target_io_persen_${idx}`] = t?.persen;
                        });

                        pagus.forEach((p, i) => {
                            const idx = i + 1;
                            (data as any)[`pagu_tahun_${idx}`] = p?.tahun;
                            (data as any)[`pagu_tahun_ke_${idx}`] = p?.tahun_ke;
                            (data as any)[`pagu_pagu_${idx}`] = Number(p?.pagu);
                            (data as any)[`pagu_realisasi_${idx}`] = Number(p?.realisasi);
                            (data as any)[`pagu_persen_${idx}`] = p?.persen;
                        });

                        result.push(data);

                    }
                }
            }
        }
    }

    return result;
}
