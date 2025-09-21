import React from 'react';
import InputButton from '../inputs/InputButton';
import InputSelectBox, { type OptionItem } from '../inputs/InputSelectBox';
import type { UserForm } from '../../services/UserService';
import { useForm } from '@tanstack/react-form';
import { userSchema, userSchemaSubmit } from './schemas/SchemaUser';
import InputText from '../inputs/InputText';
import ErrorField from './ErrorField';
import { getRoleAdmin, getRoleDev } from '../../services/RoleService';
import { useQuery } from '@tanstack/react-query';
import { getRoleId } from '../../lib/usercookie';

interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: UserForm;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: UserForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: UserForm }) => void;
}

type FormProps = FormAddProps | FormEditProps;

export const FormUser: React.FC<FormProps> = ({
  type,
  children,
  defaultValues,
  onSubmit,
}) => {
  // Form
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (type === 'Add') {
        onSubmit(value);
      } else {
        if (value.id == null) {
          return;
        }
        const { id, ...payload } = value;
        onSubmit({ id, payload });
      }
    },
    validators: {
      onChange: ({ value }) => {
        const input = {
          name: value.name?.toString() ?? '',
          fullname: value.fullname?.toString() ?? '',
          email: value.email?.toString() ?? '',
          role_id: value.role_id?.toString() ?? '',
          skpd_id: value.skpd_id?.toString() ?? '',
          password: value.password?.toString() ?? '',
          passwordConfirm: value.passwordConfirm?.toString() ?? '',
        };

        const result = userSchema.safeParse(input);

        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              name: errors.name?._errors[0],
              fullname: errors.fullname?._errors[0],
              email: errors.email?._errors[0],
              role_id: errors.role_id?._errors[0],
              skpd_id: errors.skpd_id?._errors[0],
              password: errors.password?._errors[0],
              passwordConfirm: errors.passwordConfirm?._errors[0],
            },
          };
        }
      },
      onSubmit: ({ value }) => {
        const input = {
          name: value.name?.toString() ?? '',
          fullname: value.fullname?.toString() ?? '',
          email: value.email?.toString() ?? '',
          role_id: value.role_id?.toString() ?? '',
          skpd_id: value.skpd_id?.toString() ?? '',
          password: value.password?.toString() ?? '',
          passwordConfirm: value.passwordConfirm?.toString() ?? '',
        };
        const result = userSchemaSubmit.safeParse(input);
        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              name: errors.name?._errors[0],
              fullname: errors.fullname?._errors[0],
              email: errors.email?._errors[0],
              role_id: errors.role_id?._errors[0],
              skpd_id: errors.skpd_id?._errors[0],
              password: errors.password?._errors[0],
              passwordConfirm: errors.passwordConfirm?._errors[0],
            },
          };
        }
      },
    },
  });

  const { data: roleData, isFetching } = useQuery({
    queryKey: ['formuser_rolelist'],
    queryFn: getRoleId() === 1 ? getRoleDev : getRoleAdmin,
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
        <div className='grid grid-cols-2 grid-rows-2 gap-4'>
          {/* Field Nama */}
          <form.Field name='fullname'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='fullname'>Nama</label>
                <InputText
                  type='text'
                  placeholder='Nama...'
                  id='fullname'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Role */}
          <form.Field name='role_id'>
            {(field) => {
              const roleList =
                roleData?.map((item) => ({
                  label: item.name,
                  value: item.kode?.toString(),
                })) || [];
              return (
                <div className='flex-1'>
                  <label htmlFor='role_id'>Role</label>
                  <InputSelectBox
                    id='role_id'
                    name='role_id'
                    options={roleList as OptionItem[]}
                    value={field.state.value!.toString()}
                    onChange={(val) => field.handleChange(val)}
                    defaultOptionLabel='Pilih Role'
                    className='col-span-3'
                    disabled={isFetching}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              );
            }}
          </form.Field>
          {/* Field Username */}
          <form.Field name='name'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='name'>Username</label>
                <InputText
                  type='text'
                  placeholder='Username...'
                  id='name'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Email */}
          <form.Field name='email'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='email'>Email</label>
                <InputText
                  type='email'
                  placeholder='Email...'
                  id='email'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Password */}
          <form.Field name='password'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='password'>Password</label>
                <InputText
                  type='password'
                  placeholder='Password...'
                  id='password'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Konfirmasi Password */}
          <form.Field name='passwordConfirm'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='passwordConfirm'>Konfirmasi Password</label>
                <InputText
                  type='password'
                  placeholder='Konfirmasi password...'
                  id='passwordConfirm'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
        </div>

        {children ? (
          children
        ) : (
          <InputButton type='submit'>
            {type === 'Add' ? 'Tambah' : 'Simpan'}
          </InputButton>
        )}
      </form>
    </>
  );
};
