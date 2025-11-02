import React from 'react';

const DetailDak = () => {
  return (
    <div>
      <h3>Detail DAK</h3>

      <div>
        <label htmlFor='paket'>Nama Paket</label>
        <input
          id='paket'
          name='paket'
          type='text'
          placeholder='Nama Paket...'
          maxLength={255}
          required
        />
      </div>

      <div>
        <label htmlFor='detail'>Detail Paket</label>
        <textarea
          id='detail'
          name='detail'
          placeholder='Detail Paket...'
          maxLength={1000}
          required
        />
      </div>

      <div>
        <label>Volume / Satuan</label>
        <div>
          <input
            id='volume'
            name='volume'
            type='text'
            placeholder='Volume...'
            value='0'
            maxLength={12}
            required
          />
          <input
            id='satuan'
            name='satuan'
            type='text'
            placeholder='Satuan...'
            maxLength={30}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor='waktu'>Estimasi Waktu</label>
        <input
          id='waktu'
          name='waktu'
          type='text'
          placeholder='Estimasi Waktu...'
          maxLength={100}
          required
        />
      </div>

      <div>
        <label htmlFor='penerima'>Jumlah Penerima Manfaat</label>
        <input
          id='penerima'
          name='penerima'
          type='text'
          placeholder='Jumlah Penerima Manfaat...'
          maxLength={255}
          required
        />
      </div>

      <div>
        <label htmlFor='anggaran_utama'>Anggaran DAK</label>
        <div>
          <span>Rp.</span>
          <input
            id='anggaran_utama'
            name='anggaran_utama'
            type='text'
            placeholder='Anggaran DAK...'
            value='0'
            maxLength={19}
            required
          />
          <span>,-</span>
        </div>
      </div>

      <div>
        <label>Alamat (Desa / Kelurahan dan Kecamatan)</label>
        <div>
          <input
            id='alm_deskel'
            name='alm_deskel'
            type='text'
            placeholder='Desa / Kelurahan...'
            maxLength={30}
            required
          />
          <input
            id='alm_kec'
            name='alm_kec'
            type='text'
            placeholder='Kecamatan...'
            maxLength={20}
            required
          />
        </div>
      </div>

      <div>
        <label>Bujur</label>
        <div>
          <div>
            <input
              id='bujur1'
              name='bujur1'
              type='text'
              placeholder='Drj...'
              value='0'
              maxLength={6}
              required
            />
            <span>°</span>
          </div>
          <div>
            <input
              id='bujur2'
              name='bujur2'
              type='text'
              placeholder='Mn...'
              value='0'
              maxLength={6}
              required
            />
            <span>'</span>
          </div>
          <div>
            <input
              id='bujur3'
              name='bujur3'
              type='text'
              placeholder='Dt...'
              value='0'
              maxLength={6}
              required
            />
            <span>''</span>
          </div>
        </div>
      </div>

      <div>
        <label>Lintang</label>
        <div>
          <div>
            <input
              id='lintang1'
              name='lintang1'
              type='text'
              placeholder='Drj...'
              value='0'
              maxLength={6}
              required
            />
            <span>°</span>
          </div>
          <div>
            <input
              id='lintang2'
              name='lintang2'
              type='text'
              placeholder='Mn...'
              value='0'
              maxLength={6}
              required
            />
            <span>'</span>
          </div>
          <div>
            <input
              id='lintang3'
              name='lintang3'
              type='text'
              placeholder='Dt...'
              value='0'
              maxLength={6}
              required
            />
            <span>''</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor='img_mod'>Foto Kegiatan</label>
        <div>
          <img
            id='img_mod'
            src='https://monev-dak.bengkuluutarakab.go.id/template/assets/pict/no-image1.png'
            alt='Preview'
            width='200'
            height='116'
          />
          <div>
            <input type='file' name='file_gambar' accept='image/*' required />
          </div>
          <p>
            Maksimal ukuran file <b>10 MB</b> – Format yang diizinkan:{' '}
            <b>jpg, jpeg, png, bmp, gif</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailDak;
