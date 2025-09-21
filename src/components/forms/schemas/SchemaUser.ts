import { z } from 'zod';

export const userSchema = z
    .object({
        name: z
            .string()
            .optional(),
        fullname: z
            .string()
            .optional(),
        email: z
            .string()
            .optional(),
        role_id: z
            .string()
            .optional(),
        skpd_id: z
            .string()
            .optional(),
        password: z
            .string()
            .optional(),
        passwordConfirm: z
            .string()
            .optional(),
    });

export const userSchemaSubmit = z
    .object({
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        fullname: z.string().nonempty({ message: 'Field wajib diisi' }),
        email: z.string().nonempty({ message: 'Field wajib diisi' }),
        role_id: z.string().nonempty({ message: 'Field wajib diisi' }),
        skpd_id: z.string().nonempty({ message: 'Field wajib diisi' }),
        password: z.string().nonempty({ message: 'Field wajib diisi' }),
        passwordConfirm: z.string().nonempty({ message: 'Field wajib diisi' }),
    });
