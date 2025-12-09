import { z } from 'zod';

export const realisasiRKPDSchema = z.object({
    capaian_1: z.string().optional(),
    capaian_2: z.string().optional(),
    capaian_3: z.string().optional(),
    capaian_4: z.string().optional(),
    realisasi_1: z.string().optional(),
    realisasi_2: z.string().optional(),
    realisasi_3: z.string().optional(),
    realisasi_4: z.string().optional(),
});

export const realisasiRKPDSchemaSubmit = z.object({
    capaian_1: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
    capaian_2: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
    capaian_3: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
    capaian_4: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
    realisasi_1: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
    realisasi_2: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
    realisasi_3: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
    realisasi_4: z
        .string()
        .nonempty({ message: 'Field wajib diisi' })
        .regex(/^(0|[1-9]\d*)$/, { message: 'Tidak boleh ada angka 0 di depan' }),
});

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
    return {
        capaian_1: value.capaian_1?.toString() ?? '',
        capaian_2: value.capaian_2?.toString() ?? '',
        capaian_3: value.capaian_3?.toString() ?? '',
        capaian_4: value.capaian_4?.toString() ?? '',
        realisasi_1: value.realisasi_1?.toString() ?? '',
        realisasi_2: value.realisasi_2?.toString() ?? '',
        realisasi_3: value.realisasi_3?.toString() ?? '',
        realisasi_4: value.realisasi_4?.toString() ?? '',
    };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
    const mapped: Record<string, string | undefined> = {
        capaian_1: errors.capaian_1?._errors?.[0],
        capaian_2: errors.capaian_2?._errors?.[0],
        capaian_3: errors.capaian_3?._errors?.[0],
        capaian_4: errors.capaian_4?._errors?.[0],
        realisasi_1: errors.realisasi_1?._errors?.[0],
        realisasi_2: errors.realisasi_2?._errors?.[0],
        realisasi_3: errors.realisasi_3?._errors?.[0],
        realisasi_4: errors.realisasi_4?._errors?.[0],
    };

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}
