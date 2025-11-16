import api, { type ApiResponse } from "../../lib/api";

export interface DAKIdentifikasi {
    opd: string;
    sub: {
        nama: string;
        row: {
            id_ident: number;
            bidang: string;
            rekening: string;
            paket_detail: string;
            anggaran: string;
        }[]
    }[]
}

export const getIdentifikasiDAK = async ({ tahun, opd_id, sub_jenis }: { tahun: number, opd_id: number | null, sub_jenis: number | null }): Promise<DAKIdentifikasi[]> => {
    const response = await api.post<ApiResponse<DAKIdentifikasi[]>>("/dak/fisik/list-ident", { tahun, opd_id, sub_jenis });
    return response.data.data;
};

export interface FlatIdentifikasiDAK {
    level?: string;
    opd?: string;
    sub_nama?: string;
    id_ident?: number;
    bidang?: string;
    rekening?: string;
    paket_detail?: string;
    anggaran?: string;
}

export function flatIdentifikasiDAK(data: DAKIdentifikasi[]): FlatIdentifikasiDAK[] {
    const result: FlatIdentifikasiDAK[] = [];

    for (const opdItem of data) {
        result.push({
            opd: opdItem.opd,
            level: 'opd'
        });
        for (const subItem of opdItem.sub) {
            result.push({
                sub_nama: subItem.nama,
                level: 'sub_jenis_dak'
            })
            for (const rowItem of subItem.row) {
                result.push({
                    id_ident: rowItem.id_ident,
                    bidang: rowItem.bidang,
                    rekening: rowItem.rekening,
                    paket_detail: rowItem.paket_detail,
                    anggaran: rowItem.anggaran,
                });
            }
        }
    }

    return result;
}

export interface IdentifikasiDetailDAK {
    jenis_dak_id: number;
    jenis_dak: string;
    sub_jenis_dak_id: number;
    sub_jenis_dak: string;
    bidang_dak_id: number;
    bidang_dak: string;
    sub_bidang_dak_id: number;
    sub_bidang_dak: string;
    tahun: number;
    kab_kot: string;
    opd_id: number;
    opd: string;
    bidang_opd: string;
    urusan_id: number;
    urusan_kode: string;
    urusan: string;
    bidang_id: number;
    bidang_kode: string;
    bidang: string;
    program_id: number;
    program_kode: string;
    program: string;
    kegiatan_id: number;
    kegiatan_kode: string;
    kegiatan: string;
    subKegiatan_id: number;
    subKegiatan_kode: string;
    subKegiatan: string;
    catatan: string | null;
    verif_status: string;
    nama_paket: string;
    detail_paket: string;
    volume: number;
    satuan: string;
    estimasi_waktu: string;
    jumlah_penerima_manfaat: string;
    anggaran_dak: string;
    desa_kel: string;
    kec: string;
    bujur: string[],
    lintang: string[],
    foto_kegiatan: string | null,
    mekanisme: string,
    mekanisme_volume: number,
    mekanisme_uang: string,
    metode_pembayaran: string,
    dokumen: {
        id: number,
        id_berkas: number,
        id_ident: number,
        file: string | null,
        Kesesuaian: string | null,
        Waktu: string | null,
        Keterangan: string | null,
        pesan: string | null,
        create_at: string,
        updated_at: string,
        jenis_berkas: {
            id: number,
            jenis_dak: number,
            no: number,
            group: string,
            name: string,
            keterangan: string | null,
            status: boolean,
            create_at: string,
            updated_at: string
        }
    }[]
}

export const getIdentifikasiDetailDAK = async (id: number): Promise<IdentifikasiDetailDAK> => {
    const response = await api.get<ApiResponse<IdentifikasiDetailDAK>>(`dak/fisik/${id}/detail-ident`);
    return response.data.data;
};

export interface IdentifikasiDAKForm {
    // non payload
    jenis_dak_id: string;
    bidang_dak_id: string;
    urusan_id: string;
    bidang_id: string;
    program_id: string;
    kegiatan_id: string;
    // payload
    sub_jenis_id: number;
    sub_bidang_id: number;
    tahun: number;
    opd_id: number;
    bidang_opd: string;
    sub_kegiatan_id: number;
    catatan: string | null;
    nama_paket: string;
    detail_paket: string;
    volume: number;
    satuan: string;
    estimasi: string;
    jumlah_penerima: string;
    anggaran: number;
    des_kel: string;
    kec: string;
    bujur: string[];
    lintang: string[];
    foto: File | string | null;
    mekanisme: string;
    metode: string;
    volume_mekanisme: number;
    uang_mekanisme: number;
    dokumen: {
        id_berkas: number;
        file: File | string | null;
        Waktu: string | null;
        Keterangan: string | null;
    }[];
}

export interface IdentifikasiDAKFormSubmit {
    id_ident?: number;
    sub_jenis_id: number;
    sub_bidang_id: number;
    tahun: number;
    opd_id: number;
    bidang_opd: string;
    sub_kegiatan_id: number;
    catatan: string | null;
    nama_paket: string;
    detail_paket: string;
    volume: number;
    satuan: string;
    estimasi: string;
    jumlah_penerima: string;
    anggaran: number;
    des_kel: string;
    kec: string;
    bujur: string;
    lintang: string;
    foto: File | string | null;
    mekanisme: string;
    metode: string;
    volume_mekanisme: number;
    uang_mekanisme: number;
    dokumen?: {
        id_berkas: number;
        file: File | string | null;
        Waktu: string | null;
        Keterangan: string | null;
    }[];
}

export const addIdentifikasiDAK = async (payload: IdentifikasiDAKFormSubmit): Promise<IdentifikasiDAKFormSubmit> => {
    const response = await api.post<ApiResponse<IdentifikasiDAKFormSubmit>>("/dak/fisik/add-ident", payload);
    return response.data.data;
};

export const editIdentifikasiDAK = async (payload: IdentifikasiDAKFormSubmit): Promise<IdentifikasiDAKFormSubmit> => {
    const response = await api.put<ApiResponse<IdentifikasiDAKFormSubmit>>("/dak/fisik/update-ident", payload);
    return response.data.data;
};

export const setStatusIdentDak = async (payload: {id_ident: number, status: string}) => {
  const response = await api.patch<ApiResponse<any>>(`/dak/fisik/update-tindakan`, payload);
  return response.data.data;
};

export interface FileIdentifikasiDAK {
    id_dok: number;
    file?: File | null;
    Kesesuaian?: string;
    Waktu?: string;
    Keterangan?: string;
    pesan?: string;
}

export const updateFileIdentifikasiDAK = async (payload: FileIdentifikasiDAK): Promise<FileIdentifikasiDAK> => {
    const response = await api.put<ApiResponse<FileIdentifikasiDAK>>("/dak/fisik/update-file", payload);
    return response.data.data;
};