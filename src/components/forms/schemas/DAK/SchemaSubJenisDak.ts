import { z } from 'zod';

// =============================
// SCHEMA (OPSIONAL)
// =============================
export const subjenisdakSchema = z
    .object({
        nama: z.string().optional(),
        keterangan: z.string().optional(),
    });

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const subjenisdakSchemaSubmit = z
    .object({
        nama: z.string().nonempty({ message: 'Field wajib diisi' }),
        keterangan: z.string().nonempty({ message: 'Field wajib diisi' }),
    });

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
    return {
        nama: value.nama?.toString() ?? '',
        keterangan: value.keterangan?.toString() ?? '',
    };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
    const mapped: Record<string, string | undefined> = {
        nama: errors.nama?._errors?.[0],
        keterangan: errors.keterangan?._errors?.[0],
    };

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}
