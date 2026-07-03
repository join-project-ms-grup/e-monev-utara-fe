import { useQuery } from '@tanstack/react-query';
import { getRoleId } from '../../../../lib/usercookie';
import { getRoleDev, getRoleAdmin } from '../../../../services/RoleService';
import { type OptionItem } from '../../../inputs/InputSearchBox';
import { useM_User, UserSchema, useUserSFData, type UserSF } from './FH_User';
import { useAppForm } from '../../form-context';
import toast from 'react-hot-toast';
import { useListSKPD } from '../../../../hooks/RKPD/List';
import { useListOPDDAK } from '../../../../hooks/DAK/ListDataDAK';
import { useStore } from '@tanstack/react-form';

interface F_UserProps {
  data: UserSF;
  onSuccess?: () => void;
}

export const F_User = ({ data, onSuccess }: F_UserProps) => {
  // Form
  const { initialValues } = useUserSFData(data);
  const { mutateWithToast, loading } = useM_User();
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const addPayload = {
        email: value.email,
        fullname: value.fullname,
        name: value.name,
        password: value.password,
        role_id: Number(value.role_id),
        skpd_id: Number(value.skpd_id),
      };
      const editPayload = {
        id: value.id,
        email: value.email,
        fullname: value.fullname,
        name: value.name,
        role_id: Number(value.role_id),
        skpd_id: Number(value.skpd_id),
      };

      mutateWithToast(value.id ? editPayload : addPayload, () => {
        onSuccess?.();
      });
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: UserSchema,
    },
  });

  const { data: roleData } = useQuery({
    queryKey: ['formuser_rolelist'],
    queryFn: getRoleId() === 1 ? getRoleDev : getRoleAdmin,
  });

  const selectedRoleId = useStore(form.store, (state) => state.values.role_id);
  const listSKPD = useListSKPD();
  const listOPDDAK = useListOPDDAK();
  const listSKPDOPD = selectedRoleId.toString() !== '3' ? listOPDDAK : listSKPD;

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
          {/* MARK: Field Role */}
          <form.AppField
            name='role_id'
            listeners={{
              onChange: () => form.setFieldValue('skpd_id', ''),
            }}
            children={(field) => {
              const roleList =
                (roleData?.map((item) => ({
                  label: item.name,
                  value: item.kode?.toString(),
                })) as OptionItem[]) || [];
              return (
                <field.SelectField
                  label='Pilih Role'
                  placeholder='Pilih Role'
                  options={roleList}
                  reqLabel
                />
              );
            }}
          />
          {/* MARK: Field SKPD */}
          <form.AppField
            name='skpd_id'
            children={(field) => (
              <field.SelectField
                label='Pilih SKPD'
                placeholder='Pilih SKPD'
                options={listSKPDOPD}
                disabled={!selectedRoleId}
                tooltip
                reqLabel
              />
            )}
          />
          {!data.id && (
            <div className='grid grid-cols-2 gap-2'>
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
