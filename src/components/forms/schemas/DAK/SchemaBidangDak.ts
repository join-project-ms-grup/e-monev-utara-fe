import { z } from 'zod';

// =============================
// SCHEMA (OPSIONAL)
// =============================
export const bidangdakSchema = z
    .object({
        type: z.string(),
        name: z.string().optional(),
        keterangan: z.string().optional(),
    });

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const bidangdakSchemaSubmit = z
    .object({
        type: z.string(),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        keterangan: z.string().nonempty({ message: 'Field wajib diisi' }),
        id_bidang: z.number().optional(),
    })
    .superRefine((data, ctx) => {
        console.log('Data masuk superRefine:', data);
        if (data.type === 'sub' && (!data.id_bidang)) {
            console.log('id_bidang wajib tapi kosong!');
            ctx.addIssue({
                path: ['id_bidang'],
                message: 'Field wajib diisi',
                code: 'custom',
            });
        }
    });

// =============================
// MAP TO INPUT
// =============================
export function mapToInputBidangDak(value: any) {
    const base: any = {
        name: value.name?.toString() ?? '',
        keterangan: value.keterangan?.toString() ?? '',
        type: value.type ?? '',
    };

    // Jangan ubah id_bidang menjadi string kosong, biarkan undefined jika tidak ada
    if (value.type === 'sub') {
        base.id_bidang = value.id_bidang ?? undefined;
    }

    return base;
}

// =============================
// MAP ERRORS
// =============================
export function mapErrorsBidangDak(errors: any) {
    const mapped: Record<string, string | undefined> = {
        name: errors.name?._errors?.[0],
        keterangan: errors.keterangan?._errors?.[0],
        id_bidang: errors.id_bidang?._errors?.[0],
    };

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}
