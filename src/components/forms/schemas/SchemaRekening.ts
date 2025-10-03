import { z } from 'zod';

export const rekeningSchema = z
    .object({
        kode: z
            .string()
            .optional(),
        name: z
            .string()
            .optional(),
        type: z
            .string()
            .optional()
    });

export const rekeningSchemaSubmit = z
    .object({
        kode: z.string().nonempty({ message: 'Field wajib diisi' }),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        type: z.string().nonempty({ message: 'Field wajib diisi' }),
    });
