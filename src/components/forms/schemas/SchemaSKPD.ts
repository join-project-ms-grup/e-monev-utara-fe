import { z } from 'zod';

export const skpdSchema = z
    .object({
        kode: z
            .string()
            .optional(),
        name: z
            .string()
            .optional(),
        shortname: z
            .string()
            .optional()
    });

export const skpdSchemaSubmit = z
    .object({
        kode: z.string().nonempty({ message: 'Field wajib diisi' }),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        shortname: z.string().nonempty({ message: 'Field wajib diisi' }),
    });
