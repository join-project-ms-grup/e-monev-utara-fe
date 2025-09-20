import { z } from 'zod';

export const periodeSchema = z
  .object({
    mulai: z
      .string()
      .optional()
      .refine((val) => !val || val.length === 4, { message: 'Harus 4 digit' })
      .refine((val) => !val || !val.startsWith('0'), {
        message: 'Tidak boleh diawali angka 0',
      }),
    akhir: z
      .string()
      .optional()
      .refine((val) => !val || val.length === 4, { message: 'Harus 4 digit' })
      .refine((val) => !val || !val.startsWith('0'), {
        message: 'Tidak boleh diawali angka 0',
      }),
  })
  .refine(
    (data) => {
      if (!data.mulai || !data.akhir) return true;
      return data.mulai <= data.akhir;
    },
    {
      message: 'Tidak boleh lebih dari tahun akhir',
      path: ['mulai'],
    },
  )
  .refine(
    (data) => {
      if (!data.mulai || !data.akhir) return true;
      return data.akhir >= data.mulai;
    },
    {
      message: 'Tidak boleh kurang dari tahun mulai',
      path: ['akhir'],
    },
  );

export const periodeSchemaSubmit = z
  .object({
    mulai: z.string().nonempty({ message: 'Tahun mulai wajib diisi' }),
    akhir: z.string().nonempty({ message: 'Tahun akhir wajib diisi' }),
  });
