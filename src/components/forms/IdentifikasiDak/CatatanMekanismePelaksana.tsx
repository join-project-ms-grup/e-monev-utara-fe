import React from 'react';

const CatatanMekanismePelaksana = () => {
  return (
    <div>
      <div>
        <h3>Catatan</h3>
        <div>
          <label htmlFor='catatan'>Catatan</label>
          <textarea
            id='catatan'
            name='catatan'
            placeholder='Catatan...'
            maxLength={1000}
          ></textarea>
        </div>
      </div>
      <div>
        <div>
          <div>Mekanisme Pelaksana</div>
          <div>
            <a href='#'>
              <i></i>
            </a>
          </div>
        </div>

        <div>
          <div>
            <label htmlFor='imekanisme'>Mekanisme</label>
            <div>
              <select id='imekanisme' name='imekanisme' required>
                <option value=''>-- Pilih Mekanisme --</option>
                <option value='Kontrak'>Kontrak</option>
                <option value='Swakelola'>Swakelola</option>
                <option value='eKatalog'>eKatalog</option>
              </select>
              <span>Mekanisme belum dipilih!</span>
            </div>
          </div>

          <div id='meka-group'>
            <div>
              <label htmlFor='imekanisme_vol'>Volume</label>
              <div>
                <input
                  name='imekanisme_vol'
                  type='text'
                  id='imekanisme_vol'
                  placeholder='Volume...'
                  maxLength={19}
                />
              </div>
            </div>

            <div>
              <label htmlFor='imekanisme_rp'>Uang</label>
              <div>
                <div>
                  <span>Rp.</span>
                  <input
                    name='imekanisme_rp'
                    type='text'
                    id='imekanisme_rp'
                    placeholder='Uang...'
                    value='0'
                    maxLength={19}
                  />
                  <span>,-</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor='imetode_pembayaran'>Metode Pembayaran</label>
            <div>
              <input
                name='imetode_pembayaran'
                type='text'
                id='imetode_pembayaran'
                placeholder='Metode Pembayaran...'
                maxLength={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatatanMekanismePelaksana;
