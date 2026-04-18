import {
  ProfilSchema,
  useM_Profil,
  useProfilSFData,
} from './FH_Profil';
import { useAppForm } from '../form-context';
import toast from 'react-hot-toast';
import { getUserFromCookie } from '../../../lib/usercookie';

const F_Profil = () => {
    const userCookie = getUserFromCookie();
    const data = {
        name: userCookie?.username ?? '',
        fullname: userCookie?.nama ?? '',
        email: userCookie?.email ?? ''
    }

  const { initialValues } = useProfilSFData(data);
  const { mutateWithToast, loading } = useM_Profil();
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const payload = {
        email: value.email,
        fullname: value.fullname,
        name: value.name,
      };

      mutateWithToast(payload);
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: ProfilSchema,
    },
  });

  return (
    <div className='space-y-4'>
        <h4>Ubah Profil</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='space-y-4'
      >
        <div className='space-y-2'>
          {/* Field Nama */}
          <form.AppField
            name='fullname'
            children={(field) => (
              <field.TextField label='Nama' placeholder='Nama...' reqLabel />
            )}
          />
          {/* MARK: Field Username */}
          <form.AppField
            name='name'
            children={(field) => (
              <field.TextField
                label='Username'
                placeholder='Username...'
                reqLabel
              />
            )}
          />
          {/* MARK: Field Email */}
          <form.AppField
            name='email'
            children={(field) => (
              <field.TextField
                type='email'
                label='Email'
                placeholder='Email...'
                reqLabel
              />
            )}
          />
        </div>

        <div className='flex justify-end items-end'>
          <form.AppForm>
            <form.SubmitButton isLoading={loading}>Simpan</form.SubmitButton>
          </form.AppForm>
        </div>
      </form>
    </div>
  );
};

export default F_Profil;
