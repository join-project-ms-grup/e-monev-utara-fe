import { useAppForm } from '../../../form-context';
import toast from 'react-hot-toast';
import {
  SchemaFormMasalahDak,
  useMasalahDakFormData,
  type MasalahDakForm,
} from './FV_MasalahDak';
import { useM_MasalahDAK } from './M_MasalahDak';

interface F_RekDakProps {
  data: MasalahDakForm;
  onSuccess?: () => void;
}

const F_MasalahDak = ({ data, onSuccess }: F_RekDakProps) => {
  const { mutateWithToast, loading } = useM_MasalahDAK();
  const { initialValues } = useMasalahDakFormData(data);

  // Form
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const addPayload = {
        kode_jenis: Number(value.kode_jenis),
        name: value.name,
        keterangan: value.keterangan,
      };
      const editPayload = {
        id: value.id,
        name: value.name,
        keterangan: value.keterangan,
        status: value.status,
      };

      mutateWithToast(value.id ? editPayload : addPayload, () => {
        onSuccess?.();
      });
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: SchemaFormMasalahDak,
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='max-w-md mx-auto space-y-4'
      >
        <div className='space-y-4'>
          {!data.id && (
            <form.AppField
              name='kode_jenis'
              children={(field) => (
                <field.SelectField
                  label='Jenis DAK'
                  placeholder='Pilih Jenis DAK'
                  options={[
                    { label: 'Fisik', value: '1' },
                    { label: 'Non-Fisik', value: '2' },
                  ]}
                />
              )}
            />
          )}

          <form.AppField
            name='name'
            children={(field) => (
              <field.TextField label='Nama' placeholder='Nama...' reqLabel />
            )}
          />
          <form.AppField
            name='keterangan'
            children={(field) => (
              <field.TextAreaField
                label='Keterangan'
                placeholder='Keterangan...'
                reqLabel
              />
            )}
          />
          {data.id !== 0 && (
            <form.AppField
              name='status'
              children={(field) => <field.ToggleField label='Status' />}
            />
          )}
        </div>
        <div className='float-end'>
          <form.AppForm>
            <form.SubmitButton isLoading={loading}>Simpan</form.SubmitButton>
          </form.AppForm>
        </div>
      </form>
    </>
  );
};

export default F_MasalahDak;
