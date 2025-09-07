export interface Organisasi {
  id: number;
  tahun: number;
  kode_org: string;
  org: string;
  bidang: string;
  status: 'Aktif' | 'Nonaktif';
}

export const organisasiDummy: Organisasi[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  tahun: 2025,
  kode_org: `1.01.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}.0.00.0${Math.floor(Math.random() * 10)}.000${Math.floor(Math.random() * 10)}`,
  org: `Organisasi ${i + 1}`,
  bidang: `Bidang ${['Pendidikan', 'Kesehatan', 'Perhubungan', 'Keuangan', 'Pariwisata'][i % 5]}`,
  status: i % 2 === 0 ? 'Aktif' : 'Nonaktif',
}));