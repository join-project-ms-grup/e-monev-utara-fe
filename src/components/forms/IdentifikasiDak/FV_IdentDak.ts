import { useQuery } from '@tanstack/react-query';
import z from "zod";
import { getIdentifikasiDetailDAK } from '../../../services/DAK/DAKIdentifikasiService';


const nonZero = z.union([z.string(), z.number()]).refine(
  (val) => {
    const num = Number(val);
    return !isNaN(num) && num !== 0;
  },
  { message: 'Field wajib diisi' }
);

// FS (FORM Schema)
export const SchemaFormIdentDAK = z
  .object({
    // non 
    id_ident: z.number().optional(),
    jenis_dak_id: nonZero,
    bidang_dak_id: nonZero,
    urusan_id: nonZero,
    bidang_id: nonZero,
    program_id: nonZero,
    kegiatan_id: nonZero,

    // payload
    sub_jenis_id: nonZero,
    sub_bidang_id: nonZero,
    tahun: nonZero,
    opd_id: nonZero,
    bidang_opd: z.string().nonempty({ message: 'Field wajib diisi' }),
    sub_kegiatan_id: nonZero,
    // detail
    nama_paket: z.string().nonempty({ message: 'Field wajib diisi' }),
    detail_paket: z.string().nonempty({ message: 'Field wajib diisi' }),
    volume: nonZero,
    satuan: z.string().nonempty({ message: 'Field wajib diisi' }),
    estimasi: z.string().nonempty({ message: 'Field wajib diisi' }),
    jumlah_penerima: z.union([z.string().nonempty({ message: 'Field wajib diisi' }), z.number()]).optional(),
    anggaran: nonZero,
    des_kel: z.string().nonempty({ message: 'Field wajib diisi' }),
    kec: z.string().nonempty({ message: 'Field wajib diisi' }),
    bujur: z.any().optional(),
    lintang: z.any().optional(),
    foto: z.any().nullable(),
    // mekanisme
    mekanisme: z.enum(['swakelola', 'kontrak', 'ekatalog']),
    catatan: z.string().nonempty({ message: 'Field wajib diisi' }),
    metode: z.string().nonempty({ message: 'Field wajib diisi' }),
    volume_mekanisme: nonZero,
    uang_mekanisme: nonZero,
    // dokumen
    dokumen: z
      .array(
        z.object({
          id_berkas: nonZero,
          file: z.any().nullable(),
          Waktu: z.string().nullable(),
          Keterangan: z.string().nullable(),
        })
      )
      .optional(),
  });

type IdentForm = z.infer<typeof SchemaFormIdentDAK>;

// FV (FORM VALUE)
export const initIdentDAKForm: IdentForm = {
  // non payload
  id_ident: 0,
  jenis_dak_id: 0,
  bidang_dak_id: 0,
  urusan_id: 0,
  bidang_id: 0,
  program_id: 0,
  kegiatan_id: 0,
  // payload
  sub_jenis_id: 0,
  sub_bidang_id: 0,
  tahun: 0,
  opd_id: 0,
  bidang_opd: '',
  sub_kegiatan_id: 0,
  catatan: '',
  nama_paket: '',
  detail_paket: '',
  volume: 0,
  satuan: '',
  estimasi: '',
  jumlah_penerima: '',
  anggaran: 0,
  des_kel: '',
  kec: '',
  bujur: ['0', '0', '0'],
  lintang: ['0', '0', '0'],
  foto: null,
  mekanisme: 'swakelola',
  metode: '',
  volume_mekanisme: 0,
  uang_mekanisme: 0,
  dokumen: Array.from({ length: 12 }, (_, i) => ({
    id_berkas: i + 1,
    file: null,
    Waktu: null,
    Keterangan: null,
  })),
};

type MekanismeEnum = 'swakelola' | 'kontrak' | 'ekatalog';

export const useIdentDAKFormData = (id_ident?: number) => {
  const { data, ...query } = useQuery({
    queryKey: ['detail_identifikasi_dak', id_ident],
    queryFn: () => getIdentifikasiDetailDAK(Number(id_ident)),
    enabled: !!id_ident,
  });

  const mekanismeValue: MekanismeEnum =
    data?.mekanisme === 'swakelola'
      ? 'swakelola'
      : data?.mekanisme === 'kontrak'
        ? 'kontrak'
        : data?.mekanisme === 'ekatalog' ? 'ekatalog' : 'swakelola';

  const initialValues: IdentForm = data
    ? {
      ...initIdentDAKForm,
      ...data,
      id_ident: id_ident,
      sub_jenis_id: data.sub_jenis_dak_id,
      sub_kegiatan_id: data.subKegiatan_id,
      sub_bidang_id: data.sub_bidang_dak_id,
      estimasi: data.estimasi_waktu,
      jumlah_penerima: data.jumlah_penerima_manfaat,
      anggaran: data.anggaran_dak,
      uang_mekanisme: data.mekanisme_uang,
      volume_mekanisme: data.mekanisme_volume,
      metode: data.metode_pembayaran,
      des_kel: data.desa_kel,
      catatan: data.catatan ?? '',
      mekanisme: mekanismeValue,
      bujur: data.bujur
        ? (typeof data.bujur === 'string' ? JSON.parse(data.bujur) : data.bujur)
        : ['0', '0', '0'],
      lintang: data.lintang
        ? (typeof data.lintang === 'string' ? JSON.parse(data.lintang) : data.lintang)
        : ['0', '0', '0'],
      dokumen: data.dokumen
        ? data.dokumen.map((d, i) => ({
          id_berkas: d.id_berkas ?? i + 1,
          file: d.file ?? null,
          Waktu: d.Waktu ?? null,
          Keterangan: d.Keterangan ?? null,
        }))
        : Array.from({ length: 12 }, (_, i) => ({
          id_berkas: i + 1,
          file: null,
          Waktu: null,
          Keterangan: null,
        })),
    }
    : initIdentDAKForm;

  return { initialValues, query, data };
};