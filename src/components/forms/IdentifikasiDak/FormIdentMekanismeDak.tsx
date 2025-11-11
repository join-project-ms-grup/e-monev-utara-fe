import InputSearchBox from '../../inputs/InputSearchBox';
import InputText from '../../inputs/InputText';
import InputTextArea from '../../inputs/InputTextArea';
import ErrorField from '../ErrorField';

const FormIdentMekanismeDak = ({ form }: { form: any }) => {
  return (
    <>
      {/* MARK: CATATAN MEKANISME PELAKSANAAN */}
      <div className='max-w-4xl mx-auto '>
        <div className='flex items-center mb-4'>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
          <h5 className='whitespace-nowrap mx-3'>
            Catatan & Mekanisme Pelaksanaan
          </h5>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
        </div>

        <div className='space-y-2'>
          {/* MARK: CATATAN */}
          <form.Field name='catatan'>
            {(field: any) => (
              <div>
                <label htmlFor='catatan'>
                  Catatan{' '}
                  <code className='text-red-500 text-xs align-text-top'>
                    (*)
                  </code>
                </label>
                <InputTextArea
                  id='catatan'
                  placeholder='Catatan...'
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onClear={() => field.handleChange('')}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>

          <div className='grid grid-cols-3 gap-2'>
            {/* MEKANISME PEMBAYARAN */}
            <form.Field name='mekanisme'>
              {(field: any) => (
                <div>
                  <label htmlFor='mekanisme'>
                    Mekanisme{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='mekanisme'
                    placeholder='Pilih Mekanisme'
                    className='h-9'
                    options={[
                      { label: 'Swakelola', value: 'swakelola' },
                      { label: 'Kontrak', value: 'kontrak' },
                      { label: 'eKatalog', value: 'ekatalog' },
                    ]}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e)}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* MARK: MEKANISME VOLUME */}
            <form.Field name='volume_mekanisme'>
              {(field: any) => (
                <div>
                  <label htmlFor='volume_mekanisme'>
                    Volume{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='volume_mekanisme'
                    placeholder='Volume...'
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

            {/* MARK: MEKANISME UANG */}
            <form.Field name='uang_mekanisme'>
              {(field: any) => (
                <div>
                  <label htmlFor='uang_mekanisme'>
                    Uang{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='uang_mekanisme'
                    placeholder='Uang...'
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

          {/* MARK: MEKANISME METODE */}
          <form.Field name='metode'>
            {(field: any) => (
              <div>
                <label htmlFor='metode'>
                  Metode Pembayaran{' '}
                  <code className='text-red-500 text-xs align-text-top'>
                    (*)
                  </code>
                </label>
                <InputText
                  id='metode'
                  placeholder='Metode pembayaran...'
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
      </div>
    </>
  );
};

export default FormIdentMekanismeDak;
