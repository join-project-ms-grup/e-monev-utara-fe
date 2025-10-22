import { z } from 'zod';

export const paguSchema = z
    .object({
        skpd_periode_id: z
            .string()
            .optional(),
        master_id: z
            .string()
            .optional(),
        target: z.object({
            pagu: z
                .string()
                .optional(),
            tahun_ke: z
                .string()
                .optional(),
        })
    });

export const paguSchemaSubmit = z
    .object({
        skpd_periode_id: z.string().nonempty({ message: 'Field wajib diisi' }),
        master_id: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
        target: z.object({
            pagu: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
            tahun_ke: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
        })
    })
    .refine(
        (data) => {
            return !!data.master_id;
        },
        {
            message: 'Bagian harus di isi lengkap',
            path: ['master_id'],
        }
    );
