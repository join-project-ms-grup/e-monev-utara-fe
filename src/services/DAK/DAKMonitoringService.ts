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
                kunci: string | null;
                sasaran_lokasi: string | null;
                kesesuaian_juknis: string | null;
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
    kunci?: string | null;
    sasaran_lokasi?: string | null;
    kesesuaian_juknis?: string | null;
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
                        kesesuaian_juknis: row.kesesuaian_juknis,
                        kunci: row.kunci,
                        catatan: row.catatan,
                    })
                }
            }
        }
    }

    return result;
}

export interface FlatMonitoringDAKLaporan {
    level?: string;
    nama?: string;

    nama_sub_jenis?: string;
    nama_bidang?: string;
    nama_sub_bidang?: string;

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
    kunci?: string | null;
    sasaran_lokasi?: string | null;
    kesesuaian_juknis?: string | null;
    catatan?: string | null;
}

export function flatMonitoringDAKLaporan(data: DAKMonitoring[]): FlatMonitoringDAKLaporan[] {
    const result: FlatMonitoringDAKLaporan[] = [];

    for (const subjenis of data) {
        // result.push({
        //     nama: subjenis.nama,
        //     level: 'sub_jenis_dak'
        // });
        for (const bidang of subjenis.bidang) {
            // result.push({
            //     nama: bidang.nama,
            //     level: 'bidang'
            // })
            for (const subbid of bidang.sub_bidang) {
                // result.push({
                //     nama: subbid.nama,
                //     level: 'sub_bidang'
                // })
                for (const row of subbid.row) {
                    result.push({
                        nama_sub_jenis: subjenis.nama,
                        nama_bidang: bidang.nama,
                        nama_sub_bidang: subbid.nama,

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
                        kesesuaian_juknis: row.kesesuaian_juknis,
                        kunci: row.kunci,
                        catatan: row.catatan,
                    })
                }
            }
        }
    }

    return result;
}

export interface MasalahDAK {
    kode_jenis?: string | number | null;
    id?: number | null;
    name?: string;
    keterangan?: string;
    status?: boolean | null;
}

export interface RekapDak {
    rangking: number;
    nama_opd: string;
    jumlah_paket: string;
    jumlah_anggaran: string;
    realisasi_volume: string;
    realisasi_keuangan: string;
    persentase: number
}

export interface RekapDAKPayload {
    triwulan: number;
    tahun: number;
    jenis: number
}

export const getMasalahDAK = async (kode_jenis: number): Promise<MasalahDAK[]> => {
    const response = await api.post<ApiResponse<MasalahDAK[]>>("/dak/masalah/list", { kode_jenis });
    return response.data.data;
};

export const addMasalahDAK = async (payload: MasalahDAK): Promise<MasalahDAK> => {
    const response = await api.post<ApiResponse<MasalahDAK>>("/dak/masalah/add", payload);
    return response.data.data;
};

export const updateMasalahDAK = async (payload: MasalahDAK): Promise<MasalahDAK> => {
    const response = await api.put<ApiResponse<MasalahDAK>>("/dak/masalah/update", payload);
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

export const kunciMonitoringDAK = async ({ id_realisasi }: { id_realisasi: number }): Promise<any> => {
    const response = await api.patch<ApiResponse<any>>("/dak/fisik/toggle-kunci", { id_realisasi });
    return response.data.data;
};

export interface MonitorMasalahDak {
    id_realisasi?: number;
    masalah?: string;
    masalah_lain?: string;
    file_masalah?: string;
}

export const getMonitorMasalahDAK = async (id_realisasi: number): Promise<MonitorMasalahDak> => {
    const response = await api.post<ApiResponse<MonitorMasalahDak>>("/dak/fisik/masalah-realisasi", { id_realisasi });
    return response.data.data;
};

export const updateMonitorMasalahDAK = async (payload: MonitorMasalahDak): Promise<MonitorMasalahDak> => {
    const response = await api.put<ApiResponse<MonitorMasalahDak>>("/dak/fisik/update-masalah-realisasi", payload);
    return response.data.data;
};

export const GetRekapDAK = async (payload: RekapDAKPayload): Promise<RekapDak[]> => {
    const response = await api.post<ApiResponse<RekapDak[]>>("/dak/fisik/rekap-realisasi", payload);
    return response.data.data
}