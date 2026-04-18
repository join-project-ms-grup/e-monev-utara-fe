import z from 'zod';

// =============================
// SCHEMA SUBMIT
// =============================
const normalizeBoolean = (val: unknown) => {
  if (val === '' || val === null || val === undefined) {
    return undefined;
  }

  if (val === true || val === 'true' || val === '1' || val === 1) return true;
  if (val === false || val === 'false' || val === '0' || val === 0)
    return false;

  return undefined;
};

export const SchemaFormRealisasiDak = z.object({
  id_realisasi: z.number().nullable().optional(),
  fisik: z.string().nonempty({ message: 'Field wajib diisi' }),
  anggaran: z.string().nonempty({ message: 'Field wajib diisi' }),
  sasaran_lokasi: z.preprocess(
    normalizeBoolean,
    z.boolean({ message: 'Field wajib diisi' }),
  ),

  kesesuaian_juknis: z.preprocess(
    normalizeBoolean,
    z.boolean({ message: 'Field wajib diisi' }),
  ),
  catatan: z.string().optional(),
});
// .superRefine((data, ctx) => {
//     if (!data.id && !data.kode_jenis) {
//         ctx.addIssue({
//             path: ['kode_jenis'],
//             message: 'Field wajib diisi',
//             code: 'custom'
//         })
//     }
// })

export type RealisasiDakForm = z.infer<typeof SchemaFormRealisasiDak>;

export const initDAKRekForm: RealisasiDakForm = {
  id_realisasi: 0,
  fisik: '',
  anggaran: '',
  sasaran_lokasi: false,
  kesesuaian_juknis: false,
  catatan: '',
};

export const useRealisasiDakFormData = (data?: RealisasiDakForm) => {
  const initialValues: RealisasiDakForm = data
    ? {
        ...initDAKRekForm,
        ...data,
      }
    : initDAKRekForm;

  return { initialValues, data };
};
