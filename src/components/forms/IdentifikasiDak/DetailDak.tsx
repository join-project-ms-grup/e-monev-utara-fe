import InputFile from '../../inputs/InputFile';
import InputText from '../../inputs/InputText';

const DetailDak = () => {
  return (
    <div className='mt-4'>
      <div className='flex items-center justify-center mb-4'>
        <h5>Detail DAK</h5>
      </div>

      <div className='space-y-2'>
        <div>
          <label htmlFor='paket'>Nama Paket</label>
          <InputText id='paket' placeholder='Nama Paket...' />
        </div>

        <div>
          <label htmlFor='detail'>Detail Paket</label>
          <InputText id='detail' placeholder='Detail Paket...' />
        </div>

        <div>
          <label htmlFor='volume'>Volume</label>
          <InputText id='volume' placeholder='Volume...' />
        </div>

        <div>
          <label htmlFor='satuan'>Satuan</label>
          <InputText id='satuan' placeholder='Satuan...' />
        </div>

        <div>
          <label htmlFor='waktu'>Estimasi Waktu</label>
          <InputText id='waktu' placeholder='Estimasi Waktu...' />
        </div>

        <div>
          <label htmlFor='penerima'>Jumlah Penerima Manfaat</label>
          <InputText id='penerima' placeholder='Estimasi Waktu...' />
        </div>

        <div>
          <label htmlFor='anggaran_utama'>Anggaran DAK</label>
          <InputText id='anggaran_utama' placeholder='Anggaran DAK...' />
        </div>

        <div>
          <label htmlFor='alm_deskel'>Desa / Kelurahan</label>
          <InputText id='alm_deskel' placeholder='Desa / Kelurahan...' />
        </div>

        <div>
          <label htmlFor='alm_kec'>Kecamatan</label>
          <InputText id='alm_kec' placeholder='Kecamatan...' />
        </div>

        <div>
          <label htmlFor='bujur'>Bujur</label>
          <div className='grid grid-cols-3 gap-2'>
            <div className='inline-flex'>
              <InputText id='bujur1' placeholder='Drj...' />
              <span>°</span>
            </div>
            <div className='inline-flex'>
              <InputText id='bujur2' placeholder='Mn...' />
              <span>'</span>
            </div>
            <div className='inline-flex'>
              <InputText id='bujur3' placeholder='Dt...' />
              <span>''</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor='lintang'>Lintang</label>
          <div className='grid grid-cols-3 gap-2'>
            <div className='inline-flex'>
              <InputText id='lintang1' placeholder='Drj...' />
              <span>°</span>
            </div>
            <div className='inline-flex'>
              <InputText id='lintang2' placeholder='Mn...' />
              <span>'</span>
            </div>
            <div className='inline-flex'>
              <InputText id='lintang3' placeholder='Dt...' />
              <span>''</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor='img_mod'>Foto Kegiatan</label>
          <InputFile
            id='img_mod'
            Iconlabel='Upload Gambar'
            accept='image/*'
            withButton
            onChange={(e) => console.log(e.target.files?.[0])}
          />
          {/* <div>
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
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default DetailDak;
