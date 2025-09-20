import { z } from 'zod';

export const roleSchema = z
    .object({
        kode: z
            .string()
            .optional(),
        name: z
            .string()
            .optional()
    });

export const roleSchemaSubmit = z
    .object({
        kode: z.string().nonempty({ message: 'Field wajib diisi' }),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
    });
