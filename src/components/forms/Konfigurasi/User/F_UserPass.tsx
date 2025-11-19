import {
  useM_UserPass,
  UserPassSchema,
  useUserPassSFData,
  type UserPassSF,
} from './FH_User';
import { useAppForm } from '../../form-context';
import toast from 'react-hot-toast';

interface F_UserPassProps {
  data: UserPassSF;
  onSuccess?: () => void;
}

export const F_UserPass = ({ data, onSuccess }: F_UserPassProps) => {
  // Form
  const { initialValues } = useUserPassSFData(data);
  const { mutateWithToast, loading } = useM_UserPass();
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const payload = {
        id: value.id,
        password: value.password,
      };

      mutateWithToast(payload, () => {
        onSuccess?.();
      });
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: UserPassSchema,
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
        <div className='space-y-2'>
          <h5 className='mb-4'>{data.fullname}</h5>
          {/* MARK: Field Password */}
          <form.AppField
            name='password'
            children={(field) => (
              <field.TextField
                type='password'
                label='Password'
                placeholder='Password...'
                reqLabel
              />
            )}
          />
          {/* MARK: Field Konfirmasi Password */}
          <form.AppField
            name='passwordConfirm'
            children={(field) => (
              <field.TextField
                type='password'
                label='Konfirmasi Password'
                placeholder='Konfirmasi Password...'
                reqLabel
              />
            )}
          />
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
