import { z } from 'zod';

// =============================
// SCHEMA (OPSIONAL)
// =============================
export const tahundakSchema = z
    .object({
        tahun: z.string().optional(),
        keterangan: z.string().optional(),
    });

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const tahundakSchemaSubmit = z
    .object({
        tahun: z.string().nonempty({ message: 'Field wajib diisi' }),
        keterangan: z.string().nonempty({ message: 'Field wajib diisi' }),
    });

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
    return {
        tahun: value.kode?.toString() ?? '',
        keterangan: value.name?.toString() ?? '',
    };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
    const mapped: Record<string, string | undefined> = {
        tahun: errors.kode?._errors?.[0],
        keterangan: errors.name?._errors?.[0],
    };

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}
