import React from 'react';
import InputButton from '../inputs/InputButton';
import type { SKPDForm } from '../../services/SKPDService';
import { useForm } from '@tanstack/react-form';
import { mapErrors, mapToInput, skpdSchema, skpdSchemaSubmit } from './schemas/SchemaSKPD';
import InputText from '../inputs/InputText';
import ErrorField from './ErrorField';
import InputToggle from '../inputs/InputToggle';

interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: SKPDForm;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: SKPDForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: SKPDForm }) => void;
}

type FormProps = FormAddProps | FormEditProps;

const FormSKPD: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  defaultValues,
}) => {
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
      onChange: ({ value }) => validateWith(skpdSchema, value),
      onSubmit: ({ value }) => validateWith(skpdSchemaSubmit, value),
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
        <div className='grid grid-rows-2 grid-cols-2 gap-2'>
          {/* Field Kode */}
          <div className={`${type === 'Add' ? 'col-span-2' : ''}`}>
            <form.Field name='kode'>
              {(field) => (
                <div className='flex-1'>
                  <label htmlFor='kode'>Kode</label>
                  <InputText
                    // Icon={MdKey}
                    inputMode='numeric'
                    type='text'
                    maxLength={4}
                    placeholder='Kode skpd...'
                    id='kode'
                    value={field.state.value!}
                    onChange={(e) => field.handleChange(e.target.value)}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>
          {/* Field Status */}
          {type === 'Edit' && (
            <form.Field name='status' validators={{}}>
              {(field) => (
                <div className='flex-1'>
                  <div className='flex flex-col'>
                    <label htmlFor='status'>Status</label>
                    <InputToggle
                      id='status'
                      onLabel='Aktif'
                      offLabel='Nonaktif'
                      checked={field.state.value!}
                      defaultChecked={true}
                      onToggle={(val) => field.handleChange(val)}
                    />
                  </div>
                </div>
              )}
            </form.Field>
          )}
          {/* Field Nama */}
          <form.Field name='name'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='name'>Nama</label>
                <InputText
                  // Icon={MdCalendarMonth}
                  type='text'
                  placeholder='Nama skpd...'
                  id='name'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Shortname */}
          <form.Field name='shortname'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='shortname'>Singkatan</label>
                <InputText
                  // Icon={MdCalendarMonth}
                  type='text'
                  placeholder='Singkatan skpd...'
                  id='shortname'
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

export default FormSKPD;
