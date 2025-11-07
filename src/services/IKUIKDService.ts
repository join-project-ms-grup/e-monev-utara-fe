import api, { type ApiResponse } from "../lib/api";

/**
 * Ambil semua data skpd indikator kinerja
 */
export const getIKSKPD = async (id: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/ik/skpd/list/${id}`);
    return response.data.data;
};

export interface ListIK {
    name: string;
    wMasters: {
        name: string;
        kode?: string;
        uraian: {
            id: number;
            name: string;
            satuan: string;
            base_line: string;
            perhitungan: string;
            is_iku: boolean;
            target: {
                id: number;
                uraian_id: number;
                tahun: number;
                tahun_ke: number;
                target: string;
                realisasi?: string;
            }[];
        }[];
    }[]
}

/**
 * Menambahkan data IKU
 */
export const getIKU = async ({ skpd_id, periodeId }: { skpd_id: number | string, periodeId: number }): Promise<any> => {
    const response = await api.post<ApiResponse<any>>("/ik/target-realisasi/list-target-iku", { skpd_id, periodeId });
    return response.data.data;
};

export const getIKD = async ({ skpd_id, periodeId }: { skpd_id: number | string, periodeId: number }): Promise<any> => {
    const response = await api.post<ApiResponse<any>>("/ik/target-realisasi/list-target-ikd", { skpd_id, periodeId });
    return response.data.data;
};

export const toggleTagIKU = async ({ id, skpd_id, periodeId }: { id: number, skpd_id: number, periodeId: number }): Promise<any> => {
    const response = await api.patch<ApiResponse<any>>(`/ik/target-realisasi/toggle-iku-ikd/${id}`, { skpd_id, periodeId });
    return response.data.data;
};

export interface FlatIK {
    skpdName: string;
    wMasterName: string;
    uraianId: number;
    uraianName: string;
    satuan: string;
    base_line: string;
    perhitungan: string;
    is_iku: boolean;

    // Tahun ke-1
    t_1_id: number;
    t_1_uraian_id: number;
    t_1_tahun: number;
    t_1_tahun_ke: number;
    t_1_target: string;
    t_1_realisasi?: string | null;

    // Tahun ke-2
    t_2_id: number;
    t_2_uraian_id: number;
    t_2_tahun: number;
    t_2_tahun_ke: number;
    t_2_target: string;
    t_2_realisasi?: string | null;

    // Tahun ke-3
    t_3_id: number;
    t_3_uraian_id: number;
    t_3_tahun: number;
    t_3_tahun_ke: number;
    t_3_target: string;
    t_3_realisasi?: string | null;

    // Tahun ke-4
    t_4_id: number;
    t_4_uraian_id: number;
    t_4_tahun: number;
    t_4_tahun_ke: number;
    t_4_target: string;
    t_4_realisasi?: string | null;

    // Tahun ke-5
    t_5_id: number;
    t_5_uraian_id: number;
    t_5_tahun: number;
    t_5_tahun_ke: number;
    t_5_target: string;
    t_5_realisasi?: string | null;

    // Tahun ke-6
    t_6_id: number;
    t_6_uraian_id: number;
    t_6_tahun: number;
    t_6_tahun_ke: number;
    t_6_target: string;
    t_6_realisasi?: string | null;
}


export const flatIK = (data: ListIK[]): FlatIK[] => {
    const flat: FlatIK[] = [];

    data.forEach((skpd) => {
        skpd.wMasters.forEach((wm) => {
            wm.uraian.forEach((uraian) => {
                const flatItem: any = {
                    skpdName: skpd.name,
                    wMasterName: wm.name,
                    uraianId: uraian.id,
                    uraianName: uraian.name,
                    satuan: uraian.satuan,
                    base_line: uraian.base_line,
                    perhitungan: uraian.perhitungan,
                    is_iku: uraian.is_iku,
                };

                uraian.target.forEach((t) => {
                    const prefix = `t_${t.tahun_ke}_`;
                    flatItem[`${prefix}id`] = t.id;
                    flatItem[`${prefix}uraian_id`] = t.uraian_id;
                    flatItem[`${prefix}tahun`] = t.tahun;
                    flatItem[`${prefix}tahun_ke`] = t.tahun_ke;
                    flatItem[`${prefix}target`] = t.target;
                    flatItem[`${prefix}realisasi`] = t.realisasi ?? null;
                });

                flat.push(flatItem as FlatIK);
            });
        });
    });

    return flat;
};

