import { z } from 'zod';

// =============================
// SCHEMA
// =============================
export const indikatorSchema = z.object({
  skpd_periode_id: z.string().optional(),
  master_id: z.string().optional(),
  name: z.string().optional(),
  satuan: z.string().optional(),
  target: z
    .array(
      z.object({
        tahun_ke: z.string().optional(),
        target: z.string().optional(),
      })
    )
    .optional(),
});

export const indikatorSchemaSubmit = z.object({
  skpd_periode_id: z.string().nonempty({ message: 'Field wajib diisi' }),
  master_id: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
  name: z.string().nonempty({ message: 'Field wajib diisi' }),
  satuan: z.string().nonempty({ message: 'Field wajib diisi' }),
  target: z
    .array(
      z.object({
        tahun_ke: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
        target: z.string().nonempty({ message: 'Field wajib diisi lengkap' }),
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
    name: value.name?.toString() ?? '',
    satuan: value.satuan?.toString() ?? '',
    target: Array.from({ length: 5 }, (_, i) => ({
      tahun_ke: value.target?.[i]?.tahun_ke?.toString() ?? '',
      target: value.target?.[i]?.target?.toString() ?? '',
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
    name: errors.name?._errors?.[0],
    satuan: errors.satuan?._errors?.[0],
  };

  if (errors.target && typeof errors.target === 'object') {
    Object.entries(errors.target).forEach(([index, item]: [string, any]) => {
      if (!isNaN(Number(index)) && item) {
        const tahun_ke_error = item?.tahun_ke?._errors?.[0];
        const target_error = item?.target?._errors?.[0];
        const item_error = item?._errors?.[0];

        if (tahun_ke_error)
          mapped[`target[${index}].tahun_ke`] = tahun_ke_error;
        if (target_error)
          mapped[`target[${index}].target`] = target_error;
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
