import InputSearchBox from '../../inputs/InputSearchBox';
import InputText from '../../inputs/InputText';

const JenisBidangProgramKegiatanDAK = () => {
  return (
    <div>
      <div className='flex items-center mb-4'>
        <h5 className='whitespace-nowrap mr-3'>
          Jenis, Bidang, Program & Kegiatan DAK
        </h5>
        <div className='flex-grow h-px bg-[var(--color-3)]'></div>
      </div>

      <input type='hidden' name='idak_jenis' value='1' />
      <div className='space-y-2'>
        <div className='grid lg:grid-cols-3 gap-2'>
          <div>
            <label htmlFor='subJenisDak'>Sub-Jenis DAK</label>
            <InputSearchBox
              id='subJenisDak'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Sub-Jenis DAK'
            />
          </div>
          <div>
            <label htmlFor='bidangDak'>Bidang DAK</label>
            <InputSearchBox
              id='bidangDak'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Bidang DAK'
            />
          </div>
          <div>
            <label htmlFor='subBidangDak'>Sub-Bidang DAK</label>
            <InputSearchBox
              id='subBidangDak'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Sub-Bidang DAK'
            />
          </div>
        </div>
        {/*  */}
        <div className='grid lg:grid-cols-[1fr_2fr_2fr] gap-2'>
          <div>
            <label htmlFor='tahun'>Tahun</label>
            <InputSearchBox
              id='tahun'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Tahun'
            />
          </div>
          <div>
            <label htmlFor='iskpd'>OPD</label>
            <InputSearchBox
              id='iskpd'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih OPD'
            />
          </div>
          <div>
            <label htmlFor='bidang_skpd'>Bidang OPD</label>
            <InputText id='bidang_skpd' placeholder='Bidang OPD...' />
          </div>
        </div>
        <div className='space-y-2'>
          <div>
            <label htmlFor='urusan'>Urusan</label>
            <InputSearchBox
              id='urusan'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Urusan'
            />
          </div>
          <div>
            <label htmlFor='bidang'>Bidang</label>
            <InputSearchBox
              id='bidang'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Bidang'
            />
          </div>
          <div>
            <label htmlFor='program'>Program</label>
            <InputSearchBox
              id='program'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Program'
            />
          </div>
          <div>
            <label htmlFor='kegiatan'>Kegiatan</label>
            <InputSearchBox
              id='kegiatan'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Kegiatan'
            />
          </div>
          <div>
            <label htmlFor='subKegiatan'>Sub Kegiatan</label>
            <InputSearchBox
              id='subKegiatan'
              className='h-9'
              btnclassName='bg-white'
              options={[]}
              placeholder='Pilih Sub Kegiatan'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JenisBidangProgramKegiatanDAK;
