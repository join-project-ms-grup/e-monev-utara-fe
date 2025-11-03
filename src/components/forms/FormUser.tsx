import React, { useState } from 'react';
import InputButton from '../inputs/InputButton';
import type { UserForm } from '../../services/UserService';
import { useForm } from '@tanstack/react-form';
import { mapErrors, mapToInput, userSchema, userSchemaSubmit } from './schemas/SchemaUser';
import InputText from '../inputs/InputText';
import ErrorField from './ErrorField';
import { getRoleAdmin, getRoleDev } from '../../services/RoleService';
import { useQuery } from '@tanstack/react-query';
import { getRoleId } from '../../lib/usercookie';
import InputSearchBox, { type OptionItem } from '../inputs/InputSearchBox';
import { getSKPD } from '../../services/SKPDService';

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
  //#region Form
  const validateWith = (schema: any, value: any) => {
    const input = mapToInput(value);
    const result = schema.safeParse(input);
    return result.success
      ? { fields: {} }
      : { fields: mapErrors(result.error.format()) };
  };

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
      onChange: ({ value }) => validateWith(userSchema, value),
      onSubmit: ({ value }) => validateWith(userSchemaSubmit, value),
    },
  });
  //#endregion

  const { data: roleData, isFetching } = useQuery({
    queryKey: ['formuser_rolelist'],
    queryFn: getRoleId() === 1 ? getRoleDev : getRoleAdmin,
  });

  //#region SKPD dan Tahun ke
  const { data: dataSKPD } = useQuery({
    queryKey: ['list_skpd_all'],
    queryFn: async () => getSKPD(),
  });
  const listSKPD =
    dataSKPD?.map((item) => ({
      label: `[${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

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
          <div className='grid grid-cols-2 gap-2'>
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
                    <InputSearchBox
                      id='role_id'
                      name='role_id'
                      options={roleList as OptionItem[]}
                      value={field.state.value?.toString()}
                      onChange={(val) => field.handleChange(val)}
                      defaultOptionLabel='Pilih Role'
                      className='col-span-3 h-9'
                      disabled={isFetching}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                );
              }}
            </form.Field>
          </div>
          <div className='grid grid-cols-1'>
            {/* Field Role */}
            <form.Field name='skpd_id'>
              {(field) => {
                return (
                  <div className='flex-1'>
                    <label htmlFor='skpd_id'>SKPD</label>
                    <InputSearchBox
                      id='skpd_id'
                      options={listSKPD as OptionItem[]}
                      value={field.state.value?.toString()}
                      onChange={(val) => field.handleChange(val)}
                      defaultOptionLabel='Pilih SKPD'
                      className='col-span-3 h-9'
                      disabled={isFetching}
                      invalid={!field.state.meta.isValid}
                      withSearch
                    />
                    <ErrorField field={field} />
                  </div>
                );
              }}
            </form.Field>
          </div>
          <div className='grid grid-cols-2 gap-2'>
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
          </div>
          {type === 'Add' && (
            <div className='grid grid-cols-2 gap-2'>
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
          )}
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
