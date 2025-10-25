import { z } from 'zod';

// =============================
// SCHEMA
// =============================
export const realisasiSchema = z.object({
  id_pagu: z.string().optional(),
  realisasi: z
    .array(
      z.object({
        triwulan: z.string().optional(),
        realisasi: z.string().optional(),
      })
    )
    .optional(),
});

export const realisasiSchemaSubmit = z.object({
  id_pagu: z.string().nonempty({ message: 'id_pagu: Field wajib diisi' }),
  realisasi: z
    .array(
      z.object({
        triwulan: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
        realisasi: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
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
    realisasi: Array.from({ length: 4 }, (_, i) => ({
      triwulan: value.realisasi?.[i]?.triwulan?.toString() ?? '',
      realisasi: value.realisasi?.[i]?.realisasi?.toString() ?? '',
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

  if (errors.realisasi && typeof errors.realisasi === 'object') {
    Object.entries(errors.realisasi).forEach(([index, item]: [string, any]) => {
      if (!isNaN(Number(index)) && item) {
        const triwulan_error = item?.triwulan?._errors?.[0];
        const realisasi_error = item?.realisasi?._errors?.[0];
        const item_error = item?._errors?.[0];

        if (triwulan_error)
          mapped[`realisasi[${index}].tahun_ke`] = triwulan_error;
        if (realisasi_error)
          mapped[`realisasi[${index}].realisasi`] = realisasi_error;
        if (item_error)
          mapped[`realisasi[${index}]`] = item_error;
      }
    });

    if (Array.isArray(errors.target._errors) && errors.target._errors.length > 0) {
      mapped['realisasi'] = errors.target._errors[0];
    }
  }

  return mapped;
}