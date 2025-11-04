import InputTextArea from '../../inputs/InputTextArea';
import InputSearchBox from '../../inputs/InputSearchBox';
import InputText from '../../inputs/InputText';

const CatatanMekanismePelaksana = () => {
  return (
    <div>
      <div className='flex items-center mb-4'>
        <h5 className='whitespace-nowrap mr-3'>
          Catatan & Mekanisme Pelaksanaan
        </h5>
        <div className='flex-grow h-px bg-[var(--color-3)]'></div>
      </div>

      <div className='space-y-2'>
        <div>
          <label htmlFor='catatan'>Catatan</label>
          <InputTextArea id='catatan' placeholder='Catatan...' />
        </div>
        <div>
          <label htmlFor='imekanisme'>Mekanisme</label>
          <InputSearchBox
            id='imekanisme'
            placeholder='Pilih Mekanisme'
            options={[
              { label: 'Kontrak', value: 'kontrak' },
              { label: 'Swakelola', value: 'swakelola' },
              { label: 'eKatalog', value: 'ekatalog' },
            ]}
          />
        </div>
        <div>
          <label htmlFor='imekanisme_vol'>Volume</label>
          <InputText id='imekanisme_vol' placeholder='Volume...' />
        </div>
        <div>
          <label htmlFor='imekanisme_rp'>Uang</label>
          <InputText
            id='imekanisme_rp'
            inputMode='numeric'
            isRibu
            placeholder='Uang...'
          />
        </div>
        <div>
          <label htmlFor='imetode_pembayaran'>Metode Pembayaran</label>
          <InputText
            id='imetode_pembayaran'
            placeholder='Metode pembayaran...'
          />
        </div>
      </div>
    </div>
  );
};

export default CatatanMekanismePelaksana;
