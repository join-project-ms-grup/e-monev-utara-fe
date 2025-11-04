import { z } from 'zod';

// =============================
// SCHEMA (OPSIONAL)
// =============================
export const periodeSchema = z
  .object({
    mulai: z
      .union([z.string(), z.number()])
      .optional()
      .refine((val) => !val || /^\d{4}$/.test(String(val)), {
        message: 'Tahun harus 4 digit',
      })
      .refine((val) => !val || !String(val).startsWith('0'), {
        message: 'Tidak boleh diawali angka 0',
      })
      .refine(
        (val) =>
          !val ||
          (Number(val) >= 1900 && Number(val) <= 2100),
        { message: 'Tahun harus antara 1900–2100' },
      ),
    akhir: z
      .union([z.string(), z.number()])
      .optional()
      .refine((val) => !val || /^\d{4}$/.test(String(val)), {
        message: 'Tahun harus 4 digit',
      })
      .refine((val) => !val || !String(val).startsWith('0'), {
        message: 'Tidak boleh diawali angka 0',
      })
      .refine(
        (val) =>
          !val ||
          (Number(val) >= 1900 && Number(val) <= 2100),
        { message: 'Tahun harus antara 1900–2100' },
      ),
  })
  .refine(
    (data) => {
      if (!data.mulai || !data.akhir) return true;
      return Number(data.mulai) <= Number(data.akhir);
    },
    { message: 'Tidak boleh lebih dari tahun akhir', path: ['mulai'] },
  )
  .refine(
    (data) => {
      if (!data.mulai || !data.akhir) return true;
      return Number(data.akhir) >= Number(data.mulai);
    },
    { message: 'Tidak boleh kurang dari tahun mulai', path: ['akhir'] },
  );

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const periodeSchemaSubmit = z
  .object({
    mulai: z
      .union([z.string(), z.number()])
      .refine((val) => val !== '' && val !== undefined, {
        message: 'Field wajib diisi',
      })
      .refine((val) => /^\d{4}$/.test(String(val)), {
        message: 'Tahun harus 4 digit',
      })
      .refine((val) => !String(val).startsWith('0'), {
        message: 'Tidak boleh diawali angka 0',
      })
      .refine(
        (val) => Number(val) >= 1900 && Number(val) <= 2100,
        { message: 'Tahun harus antara 1900–2100' },
      ),
    akhir: z
      .union([z.string(), z.number()])
      .refine((val) => val !== '' && val !== undefined, {
        message: 'Field wajib diisi',
      })
      .refine((val) => /^\d{4}$/.test(String(val)), {
        message: 'Tahun harus 4 digit',
      })
      .refine((val) => !String(val).startsWith('0'), {
        message: 'Tidak boleh diawali angka 0',
      })
      .refine(
        (val) => Number(val) >= 1900 && Number(val) <= 2100,
        { message: 'Tahun harus antara 1900–2100' },
      ),
  })
  .refine(
    (data) => Number(data.mulai) <= Number(data.akhir),
    { message: 'Tidak boleh lebih dari tahun akhir', path: ['mulai'] },
  )
  .refine(
    (data) => Number(data.akhir) >= Number(data.mulai),
    { message: 'Tidak boleh kurang dari tahun mulai', path: ['akhir'] },
  );

// =============================
// MAP TO INPUT
// =============================
export function mapToInput(value: any) {
  return {
    mulai: value.mulai?.toString() ?? '',
    akhir: value.akhir?.toString() ?? '',
  };
}

// =============================
// MAP ERRORS
// =============================
export function mapErrors(errors: any) {
  const mapped: Record<string, string | undefined> = {
    mulai: errors.mulai?._errors?.[0],
    akhir: errors.akhir?._errors?.[0],
  };

  if (errors._errors && errors._errors.length > 0) {
    mapped['form'] = errors._errors[0];
  }

  return mapped;
}
