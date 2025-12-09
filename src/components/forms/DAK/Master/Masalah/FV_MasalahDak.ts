import z from "zod";

// =============================
// SCHEMA SUBMIT
// =============================
export const SchemaFormMasalahDak = z
    .object({
        kode_jenis: z.string().nullable().optional(),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        keterangan: z.string().nonempty({ message: 'Field wajib diisi' }),
        id: z.number().nullable().optional(),
        status: z.boolean().nullable().optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.id && !data.kode_jenis) {
            ctx.addIssue({
                path: ['kode_jenis'],
                message: 'Field wajib diisi',
                code: 'custom'
            })
        }
    })


export type MasalahDakForm = z.infer<typeof SchemaFormMasalahDak>;

export const initDAKRekForm: MasalahDakForm = {
    kode_jenis: '',
    name: '',
    keterangan: '',
    id: 0,
    status: true
};

export const useMasalahDakFormData = (data?: MasalahDakForm) => {

    const initialValues: MasalahDakForm = data
        ? {
            ...initDAKRekForm,
            ...data,
            id: data.id,
            kode_jenis: data.kode_jenis ?? ''
        }
        : initDAKRekForm;

    return { initialValues, data };
};