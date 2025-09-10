export interface OrganisasiType {
  id: number;
  tahun: number;
  kode_org: string;
  org: string;
  bidang: string;
  status: 'Aktif' | 'Nonaktif';
}

export const organisasiDummy: OrganisasiType[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  tahun: 2025,
  kode_org: `1.01.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}.0.00.0${Math.floor(Math.random() * 10)}.000${Math.floor(Math.random() * 10)}`,
  org: `Organisasi ${i + 1}`,
  bidang: `Bidang ${['Pendidikan', 'Kesehatan', 'Perhubungan', 'Keuangan', 'Pariwisata'][i % 5]}`,
  status: i % 2 === 0 ? 'Aktif' : 'Nonaktif',
}));

export interface JadwalType {
  id: number;
  tahun: number;
  tipe_tahap: string;
  tahap: string;
  jadwal: string;
  status: 'Selesai' | 'Belum';
}

export const jadwalDummy: JadwalType[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  tahun: 2025,
  tipe_tahap: `${['renstra', 'rpjmd', 'plan'][i % 3]}`,
  tahap: `${['RENSTRA', 'RENSTRA Penyesuaian', 'RPJMD', 'RKPD', 'RKPD Perubahan'][i % 5]}`,
  jadwal: `test`,
  status: i % 2 === 0 ? 'Selesai' : 'Belum',
}));

export interface UrusanType {
  id: number;
  kode_urusan: string;
  urusan: string;
}

export const urusanDummy: UrusanType[] = [
  { id: 1, kode_urusan: "1", urusan: "URUSAN PEMERINTAHAN WAJIB YANG BERKAITAN DENGAN PELAYANAN DASAR" },
  { id: 2, kode_urusan: "2", urusan: "URUSAN PEMERINTAHAN WAJIB YANG TIDAK BERKAITAN DENGAN PELAYANAN DASAR" },
  { id: 3, kode_urusan: "3", urusan: "URUSAN PEMERINTAHAN PILIHAN" },
  { id: 4, kode_urusan: "4", urusan: "UNSUR PENDUKUNG URUSAN PEMERINTAHAN" },
  { id: 5, kode_urusan: "5", urusan: "UNSUR PENUNJANG URUSAN PEMERINTAHAN" },
  { id: 6, kode_urusan: "6", urusan: "UNSUR PENGAWASAN URUSAN PEMERINTAHAN" },
  { id: 7, kode_urusan: "7", urusan: "UNSUR KEWILAYAHAN" },
  { id: 8, kode_urusan: "8", urusan: "UNSUR PEMERINTAHAN UMUM" },
  { id: 9, kode_urusan: "9", urusan: "	UNSUR KEKHUSUSAN DAN KEISTIMEWAAN" },
  { id: 10, kode_urusan: "x", urusan: "NON URUSAN" },
];

export interface BidangType {
  id: number;
  kode_urusan: number;
  kode_bidang: string;
  bidang: string;
}

