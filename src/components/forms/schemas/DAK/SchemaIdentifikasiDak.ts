import { z } from 'zod';

// =============================
// SCHEMA SUBMIT
// =============================
// Helper validator untuk menolak 0 atau '0'
const nonZero = z.union([z.string(), z.number()]).refine(
    (val) => {
        const num = Number(val);
        return !isNaN(num) && num !== 0;
    },
    { message: 'Field wajib diisi' }
);

export const SchemaFormIdentDAK = z
    .object({
        // non 
        id_ident: z.number().optional(),
        jenis_dak_id: nonZero,
        bidang_dak_id: nonZero,
        urusan_id: nonZero,
        bidang_id: nonZero,
        program_id: nonZero,
        kegiatan_id: nonZero,

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
        bujur: z.any().optional(),
        lintang: z.any().optional(),
        // bujur: z.array(nonZero).length(3),
        // lintang: z.array(nonZero).length(3),
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
            .optional(),
        // .length(12).optional(),
    });