import api, { type ApiResponse } from "../lib/api";

/**
 * Ambil semua data skpd indikator kinerja
 */
export const getIKSKPD = async (id: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/ik/skpd/list/${id}`);
    return response.data.data;
};

export interface ListIKU {
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
            is_iku: string;
            target: {
                i: number;
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
export const getIKU = async ({ skpd_id, periodeId }: { skpd_id: number, periodeId: number }): Promise<any> => {
    const response = await api.post<ApiResponse<any>>("/ik/target-realisasi/list-target-iku", { skpd_id, periodeId });
    return response.data.data;
};

export const toggleTagIKU = async ({id, skpd_id, periodeId }: {id: number, skpd_id: number, periodeId: number }): Promise<any> => {
    const response = await api.patch<ApiResponse<any>>(`/ik/target-realisasi/toggle-iku-ikd/${id}`, { skpd_id, periodeId });
    return response.data.data;
};

export interface FlatIKU {
    skpdName: string;
    wMasterName: string;
    uraianId: number;
    uraianName: string;
    satuan: string;
    base_line: string;
    perhitungan: string;
    is_iku: string;
    targetTahun: number;
    targetTahunKe: number;
    target: string;
    realisasi?: string;
}

export const flatIKU = (data: ListIKU[]): FlatIKU[] => {
    const flat: FlatIKU[] = [];

    data.forEach((skpd) => {
        skpd.wMasters.forEach((wm) => {
            wm.uraian.forEach((uraian) => {
                uraian.target.forEach((t) => {
                    flat.push({
                        skpdName: skpd.name,
                        wMasterName: wm.name,
                        uraianId: uraian.id,
                        uraianName: uraian.name,
                        satuan: uraian.satuan,
                        base_line: uraian.base_line,
                        perhitungan: uraian.perhitungan,
                        is_iku: uraian.is_iku,
                        targetTahun: t.tahun,
                        targetTahunKe: t.tahun_ke,
                        target: t.target,
                        realisasi: t.realisasi,
                    });
                });
            });
        });
    });

    return flat;
};
