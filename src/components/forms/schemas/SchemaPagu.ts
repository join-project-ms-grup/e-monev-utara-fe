import { z } from 'zod';

// =============================
// SCHEMA
// =============================
export const paguSchema = z.object({
  skpd_periode_id: z.string().optional(),
  master_id: z.string().optional(),
  target: z
    .array(
      z.object({
        tahun_ke: z.string().optional(),
        pagu: z.string().optional(),
      })
    )
    .optional(),
});

export const paguSchemaSubmit = z.object({
  skpd_periode_id: z.string().nonempty({ message: 'Field wajib diisi' }),
  master_id: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
  target: z
    .array(
      z.object({
        tahun_ke: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
        pagu: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
      })
    )
    .min(1, { message: 'Minimal satu target harus diisi' }),
});

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
  return {
    skpd_periode_id: value.skpd_periode_id?.toString() ?? '',
    master_id: value.master_id?.toString() ?? '',
    target: Array.from({ length: 5 }, (_, i) => ({
      tahun_ke: value.target?.[i]?.tahun_ke?.toString() ?? '',
      pagu: value.target?.[i]?.pagu?.toString() ?? '',
    })),
  };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
  const mapped: Record<string, string | undefined> = {
    skpd_periode_id: errors.skpd_periode_id?._errors?.[0],
    master_id: errors.master_id?._errors?.[0],
  };

  if (errors.target && typeof errors.target === 'object') {
    Object.entries(errors.target).forEach(([index, item]: [string, any]) => {
      if (!isNaN(Number(index)) && item) {
        const tahun_ke_error = item?.tahun_ke?._errors?.[0];
        const pagu_error = item?.pagu?._errors?.[0];
        const item_error = item?._errors?.[0];

        if (tahun_ke_error)
          mapped[`target[${index}].tahun_ke`] = tahun_ke_error;
        if (pagu_error)
          mapped[`target[${index}].pagu`] = pagu_error;
        if (item_error)
          mapped[`target[${index}]`] = item_error;
      }
    });

    if (Array.isArray(errors.target._errors) && errors.target._errors.length > 0) {
      mapped['target'] = errors.target._errors[0];
    }
  }

  return mapped;
}