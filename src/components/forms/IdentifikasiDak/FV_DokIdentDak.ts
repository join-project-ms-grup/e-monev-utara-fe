import z from "zod";

// =============================
// SCHEMA SUBMIT
// =============================
export const SchemaFormDokIdentDak = z
    .object({
        id_dok: z.number().optional(),
        file: z.any().optional(),
        Kesesuaian: z.string().optional(),
        Waktu: z.string().optional(),
        Keterangan: z.string().optional(),
        pesan: z.string().optional(),
    })

export type DokIdentDakForm = z.infer<typeof SchemaFormDokIdentDak>;

export const initDAKDokIdentForm: DokIdentDakForm = {
    id_dok: 0,
    file: null,
    Keterangan: '',
    Kesesuaian: '',
    pesan: '',
    Waktu: '',
};

export const useDokIdentDakFormData = (data?: DokIdentDakForm) => {

    const initialValues: DokIdentDakForm = data
        ? {
            ...initDAKDokIdentForm,
            ...data,
        }
        : initDAKDokIdentForm;

    return { initialValues, data };
};