export const bidangDummy: BidangType[] = [
  { id: 1, kode_urusan: 1, kode_bidang: "1.01", bidang: "URUSAN PEMERINTAHAN BIDANG PENDIDIKAN" },
  { id: 2, kode_urusan: 1, kode_bidang: "1.02", bidang: "URUSAN PEMERINTAHAN BIDANG KESEHATAN" },
  { id: 3, kode_urusan: 1, kode_bidang: "1.03", bidang: "URUSAN PEMERINTAHAN BIDANG PEKERJAAN UMUM DAN PENATAAN RUANG" },
  { id: 4, kode_urusan: 1, kode_bidang: "1.04", bidang: "URUSAN PEMERINTAHAN BIDANG PERUMAHAN DAN KAWASAN PERMUKIMAN" },
  { id: 5, kode_urusan: 1, kode_bidang: "1.05", bidang: "URUSAN PEMERINTAHAN BIDANG KETENTERAMAN DAN KETERTIBAN UMUM SERTA PERLINDUNGAN MASYARAKAT" },
  { id: 6, kode_urusan: 1, kode_bidang: "1.06", bidang: "URUSAN PEMERINTAHAN BIDANG SOSIAL" },
  { id: 7, kode_urusan: 2, kode_bidang: "2.07", bidang: "URUSAN PEMERINTAHAN BIDANG TENAGA KERJA" },
  { id: 8, kode_urusan: 2, kode_bidang: "2.08", bidang: "URUSAN PEMERINTAHAN BIDANG PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK" },
  { id: 9, kode_urusan: 2, kode_bidang: "2.09", bidang: "URUSAN PEMERINTAHAN BIDANG PANGAN" },
  { id: 10, kode_urusan: 2, kode_bidang: "2.10", bidang: "URUSAN PEMERINTAHAN BIDANG PERTANAHAN" },
  { id: 11, kode_urusan: 2, kode_bidang: "2.11", bidang: "URUSAN PEMERINTAHAN BIDANG LINGKUNGAN HIDUP" },
  { id: 12, kode_urusan: 2, kode_bidang: "2.12", bidang: "URUSAN PEMERINTAHAN BIDANG ADMINISTRASI KEPENDUDUKAN DAN PENCATATAN SIPIL" },
  { id: 13, kode_urusan: 2, kode_bidang: "2.13", bidang: "URUSAN PEMERINTAHAN BIDANG PEMBERDAYAAN MASYARAKAT DAN DESA" },
  { id: 14, kode_urusan: 2, kode_bidang: "2.14", bidang: "URUSAN PEMERINTAHAN BIDANG PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA" },
  { id: 15, kode_urusan: 2, kode_bidang: "2.15", bidang: "URUSAN PEMERINTAHAN BIDANG PERHUBUNGAN" },
  { id: 16, kode_urusan: 2, kode_bidang: "2.16", bidang: "URUSAN PEMERINTAHAN BIDANG KOMUNIKASI DAN INFORMATIKA" },
  { id: 17, kode_urusan: 2, kode_bidang: "2.17", bidang: "URUSAN PEMERINTAHAN BIDANG KOPERASI, USAHA KECIL, DAN MENENGAH" },
  { id: 18, kode_urusan: 2, kode_bidang: "2.18", bidang: "URUSAN PEMERINTAHAN BIDANG PENANAMAN MODAL" },
  { id: 19, kode_urusan: 2, kode_bidang: "2.19", bidang: "URUSAN PEMERINTAHAN BIDANG KEPEMUDAAN DAN OLAHRAGA" },
  { id: 20, kode_urusan: 2, kode_bidang: "2.20", bidang: "URUSAN PEMERINTAHAN BIDANG STATISTIK" },
  { id: 21, kode_urusan: 2, kode_bidang: "2.21", bidang: "URUSAN PEMERINTAHAN BIDANG PERSANDIAN" },
  { id: 22, kode_urusan: 2, kode_bidang: "2.22", bidang: "URUSAN PEMERINTAHAN BIDANG KEBUDAYAAN" },
  { id: 23, kode_urusan: 2, kode_bidang: "2.23", bidang: "URUSAN PEMERINTAHAN BIDANG PERPUSTAKAAN" },
  { id: 24, kode_urusan: 2, kode_bidang: "2.24", bidang: "URUSAN PEMERINTAHAN BIDANG KEARSIPAN" },
  { id: 25, kode_urusan: 3, kode_bidang: "3.25", bidang: "URUSAN PEMERINTAHAN BIDANG KELAUTAN  DAN PERIKANAN" },
  { id: 26, kode_urusan: 3, kode_bidang: "3.26", bidang: "URUSAN PEMERINTAHAN BIDANG PARIWISATA" },
  { id: 27, kode_urusan: 3, kode_bidang: "3.27", bidang: "URUSAN PEMERINTAHAN BIDANG PERTANIAN" },
  { id: 28, kode_urusan: 3, kode_bidang: "3.28", bidang: "URUSAN PEMERINTAHAN BIDANG KEHUTANAN" },
  { id: 29, kode_urusan: 3, kode_bidang: "3.29", bidang: "URUSAN PEMERINTAHAN BIDANG ENERGI  DAN SUMBER DAYA MINERAL" },
  { id: 30, kode_urusan: 3, kode_bidang: "3.30", bidang: "URUSAN PEMERINTAHAN BIDANG PERDAGANGAN" },
  { id: 31, kode_urusan: 3, kode_bidang: "3.31", bidang: "URUSAN PEMERINTAHAN BIDANG PERINDUSTRIAN" },
  { id: 32, kode_urusan: 3, kode_bidang: "3.32", bidang: "URUSAN PEMERINTAHAN BIDANG TRANSMIGRASI" },
  { id: 33, kode_urusan: 4, kode_bidang: "4.01", bidang: "SEKRETARIAT DAERAH" },
  { id: 34, kode_urusan: 4, kode_bidang: "4.02", bidang: "SEKRETARIAT DPRD" },
  { id: 35, kode_urusan: 5, kode_bidang: "5.01", bidang: "PERENCANAAN" },
  { id: 36, kode_urusan: 5, kode_bidang: "5.02", bidang: "KEUANGAN" },
  { id: 37, kode_urusan: 5, kode_bidang: "5.03", bidang: "KEPEGAWAIAN" },
  { id: 38, kode_urusan: 5, kode_bidang: "5.04", bidang: "PENDIDIKAN DAN PELATIHAN" },
  { id: 39, kode_urusan: 5, kode_bidang: "5.05", bidang: "PENELITIAN DAN PENGEMBANGAN" },
  { id: 40, kode_urusan: 5, kode_bidang: "5.06", bidang: "PENGELOLAAN PERBATASAN" },
  { id: 41, kode_urusan: 5, kode_bidang: "5.07", bidang: "PENGELOLAAN PENGHUBUNG" },
  { id: 42, kode_urusan: 6, kode_bidang: "6.01", bidang: "INSPEKTORAT DAERAH" },
  { id: 43, kode_urusan: 7, kode_bidang: "7.01", bidang: "KECAMATAN" },
  { id: 44, kode_urusan: 7, kode_bidang: "7.01", bidang: "KECAMATAN ADMINISTRASI" },
  { id: 45, kode_urusan: 7, kode_bidang: "7.02", bidang: "KOTA ADMINISTRASI" },
  { id: 46, kode_urusan: 7, kode_bidang: "7.03", bidang: "KABUPATEN ADMINISTRASI" },
  { id: 47, kode_urusan: 8, kode_bidang: "8.01", bidang: "KESATUAN BANGSA DAN POLITIK" },
  { id: 48, kode_urusan: 9, kode_bidang: "9.01", bidang: "KEKHUSUSAN ACEH" },
  { id: 49, kode_urusan: 9, kode_bidang: "9.02", bidang: "KEKHUSUSAN PAPUA" },
  { id: 50, kode_urusan: 9, kode_bidang: "9.02", bidang: "KEKHUSUSAN PAPUA" },
  { id: 51, kode_urusan: 9, kode_bidang: "9.02", bidang: "KEKHUSUSAN PAPUA" },
  { id: 52, kode_urusan: 9, kode_bidang: "9.02", bidang: "KEKHUSUSAN PAPUA" },
  { id: 53, kode_urusan: 9, kode_bidang: "9.03", bidang: "KEKHUSUSAN PAPUA BARAT" },
  { id: 54, kode_urusan: 9, kode_bidang: "9.03", bidang: "KEKHUSUSAN PAPUA BARAT" },
  { id: 55, kode_urusan: 0, kode_bidang: "X.XX", bidang: "URUSAN PEMERINTAHAN BIDANG XX" }
];
