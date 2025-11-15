import { withForm } from '../form-context';
import { initIdentDAKForm } from './FV_IdentDak';
import InputText from '../../inputs/InputText';
import ErrorField from '../ErrorField';

export const FC_DetailIdentDak = withForm({
  defaultValues: initIdentDAKForm,
  props: {
    title: '',
  },
  render: function Render({ form, title }) {
    return (
      <div className='max-w-4xl mx-auto '>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
          {/* MARK: DETAIL DAK */}
          <h5 className='whitespace-nowrap mx-3'>{title}</h5>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
        </div>

        <div className='space-y-2'>
          {/* MARK: NAMA PAKET */}
          <form.AppField
            name='nama_paket'
            children={(field) => (
              <field.TextField
                label='Nama Paket'
                placeholder='Nama Paket...'
                reqLabel
              />
            )}
          />

          {/* MARK: DETAIL PAKET */}
          <form.AppField
            name='detail_paket'
            children={(field) => (
              <field.TextAreaField
                label='Detail Paket'
                placeholder='Detail Paket...'
                reqLabel
              />
            )}
          />

          <div className='grid grid-cols-3 gap-2'>
            {/* MARK: SATUAN */}
            <form.AppField
              name='volume'
              children={(field) => (
                <field.TextField
                  label='Volume'
                  placeholder='Volume...'
                  Nomor
                  reqLabel
                />
              )}
            />
            {/* MARK: SATUAN */}
            <form.AppField
              name='satuan'
              children={(field) => (
                <field.TextField
                  label='Satuan'
                  placeholder='Satuan...'
                  reqLabel
                />
              )}
            />
            {/* MARK: ESTIMASI */}
            <form.AppField
              name='estimasi'
              children={(field) => (
                <field.TextField
                  label='Estimasi Waktu'
                  placeholder='Estimasi Waktu...'
                  reqLabel
                />
              )}
            />
          </div>
          <div className='grid grid-cols-[1fr_2fr] gap-2'>
            {/* MARK: JUMLAH PENERIMA */}
            <form.AppField
              name='jumlah_penerima'
              children={(field) => (
                <field.TextField
                  label='Jumlah Penerima'
                  placeholder='Jumlah Penerima Manfaat...'
                  reqLabel
                />
              )}
            />

            {/* MARK: ANGGARAN */}
            <form.AppField
              name='anggaran'
              children={(field) => (
                <field.TextField
                  label='Anggaran'
                  placeholder='Anggaran...'
                  Rupiah
                  reqLabel
                />
              )}
            />
          </div>

          {/* MARK: DESA / KELURAHAN */}
          <form.AppField
            name='des_kel'
            children={(field) => (
              <field.TextField
                label='Desa / Kelurahan'
                placeholder='Desa / Kelurahan...'
                reqLabel
              />
            )}
          />

          {/* MARK: KECAMATAN */}
          <form.AppField
            name='kec'
            children={(field) => (
              <field.TextField
                label='Kecamatan'
                placeholder='Kecamatan...'
                reqLabel
              />
            )}
          />

          {/* MARK: BUJUR */}
          <form.AppField name='bujur'>
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
          </form.AppField>

          {/* MARK: LINTANG */}
          <form.AppField
            name='lintang'
            children={(field) => {
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
          />

          {/* MARK: FOTO KEGIATAN */}
          <form.AppField
            name='foto'
            children={(field) => (
              <field.FileField
                label='Foto Kegiatan'
                placeholder='Pilih foto kegiatan'
              />
            )}
          />
        </div>
      </div>
    );
  },
});
