import { useAppForm } from '../../form-context';
import toast from 'react-hot-toast';
import { useM_RealisasiDAK } from './M_RealisasiDak';
import {
  SchemaFormRealisasiDak,
  useRealisasiDakFormData,
  type RealisasiDakForm,
} from './FV_RealisasiDak';

const F_RealisasiDak = ({
  data,
  onSuccess,
}: {
  data: RealisasiDakForm;
  onSuccess?: () => void;
}) => {
  const { mutateWithToast, loading } = useM_RealisasiDAK();
  const { initialValues } = useRealisasiDakFormData(data);

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      if (data.id_realisasi) {
        const payload = {
          id_realisasi: data.id_realisasi,
          // fisik: Number(value.fisik),
          fisik: Number(String(value.fisik).replace(',', '.')),
          anggaran: Number(value.anggaran),
          sasaran_lokasi:
            String(value.sasaran_lokasi) === 'true' ||
            value.sasaran_lokasi === true,
          kesesuaian_juknis:
            String(value.kesesuaian_juknis) === 'true' ||
            value.kesesuaian_juknis === true,
          catatan: value.catatan,
        };
        console.log('PAYLOAD: ', payload);
        mutateWithToast(payload, () => {
          onSuccess?.();
        });
      }
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: SchemaFormRealisasiDak as any,
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='max-w-sm mx-auto space-y-4'
      >
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <div className='flex-1 max-w-30'>
              <form.AppField
                name='fisik'
                children={(field) => (
                  <field.TextField
                    label='Fisik'
                    placeholder='Fisik...'
                    Iconlabel='%'
                    IconlabelPos='right'
                    reqLabel
                  />
                )}
              />
            </div>
            <div className='flex-2'>
              <form.AppField
                name='anggaran'
                children={(field) => (
                  <field.TextField
                    label='Keuangan'
                    placeholder='Keuangan...'
                    Iconlabel='Rp.'
                    Nomor
                    Rupiah
                    reqLabel
                  />
                )}
              />
            </div>
          </div>
          <form.AppField
            name='sasaran_lokasi'
            children={(field) => (
              <field.SelectField
                label='Kesesuaian Sasaran dan Lokasi dengan RKPD'
                placeholder='Pilih...'
                options={[
                  { label: 'Ya', value: 'true' },
                  { label: 'Tidak', value: 'false' },
                ]}
                withSearch={false}
                reqLabel
              />
            )}
          />
          <form.AppField
            name='kesesuaian_juknis'
            children={(field) => (
              <field.SelectField
                label='Keseuaian antara DPA-SKPD dengan Juknis'
                placeholder='Pilih...'
                options={[
                  { label: 'Ya', value: 'true' },
                  { label: 'Tidak', value: 'false' },
                ]}
                withSearch={false}
                reqLabel
              />
            )}
          />
          <form.AppField
            name='catatan'
            children={(field) => (
              <field.TextAreaField label='Catatan' placeholder='Catatan...' />
            )}
          />
        </div>
        <div className='float-end'>
          <form.AppForm>
            <form.SubmitButton isLoading={loading}>Simpan</form.SubmitButton>
          </form.AppForm>
        </div>
      </form>
    </div>
  );
};

export default F_RealisasiDak;
