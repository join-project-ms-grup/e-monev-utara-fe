import InputText from '../../inputs/InputText';
import ErrorField from '../ErrorField';
import InputTextArea from '../../inputs/InputTextArea';
import InputFile from '../../inputs/InputFile';

const FormIdentDetailDak = ({
  form,
}: {
  form: any;
}) => {
  return (
    <>
      {/* MARK: DETAIL DAK */}
      <div className='max-w-4xl mx-auto '>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
          <h5 className='whitespace-nowrap mx-3'>Detail DAK</h5>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
        </div>

        <div className='space-y-2'>
          {/* MARK: NAMA PAKET */}
          <form.Field name='nama_paket'>
            {(field: any) => (
              <div>
                <label htmlFor='nama_paket'>
                  Nama Paket{' '}
                  <code className='text-red-500 text-xs align-text-top'>
                    (*)
                  </code>
                </label>
                <InputText
                  id='nama_paket'
                  placeholder='Nama Paket...'
                  value={field.state.value.toString()}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onClear={() => field.handleChange('')}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* MARK: DETAIL PAKET */}
          <form.Field name='detail_paket'>
            {(field: any) => (
              <div>
                <label htmlFor='detail_paket'>
                  Detail Paket{' '}
                  <code className='text-red-500 text-xs align-text-top'>
                    (*)
                  </code>
                </label>
                <InputTextArea
                  id='detail_paket'
                  placeholder='Detail Paket...'
                  value={field.state.value.toString()}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onClear={() => field.handleChange('')}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          <div className='grid grid-cols-3 gap-2'>
            {/* MARK: VOLUME */}
            <form.Field name='volume'>
              {(field: any) => (
                <div>
                  <label htmlFor='volume'>
                    Volume{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='volume'
                    placeholder='Volume...'
                    isRibu
                    inputMode='numeric'
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onClear={() => field.handleChange(0)}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>

            {/* MARK: SATUAN */}
            <form.Field name='satuan'>
              {(field: any) => (
                <div>
                  <label htmlFor='satuan'>
                    Satuan{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='satuan'
                    placeholder='Satuan...'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onClear={() => field.handleChange('')}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>

            {/* MARK: ESTIMASI */}
            <form.Field name='estimasi'>
              {(field: any) => (
                <div>
                  <label htmlFor='waktu'>
                    Estimasi Waktu{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='waktu'
                    placeholder='Estimasi Waktu...'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onClear={() => field.handleChange('')}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>
          <div className='grid grid-cols-[1fr_2fr] gap-2'>
            {/* MARK: JUMLAH PENERIMA MANFAAT */}
            <form.Field name='jumlah_penerima'>
              {(field: any) => (
                <div>
                  <label htmlFor='penerima'>
                    Jumlah Penerima Manfaat{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='penerima'
                    placeholder='Jumlah Penerima Manfaat...'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onClear={() => field.handleChange('')}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* MARK: ANGGARAN */}
            <form.Field name='anggaran'>
              {(field: any) => (
                <div>
                  <label htmlFor='anggaran'>
                    Anggaran DAK{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='anggaran'
                    placeholder='Anggaran DAK...'
                    Iconlabel='Rp.'
                    isRibu
                    inputMode='numeric'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onClear={() => field.handleChange(0)}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>

          {/* MARK: DESA KELURAHAN */}
          <form.Field name='des_kel'>
            {(field: any) => (
              <div>
                <label htmlFor='des_kel'>
                  Desa / Kelurahan{' '}
                  <code className='text-red-500 text-xs align-text-top'>
                    (*)
                  </code>
                </label>
                <InputText
                  id='des_kel'
                  placeholder='Desa / Kelurahan...'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onClear={() => field.handleChange('')}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>

          {/* MARK: KECAMATAN */}
          <form.Field name='kec'>
            {(field: any) => (
              <div>
                <label htmlFor='kec'>
                  Kecamatan{' '}
                  <code className='text-red-500 text-xs align-text-top'>
                    (*)
                  </code>
                </label>
                <InputText
                  id='kec'
                  placeholder='Kecamatan...'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onClear={() => field.handleChange('')}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>

          {/* MARK: BUJUR */}
          <form.Field name='bujur'>
            {(field: any) => {
              const value = field.state.value || [0, 0, 0];
              const handleChange = (index: number, val: string) => {
                const newValue = [...value];
                newValue[index] = val;
                field.handleChange(newValue);
              };

              return (
                <div>
                  <label htmlFor='bujur'>Bujur</label>
                  <div className='grid grid-cols-3 gap-2'>
                    <div className='inline-flex'>
                      <InputText
                        id='bujur[0]'
                        placeholder='Drj...'
                        Iconlabel='°'
                        IconlabelPos='right'
                        inputMode='numeric'
                        value={value[0]}
                        onChange={(e) => handleChange(0, e.target.value)}
                        onClear={() => handleChange(0, '0')}
                        invalid={!field.state.meta.isValid}
                      />
                    </div>
                    <div className='inline-flex'>
                      <InputText
                        id='bujur[1]'
                        placeholder='Mn...'
                        Iconlabel="'"
                        IconlabelPos='right'
                        inputMode='numeric'
                        value={value[1]}
                        onChange={(e) => handleChange(1, e.target.value)}
                        onClear={() => handleChange(1, '0')}
                        invalid={!field.state.meta.isValid}
                      />
                    </div>
                    <div className='inline-flex'>
                      <InputText
                        id='bujur[2]'
                        placeholder='Dt...'
                        Iconlabel="''"
                        IconlabelPos='right'
                        inputMode='numeric'
                        value={value[2]}
                        onChange={(e) => handleChange(2, e.target.value)}
                        onClear={() => handleChange(2, '0')}
                        invalid={!field.state.meta.isValid}
                      />
                    </div>
                  </div>
                  <ErrorField field={field} />
                </div>
              );
            }}
          </form.Field>

          {/* MARK: LINTANG */}
          <form.Field name='lintang'>
            {(field: any) => {
              const value = field.state.value || [0, 0, 0];
              const handleChange = (index: number, val: string) => {
                const newValue = [...value];
                newValue[index] = val;
                field.handleChange(newValue);
              };

              return (
                <div>
                  <label htmlFor='lintang'>Lintang</label>
                  <div className='grid grid-cols-3 gap-2'>
                    <div className='inline-flex'>
                      <InputText
                        id='lintang1'
                        placeholder='Drj...'
                        Iconlabel={`°`}
                        IconlabelPos='right'
                        inputMode='numeric'
                        value={value[0]}
                        onChange={(e) => handleChange(0, e.target.value)}
                        onClear={() => handleChange(0, '0')}
                        invalid={!field.state.meta.isValid}
                      />
                    </div>
                    <div className='inline-flex'>
                      <InputText
                        id='lintang2'
                        placeholder='Mn...'
                        Iconlabel={`'`}
                        IconlabelPos='right'
                        value={value[1]}
                        onChange={(e) => handleChange(1, e.target.value)}
                        onClear={() => handleChange(1, '0')}
                        invalid={!field.state.meta.isValid}
                      />
                    </div>
                    <div className='inline-flex'>
                      <InputText
                        id='lintang3'
                        placeholder='Dt...'
                        Iconlabel={`''`}
                        IconlabelPos='right'
                        inputMode='numeric'
                        value={value[2]}
                        onChange={(e) => handleChange(2, e.target.value)}
                        onClear={() => handleChange(2, '0')}
                        invalid={!field.state.meta.isValid}
                      />
                    </div>
                  </div>
                  <ErrorField field={field} />
                </div>
              );
            }}
          </form.Field>

          {/* MARK: FOTO KEGIATAN */}
          <form.Field name='foto'>
            {(field: any) => (
              <div>
                <label htmlFor='foto'>Foto Kegiatan</label>
                <InputFile
                  id='foto'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    field.handleChange(file);
                  }}
                  onClear={() => field.handleChange(null)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
        </div>
      </div>
    </>
  );
};

export default FormIdentDetailDak;
