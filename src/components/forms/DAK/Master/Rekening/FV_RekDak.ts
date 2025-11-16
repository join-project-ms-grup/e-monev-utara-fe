import z from "zod";

// =============================
// SCHEMA SUBMIT
// =============================
// Helper validator untuk menolak 0 atau '0'
// const nonZero = z.union([z.string(), z.number()]).refine(
//     (val) => {
//         const num = Number(val);
//         return !isNaN(num) && num !== 0;
//     },
//     { message: 'Field wajib diisi' }
// );

const hierarchy = [
    // { type: 'urusan', fields: ['idUrusan'] },
    { type: 'bidang', fields: ['idUrusan'] },
    { type: 'program', fields: ['idUrusan', 'idBidang'] },
    { type: 'kegiatan', fields: ['idUrusan', 'idBidang', 'idProgram'] },
    { type: 'subKegiatan', fields: ['idUrusan', 'idBidang', 'idProgram', 'idKegiatan'] },
];

export const SchemaFormRekDak = z
    .object({
        id: z.number().nullable().optional(),
        kode: z.string().nonempty({ message: 'Field wajib diisi' }),
        name: z.string().nonempty({ message: 'Field wajib diisi' }),
        parent_id: z.string().optional(),
        status: z.boolean().nullable().optional(),
        // type: z.string().nonempty({ message: 'Field wajib diisi' }),
        type: z.string().optional(),
        // Selector Rekening
        idUrusan: z.string().optional(),
        idBidang: z.string().optional(),
        idProgram: z.string().optional(),
        idKegiatan: z.string().optional(),
        idSubKegiatan: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (data.id) return;
        if (!data.type) {
            ctx.addIssue({
                code: 'custom',
                path: ['type'],
                message: 'Field wajib diisi',
            });
            return;
        }

        const rule = hierarchy.find(h => h.type === data.type);
        if (!rule) return;

        rule.fields.forEach(f => {
            if (!(data as any)[f]) {
                ctx.addIssue({
                    code: 'custom',
                    path: [f],
                    message: `Field wajib diisi`,
                });
            }
        });
    });


export type RekDakForm = z.infer<typeof SchemaFormRekDak>;

export const initDAKRekForm: RekDakForm = {
    id: 0,
    kode: '',
    name: '',
    parent_id: '',
    status: true,
    type: '',
    // Selector Rekening
    idUrusan: '',
    idBidang: '',
    idProgram: '',
    idKegiatan: '',
    idSubKegiatan: '',
};

export const useRekDakFormData = (data?: RekDakForm) => {

    const initialValues: RekDakForm = data
        ? {
            ...initDAKRekForm,
            ...data,
            id: data.id,
        }
        : initDAKRekForm;

    return { initialValues, data };
};