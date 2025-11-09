import React from 'react';
import type { OPDDAKForm } from '../../../services/DAK/DAKOPDService';
import { useForm } from '@tanstack/react-form';
import InputText from '../../inputs/InputText';
import ErrorField from '../ErrorField';
import InputToggle from '../../inputs/InputToggle';
import {
  mapErrors,
  mapToInput,
  opddakSchema,
  opddakSchemaSubmit,
} from '../schemas/DAK/SchemaOPDDak';
import InputButton from '../../inputs/InputButton';

interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: OPDDAKForm;
  onSubmit: (data: OPDDAKForm) => void;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
}

type FormProps = FormAddProps | FormEditProps;

const FormOPDDak: React.FC<FormProps> = ({
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
      onSubmit(value);
      //   if (type === 'Add') {
      //     onSubmit(value);
      //   } else {
      //     if (value.id == null) {
      //       return;
      //     }
      //     const { id, ...payload } = value;
      //     onSubmit({ id, payload });
      //   }
    },
    validators: {
      onChange: ({ value }) => validateWith(opddakSchema, value),
      onSubmit: ({ value }) => validateWith(opddakSchemaSubmit, value),
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
                    placeholder='Kode opd...'
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
                    <div className='flex items-center justify-center'>
                      <div className='w-30'>
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
                  </div>
                </div>
              )}
            </form.Field>
          )}
          {/* Field Nama */}
          <form.Field name='fullname'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='fullname'>Nama</label>
                <InputText
                  // Icon={MdCalendarMonth}
                  type='text'
                  placeholder='Nama opd...'
                  id='fullname'
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
                  placeholder='Singkatan opd...'
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

export default FormOPDDak;
