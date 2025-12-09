import z from "zod";

// =============================
// SCHEMA SUBMIT
// =============================
export const SchemaFormMonitorMasalahDak = z
    .object({
        file_masalah: z.string().optional(),
        masalah: z.string().optional(),
        masalah_lain: z.string().optional(),
        id_realisasi: z.number().nullable().optional(),
    })
// .superRefine((data, ctx) => {
//     if (!data.id && !data.kode_jenis) {
//         ctx.addIssue({
//             path: ['kode_jenis'],
//             message: 'Field wajib diisi',
//             code: 'custom'
//         })
//     }
// })


export type MonitorMasalahDakForm = z.infer<typeof SchemaFormMonitorMasalahDak>;

export const initDAKRekForm: MonitorMasalahDakForm = {
    file_masalah: '',
    masalah: '',
    masalah_lain: '',
    id_realisasi: 0,
};

export const useMonitorMasalahDakFormData = (data?: MonitorMasalahDakForm) => {

    const initialValues: MonitorMasalahDakForm = data
        ? {
            ...initDAKRekForm,
            ...data,
        }
        : initDAKRekForm;

    return { initialValues, data };
};