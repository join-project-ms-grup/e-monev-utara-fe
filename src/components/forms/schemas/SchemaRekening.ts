import { z } from 'zod';

export const rekeningSchema = z
    .object({
        kode: z
            .string()
            .optional(),
        name: z
            .string()
            .optional(),
        rekening: z
            .string()
            .optional(),
        parent: z
            .string()
            .optional()
    });

export const rekeningSchemaSubmit = z
    .object({
        kode: z.string().nonempty({ message: 'Field wajib diisi' }),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        rekening: z.string().nonempty({ message: 'Field wajib diisi' }),
        parent: z.string().optional(),
    })
    .refine(
        (data) => {
            return data.rekening === 'urusan' || !!data.parent;
        },
        {
            message: 'Bagian harus di isi lengkap',
            path: ['parent'],
        }
    );
