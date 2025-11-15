import { useQuery } from '@tanstack/react-query';
import type z from "zod";
import type { SchemaFormIdentDAK } from "../schemas/DAK/SchemaIdentifikasiDak";
import { getIdentifikasiDetailDAK } from '../../../services/DAK/DAKIdentifikasiService';

type IdentForm = z.infer<typeof SchemaFormIdentDAK>;

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


// import type z from "zod";
// import type { SchemaFormIdentDAK } from "../schemas/DAK/SchemTest";

// type IdentForm = z.infer<typeof SchemaFormIdentDAK>;

// export const initIdentDAKForm: IdentForm = {
//   // non payload
//   jenis_dak_id: '',
//   bidang_dak_id: '',
//   urusan_id: '',
//   bidang_id: '',
//   program_id: '',
//   kegiatan_id: '',
//   // payload
//   sub_jenis_id: 0,
//   sub_bidang_id: 0,
//   tahun: 0,
//   opd_id: 0,
//   bidang_opd: '',
//   sub_kegiatan_id: 0,
//   catatan: '',
//   nama_paket: '',
//   detail_paket: '',
//   volume: 0,
//   satuan: '',
//   estimasi: '',
//   jumlah_penerima: '',
//   anggaran: 0,
//   des_kel: '',
//   kec: '',
//   bujur: ['0', '0', '0'],
//   lintang: ['0', '0', '0'],
//   foto: null,
//   mekanisme: 'swakelola',
//   metode: '',
//   volume_mekanisme: 0,
//   uang_mekanisme: 0,
//   dokumen: Array.from({ length: 12 }, (_, i) => ({
//     id_berkas: i + 1,
//     file: null,
//     Waktu: null,
//     Keterangan: null,
//   })),
// };