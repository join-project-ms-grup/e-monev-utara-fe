import { z } from 'zod';

// =============================
// SCHEMA
// =============================
export const userSchema = z.object({
    name: z.string().optional(),
    fullname: z.string().optional(),
    email: z.string().optional(),
    role_id: z.string().optional(),
    skpd_id: z.string().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
});

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const userSchemaSubmit = z
    .object({
        name: z
            .string()
            .nonempty({ message: 'Field wajib diisi' })
            .min(3, { message: 'Minimal 3 karakter' })
            .max(30, { message: 'Maksimal 30 karakter' }),
        fullname: z
            .string()
            .nonempty({ message: 'Field wajib diisi' })
            .min(3, { message: 'Minimal 3 karakter' })
            .max(100, { message: 'Maksimal 100 karakter' })
            .regex(/^[A-Za-z\s]+$/, { message: 'Hanya boleh berisi huruf dan spasi' }),
        email: z
            .string()
            .nonempty({ message: 'Field wajib diisi' }),
        role_id: z
            .union([z.string(), z.number()])
            .refine((val) => val !== '' && val !== undefined, { message: 'Field wajib diisi' }),
        skpd_id: z
            .union([z.string(), z.number(), z.null()])
            .refine((val) => val !== '', { message: 'Field wajib diisi' }),
        password: z.string()
            .nonempty({ message: 'Field wajib diisi' })
            .min(6, { message: 'Minimal 6 karakter' }),
        passwordConfirm: z.string()
            .nonempty({ message: 'Field wajib diisi' })
            .min(6, { message: 'Minimal 6 karakter' }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'Konfirmasi password tidak cocok',
        path: ['passwordConfirm'],
    });

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
    return {
        name: value.name?.toString() ?? '',
        fullname: value.fullname?.toString() ?? '',
        email: value.email?.toString() ?? '',
        role_id: value.role_id?.toString() ?? '',
        skpd_id: value.skpd_id?.toString() ?? '',
        password: value.password?.toString() ?? '',
        passwordConfirm: value.passwordConfirm?.toString() ?? '',
    };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
    const mapped: Record<string, string | undefined> = {
        name: errors.name?._errors?.[0],
        fullname: errors.fullname?._errors?.[0],
        email: errors.email?._errors?.[0],
        role_id: errors.role_id?._errors?.[0],
        skpd_id: errors.skpd_id?._errors?.[0],
        password: errors.password?._errors?.[0],
        passwordConfirm: errors.passwordConfirm?._errors?.[0],
    };

    if (errors._errors && errors._errors.length > 0) {
        mapped['form'] = errors._errors[0];
    }

    return mapped;
}
