import { z } from 'zod';

// =============================
// SCHEMA (OPSIONAL)
// =============================
export const skpdSchema = z
    .object({
        kode: z.string().optional(),
        name: z.string().optional(),
        shortname: z.string().optional()
    });

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const skpdSchemaSubmit = z
    .object({
        kode: z.string().nonempty({ message: 'Field wajib diisi' }),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        shortname: z.string().nonempty({ message: 'Field wajib diisi' }),
    });

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
    return {
        kode: value.kode?.toString() ?? '',
        name: value.name?.toString() ?? '',
        shortname: value.shortname?.toString() ?? ''
    };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
    const mapped: Record<string, string | undefined> = {
        kode: errors.kode?._errors?.[0],
        name: errors.name?._errors?.[0],
        shortname: errors.shortname?._errors?.[0]
    };

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}
