import { z } from 'zod';

// =============================
// SCHEMA (OPSIONAL)
// =============================
export const identifikasidakSchema = z.object({
    // non payload
    n_jenisDAK: z.union([z.string(), z.number()]).optional(),
    n_bidangDAK: z.union([z.string(), z.number()]).optional(),
    n_idUrusan: z.union([z.string(), z.number()]).optional(),
    n_idBidang: z.union([z.string(), z.number()]).optional(),
    n_idProgram: z.union([z.string(), z.number()]).optional(),
    n_idKegiatan: z.union([z.string(), z.number()]).optional(),
    // payload
    sub_jenis_id: z.union([z.string(), z.number()]).optional(),
    sub_bidang_id: z.union([z.string(), z.number()]).optional(),
    tahun: z.union([z.string(), z.number()]).optional(),
    opd_id: z.union([z.string(), z.number()]).optional(),
    bidang_opd: z.union([z.string(), z.number()]).optional(),
    sub_kegiatan_id: z.union([z.string(), z.number()]).optional(),
    catatan: z.string().optional(),
    nama_paket: z.string().optional(),
    detail_paket: z.string().optional(),
    volume: z.union([z.string(), z.number()]).optional(),
    satuan: z.string().optional(),
    estimasi: z.string().optional(),
    jumlah_penerima: z.union([z.string(), z.number()]).optional(),
    anggaran: z.union([z.string(), z.number()]).optional(),
    des_kel: z.string().optional(),
    kec: z.string().optional(),
    bujur: z.array(z.union([z.string(), z.number()])).length(3).optional(),
    lintang: z.array(z.union([z.string(), z.number()])).length(3).optional(),
    foto: z.any().optional(),
    mekanisme: z.enum(['swakelola', 'kontraktual']).optional(),
    metode: z.string().optional(),
    volume_mekanisme: z.union([z.string(), z.number()]).optional(),
    uang_mekanisme: z.union([z.string(), z.number()]).optional(),
    dokumen: z
        .array(
            z.object({
                id_berkas: z.union([z.string(), z.number()]),
                file: z.any().nullable(),
                Waktu: z.string().nullable(),
                Keterangan: z.string().nullable(),
            })
        )
        .length(12)
        .optional(),
});

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
// Helper validator untuk menolak 0 atau '0'
const nonZero = z.union([z.string(), z.number()]).refine(
    (val) => {
        const num = Number(val);
        return !isNaN(num) && num !== 0;
    },
    { message: 'Field wajib diisi' }
);

export const identifikasidakSchemaSubmit = z.object({
    // non payload
    n_jenisDAK: z.string().nonempty({ message: 'Field wajib diisi' }),
    n_bidangDAK: z.string().nonempty({ message: 'Field wajib diisi' }),
    n_idUrusan: z.string().nonempty({ message: 'Field wajib diisi' }),
    n_idBidang: z.string().nonempty({ message: 'Field wajib diisi' }),
    n_idProgram: z.string().nonempty({ message: 'Field wajib diisi' }),
    n_idKegiatan: z.string().nonempty({ message: 'Field wajib diisi' }),

    // payload
    sub_jenis_id: nonZero,
    sub_bidang_id: nonZero,
    tahun: nonZero,
    opd_id: nonZero,
    bidang_opd: z.string().nonempty({ message: 'Field wajib diisi' }),
    sub_kegiatan_id: nonZero,
    // detail
    nama_paket: z.string().nonempty({ message: 'Field wajib diisi' }),
    detail_paket: z.string().nonempty({ message: 'Field wajib diisi' }),
    volume: nonZero,
    satuan: z.string().nonempty({ message: 'Field wajib diisi' }),
    estimasi: z.string().nonempty({ message: 'Field wajib diisi' }),
    jumlah_penerima: z.union([z.string().nonempty({ message: 'Field wajib diisi' }), z.number()]).optional(),
    anggaran: nonZero,
    des_kel: z.string().nonempty({ message: 'Field wajib diisi' }),
    kec: z.string().nonempty({ message: 'Field wajib diisi' }),
    bujur: z.array(nonZero).length(3),
    lintang: z.array(nonZero).length(3),
    foto: z.any().nullable(),
    // mekanisme
    mekanisme: z.enum(['swakelola', 'kontrak', 'ekatalog']),
    catatan: z.string().nonempty({ message: 'Field wajib diisi' }),
    metode: z.string().nonempty({ message: 'Field wajib diisi' }),
    volume_mekanisme: nonZero,
    uang_mekanisme: nonZero,
    // dokumen
    dokumen: z
        .array(
            z.object({
                id_berkas: nonZero,
                file: z.any().nullable(),
                Waktu: z.string().nullable(),
                Keterangan: z.string().nullable(),
            })
        )
        .length(12),
});


// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
    return {
        // non payload
        n_jenisDAK: value.n_jenisDAK ?? '',
        n_bidangDAK: value.n_bidangDAK ?? '',
        n_idUrusan: value.n_idUrusan ?? '',
        n_idBidang: value.n_idBidang ?? '',
        n_idProgram: value.n_idProgram ?? '',
        n_idKegiatan: value.n_idKegiatan ?? '',
        // payload
        sub_jenis_id: value.sub_jenis_id ?? 0,
        sub_bidang_id: value.sub_bidang_id ?? 0,
        tahun: value.tahun ?? 0,
        opd_id: value.opd_id ?? 0,
        bidang_opd: value.bidang_opd ?? '',
        sub_kegiatan_id: value.sub_kegiatan_id ?? 0,
        catatan: value.catatan ?? '',
        nama_paket: value.nama_paket ?? '',
        detail_paket: value.detail_paket ?? '',
        volume: value.volume ?? 0,
        satuan: value.satuan ?? '',
        estimasi: value.estimasi ?? '',
        jumlah_penerima: value.jumlah_penerima ?? '',
        anggaran: value.anggaran ?? 0,
        des_kel: value.des_kel ?? '',
        kec: value.kec ?? '',
        bujur: value.bujur ?? [0, 0, 0],
        lintang: value.lintang ?? [0, 0, 0],
        foto: value.foto ?? null,
        mekanisme: value.mekanisme ?? 'swakelola',
        metode: value.metode ?? '',
        volume_mekanisme: value.volume_mekanisme ?? 0,
        uang_mekanisme: value.uang_mekanisme ?? 0,
        dokumen:
            value.dokumen ??
            Array.from({ length: 12 }, (_, i) => ({
                id_berkas: i + 1,
                file: null,
                Waktu: null,
                Keterangan: null,
            })),
    };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
    const mapped: Record<string, string | undefined> = {};

    for (const key in errors) {
        if (errors[key]?._errors?.[0]) {
            mapped[key] = errors[key]._errors[0];
        }
    }

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}