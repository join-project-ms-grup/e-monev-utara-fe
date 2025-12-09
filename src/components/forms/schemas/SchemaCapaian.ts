import { z } from 'zod';

// =============================
// SCHEMA
// =============================
export const capaianSchema = z.object({
  id_pagu: z.string().optional(),
  capaian: z
    .array(
      z.object({
        triwulan: z.string().optional(),
        capaian: z.string().optional(),
      })
    )
    .optional(),
});

export const capaianSchemaSubmit = z.object({
  id_pagu: z.string().nonempty({ message: 'id_pagu: Field wajib diisi' }),
  capaian: z
    .array(
      z.object({
        triwulan: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
        capaian: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
      })
    )
    .min(1, { message: 'Minimal satu target harus diisi' }),
});

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
  return {
    id_pagu: value.id_pagu?.toString() ?? '',
    capaian: Array.from({ length: 4 }, (_, i) => ({
      triwulan: value.capaian?.[i]?.triwulan?.toString() ?? '',
      capaian: value.capaian?.[i]?.capaian?.toString() ?? '',
    })),
  };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
  const mapped: Record<string, string | undefined> = {
    id_pagu: errors.id_pagu?._errors?.[0],
  };

  if (errors.capaian && typeof errors.capaian === 'object') {
    Object.entries(errors.capaian).forEach(([index, item]: [string, any]) => {
      if (!isNaN(Number(index)) && item) {
        const triwulan_error = item?.triwulan?._errors?.[0];
        const capaian_error = item?.capaian?._errors?.[0];
        const item_error = item?._errors?.[0];

        if (triwulan_error)
          mapped[`capaian[${index}].tahun_ke`] = triwulan_error;
        if (capaian_error)
          mapped[`capaian[${index}].capaian`] = capaian_error;
        if (item_error)
          mapped[`capaian[${index}]`] = item_error;
      }
    });

    if (Array.isArray(errors.target._errors) && errors.target._errors.length > 0) {
      mapped['capaian'] = errors.target._errors[0];
    }
  }

  return mapped;
}