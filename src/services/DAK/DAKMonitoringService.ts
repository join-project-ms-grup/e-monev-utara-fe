import type { ApiResponse } from "../../lib/api";
import api from "../../lib/api";

export interface DAKMonitoring {
    nama: string;
    bidang: {
        nama: string;
        sub_bidang: {
            nama: string;
            row: {
                id_realisasi: number;
                nama_paket: string;
                perencanaan: {
                    volume: string;
                    jumlah_penerima: string;
                    anggaran: string;
                }
                mekanisme: {
                    kegiatan: string;
                    volume: string;
                    uang: string;
                }
                realisasi: {
                    fisik: {
                        capaian: number;
                        totalSd: number;
                    },
                    keuangan: {
                        capaian: string;
                        persen: number;
                    }
                },
                sisa_anggaran: number;
                sasaran_lokasi: string | null;
                catatan: string | null;
            }[]
        }[]
    }[]
}

export const getMonitoringDAK = async ({ tahun, opd_id, sub_jenis, triwulan }: { tahun: number, opd_id: number | null, sub_jenis: number | null, triwulan: number }): Promise<DAKMonitoring[]> => {
    const response = await api.post<ApiResponse<DAKMonitoring[]>>("/dak/fisik/list-monit", { tahun, opd_id, sub_jenis, triwulan });
    return response.data.data;
};

export interface FlatMonitoringDAK {
    level?: string;
    nama?: string;

    id_realisasi?: number;
    nama_paket?: string;
    perencanaan?: {
        volume?: string;
        jumlah_penerima?: string;
        anggaran?: string;
    }
    mekanisme?: {
        kegiatan?: string;
        volume?: string;
        uang?: string;
    }
    realisasi?: {
        fisik?: {
            capaian?: number;
            totalSd?: number;
        },
        keuangan?: {
            capaian?: string;
            persen?: number;
        }
    },
    sisa_anggaran?: number;
    sasaran_lokasi?: string | null;
    catatan?: string | null;
}

export function flatMonitoringDAK(data: DAKMonitoring[]): FlatMonitoringDAK[] {
    const result: FlatMonitoringDAK[] = [];

    for (const subjenis of data) {
        result.push({
            nama: subjenis.nama,
            level: 'sub_jenis_dak'
        });
        for (const bidang of subjenis.bidang) {
            result.push({
                nama: bidang.nama,
                level: 'bidang'
            })
            for (const subbid of bidang.sub_bidang) {
                result.push({
                    nama: subbid.nama,
                    level: 'sub_bidang'
                })
                for (const row of subbid.row) {
                    result.push({
                        id_realisasi: row.id_realisasi,
                        nama_paket: row.nama_paket,
                        perencanaan: {
                            volume: row.perencanaan.volume,
                            jumlah_penerima: row.perencanaan.jumlah_penerima,
                            anggaran: row.perencanaan.anggaran,
                        },
                        mekanisme: {
                            kegiatan: row.mekanisme.kegiatan,
                            volume: row.mekanisme.volume,
                            uang: row.mekanisme.uang,
                        },
                        realisasi: {
                            fisik: {
                                capaian: row.realisasi.fisik.capaian,
                                totalSd: row.realisasi.fisik.totalSd,
                            },
                            keuangan: {
                                capaian: row.realisasi.keuangan.capaian,
                                persen: row.realisasi.keuangan.persen,
                            }
                        },
                        sisa_anggaran: row.sisa_anggaran,
                        sasaran_lokasi: row.sasaran_lokasi,
                        catatan: row.catatan,
                    })
                }
            }
        }
    }

    return result;
}

export interface MasalahDAK {
    id: number;
    name: string;
    keterangan: string;
    status: boolean;
}

export const getMasalahDAK = async (kode_jenis: number): Promise<MasalahDAK[]> => {
    const response = await api.post<ApiResponse<MasalahDAK[]>>("/dak/masalah/list", { kode_jenis });
    return response.data.data;
};

export interface RealisasiMonitoringDAKForm {
    id_realisasi: number;
    fisik: number;
    anggaran: number;
    sasaran_lokasi?: boolean | null
    kesesuaian_juknis?: boolean | null
    catatan?: string | null
}

export const realisasiMonitoringDAK = async (payload: RealisasiMonitoringDAKForm): Promise<RealisasiMonitoringDAKForm> => {
    const response = await api.post<ApiResponse<RealisasiMonitoringDAKForm>>("/dak/fisik/realisasi", payload);
    return response.data.data;
};