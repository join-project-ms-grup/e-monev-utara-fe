import { z } from 'zod';

// =============================
// SCHEMA
// =============================
export const catatanSchema = z.object({
    pendorong: z.string().optional(),
    penghambat: z.string().optional(),
    tl_1: z.string().optional(),
    tl_2: z.string().optional(),
});

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const catatanSchemaSubmit = z
    .object({
        pendorong: z.string().nonempty({ message: 'Field wajib diisi' }),
        penghambat: z.string().nonempty({ message: 'Field wajib diisi' }),
        tl_1: z.string().nonempty({ message: 'Field wajib diisi' }),
        tl_2: z.string().nonempty({ message: 'Field wajib diisi' }),
    })

// =============================
// MAP TO INPUT
// =============================
export function mapToInputCatatan(value: any) {
    return {
        pendorong: value.pendorong?.toString() ?? '',
        penghambat: value.penghambat?.toString() ?? '',
        tl_1: value.tl_1?.toString() ?? '',
        tl_2: value.tl_2?.toString() ?? '',
    };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrorsCatatan(errors: any) {
    const mapped: Record<string, string | undefined> = {
        pendorong: errors.pendorong?._errors?.[0],
        penghambat: errors.penghambat?._errors?.[0],
        tl_1: errors.tl_1?._errors?.[0],
        tl_2: errors.tl_2?._errors?.[0],
    };

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}
