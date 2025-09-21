import React from 'react';
import InputButton from '../inputs/InputButton';
import type { RoleForm } from '../../services/RoleService';
import { useForm } from '@tanstack/react-form';
import { roleSchema, roleSchemaSubmit } from './schemas/SchemaRole';
import InputText from '../inputs/InputText';
import ErrorField from './ErrorField';

interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: RoleForm;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: RoleForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: RoleForm }) => void;
}

type FormProps = FormAddProps | FormEditProps;

const FormRole: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  defaultValues,
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
          kode: value.kode?.toString() ?? '',
          name: value.name?.toString() ?? '',
        };

        const result = roleSchema.safeParse(input);

        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              kode: errors.kode?._errors[0],
              name: errors.name?._errors[0],
            },
          };
        }
      },
      onSubmit: ({ value }) => {
        const input = {
          kode: value.kode?.toString() ?? '',
          name: value.name?.toString() ?? '',
        };
        const result = roleSchemaSubmit.safeParse(input);
        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              kode: errors.kode?._errors[0],
              name: errors.name?._errors[0],
            },
          };
        }
      },
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
        <div className='flex flex-row gap-4'>
          {/* Field Kode */}
          <form.Field name='kode'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='kode'>Kode</label>
                <InputText
                  // Icon={MdCalendarMonth}
                  inputMode='numeric'
                  type='text'
                  maxLength={4}
                  placeholder='Kode role...'
                  id='kode'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Name */}
          <form.Field name='name'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='name'>Role</label>
                <InputText
                  // Icon={MdCalendarMonth}
                  type='text'
                  placeholder='Nama role...'
                  id='name'
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

export default FormRole;
