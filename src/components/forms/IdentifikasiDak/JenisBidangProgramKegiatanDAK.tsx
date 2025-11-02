import React from 'react';

const JenisBidangProgramKegiatanDAK = () => {
  return (
    <div>
      <h3>Jenis, Bidang, Program & Kegiatan DAK</h3>

      <input type='hidden' name='idak_jenis' value='1' />

      <div>
        <label htmlFor='idak_subjenis'>Sub-Jenis DAK</label>
        <select id='idak_subjenis' name='idak_subjenis' required>
          <option value=''>-- Pilih Sub-Jenis DAK --</option>
          <option value='2'>DAK Penugasan</option>
          <option value='1'>DAK Reguler</option>
        </select>
      </div>

      <div>
        <label htmlFor='idak_bidang'>Bidang DAK</label>
        <select id='idak_bidang' name='idak_bidang' required>
          <option value=''>-- Pilih Bidang DAK --</option>
          <option value='12'>
            Bantuan operasional keluarga berencana (BOKB)
          </option>
        </select>
      </div>

      <div>
        <label htmlFor='idak_subbidang'>Sub-Bidang DAK</label>
        <select id='idak_subbidang' name='idak_subbidang' required>
          <option value=''>-- Tidak Ada Sub-Bidang DAK --</option>
        </select>
      </div>

      <div>
        <label htmlFor='itahun'>Tahun</label>
        <select id='itahun' name='itahun' required>
          <option value='13'>2024</option>
          <option value='14' selected>
            2025
          </option>
        </select>
      </div>

      <div>
        <label htmlFor='idaerah'>Kabupaten / Kota</label>
        <select id='idaerah' name='idaerah' required>
          <option value=''>-- Pilih Kabupaten / Kota --</option>
          <option value='2' selected>
            Kabupaten Bengkulu Utara
          </option>
        </select>
      </div>

      <div>
        <label htmlFor='iskpd'>OPD</label>
        <select id='iskpd' name='iskpd' required>
          <option value=''>-- Pilih OPD --</option>
          <option value='123'>Dinas Kearsipan dan Perpustakaan</option>
        </select>
      </div>

      <div>
        <label htmlFor='bidang_skpd'>Bidang OPD</label>
        <input
          id='bidang_skpd'
          name='bidang_skpd'
          type='text'
          placeholder='Bidang OPD...'
          maxLength={100}
          required
        />
      </div>

      <div>
        <label htmlFor='iurusan'>Urusan</label>
        <select id='iurusan' name='iurusan' required>
          <option value=''>-- Pilih Urusan --</option>
          <option value='all'>[ Semua Urusan ]</option>
          <option value='21'>
            [1] Urusan Pemerintahan Wajib (Pelayanan Dasar)
          </option>
          <option value='22'>
            [2] Urusan Pemerintahan Wajib (Non Pelayanan Dasar)
          </option>
          <option value='23'>[3] Urusan Pemerintahan Pilihan</option>
          <option value='24'>[4] Unsur Pendukung Urusan Pemerintahan</option>
          <option value='25'>[5] Unsur Penunjang Urusan Pemerintahan</option>
          <option value='26'>[6] Unsur Pengawasan Urusan Pemerintahan</option>
          <option value='27'>[7] Unsur Kewilayahan</option>
          <option value='28'>[8] Unsur Pemerintahan Umum</option>
          <option value='30'>[X]</option>
        </select>
      </div>

      <div>
        <label htmlFor='ibidang'>Bidang</label>
        <select id='ibidang' name='ibidang' required>
          <option value=''>-- Tidak Ada Bidang --</option>
        </select>
      </div>
    </div>
  );
};

export default JenisBidangProgramKegiatanDAK;
