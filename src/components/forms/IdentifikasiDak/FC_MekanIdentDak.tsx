import { withForm } from '../form-context';
import { initIdentDAKForm } from './FV_IdentDak';

// FC (FORM CHILD)
export const FC_MekanIdentDak = withForm({
  defaultValues: initIdentDAKForm,
  props: {
    title: '',
  },
  render: function Render({ form, title }) {
    return (
      <div className='max-w-4xl mx-auto '>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
          {/* MARK: MEKANISME & CATATAN DAK */}
          <h5 className='whitespace-nowrap mx-3'>{title}</h5>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
        </div>

        <div className='space-y-2'>
          {/* MARK: CATATAN */}
          <form.AppField
            name='catatan'
            children={(field) => (
              <field.TextAreaField
                label='Catatan'
                placeholder='Catatan...'
                reqLabel
              />
            )}
          />

          <div className='grid grid-cols-[1fr_1fr_2fr] gap-2'>
            {/* MARK: MEKANISME */}
            <form.AppField
              name='mekanisme'
              children={(field) => (
                <field.SelectField
                  label='Mekanisme'
                  Nomor
                  placeholder='Pilih Mekanisme...'
                  options={[
                    { label: 'Swakelola', value: 'swakelola' },
                    { label: 'Kontrak', value: 'kontrak' },
                    { label: 'eKatalog', value: 'ekatalog' },
                  ]}
                  reqLabel
                />
              )}
            />
            {/* MARK: VOLUME MEKANISME */}
            <form.AppField
              name='volume_mekanisme'
              children={(field) => (
                <field.TextField
                  label='Volume'
                  Nomor
                  placeholder='Volume...'
                  reqLabel
                />
              )}
            />

            {/* MARK: MEKANISME UANG */}
            <form.AppField
              name='uang_mekanisme'
              children={(field) => (
                <field.TextField
                  label='Uang'
                  placeholder='Uang...'
                  Rupiah
                  reqLabel
                />
              )}
            />
          </div>

          {/* MARK: METODE */}
          <form.AppField
            name='metode'
            children={(field) => (
              <field.TextField
                label='Metode Pembayaran'
                placeholder='Metode Pembayaran...'
                reqLabel
              />
            )}
          />
        </div>
      </div>
    );
  },
});
