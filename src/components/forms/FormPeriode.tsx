import React from 'react';
import InputButton from '../inputs/InputButton';
import { type PeriodeForm } from '../../services/PeriodeService';
import { useForm } from '@tanstack/react-form';
import { MdCalendarMonth } from 'react-icons/md';
import InputText from '../inputs/InputText';
import InputToggle from '../inputs/InputToggle';
import {
  mapErrors,
  mapToInput,
  periodeSchema,
  periodeSchemaSubmit,
} from './schemas/SchemaPeriode';
import ErrorField from './ErrorField';

// #region Types
interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: PeriodeForm;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: PeriodeForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: PeriodeForm }) => void;
}

type FormProps = FormAddProps | FormEditProps;
// #endregion

const FormPeriode: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  defaultValues,
}) => {
  // #region Form
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
      onChange: ({ value }) => validateWith(periodeSchema, value),
      onSubmit: ({ value }) => validateWith(periodeSchemaSubmit, value),
    },
  });
  // #endregion

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
          {/* Field Tahun Mulai */}
          <form.Field name='mulai'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='mulai'>Mulai</label>
                <InputText
                  Icon={MdCalendarMonth}
                  inputMode='numeric'
                  type='text'
                  maxLength={4}
                  placeholder='Tahun mulai...'
                  id='mulai'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Tahun Akhir */}
          <form.Field name='akhir'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='akhir'>Akhir</label>
                <InputText
                  Icon={MdCalendarMonth}
                  type='text'
                  inputMode='numeric'
                  maxLength={4}
                  placeholder='Tahun akhir...'
                  id='akhir'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Status */}
          <form.Field name='status' validators={{}}>
            {(field) => (
              <div className='flex-1'>
                <div className='flex flex-col'>
                  <label htmlFor='status'>Status</label>
                  <div className='w-30'>
                    <InputToggle
                      id='status'
                      onLabel='Aktif'
                      offLabel='Nonaktif'
                      checked={field.state.value}
                      defaultChecked={true}
                      onToggle={(val) => field.handleChange(val)}
                    />
                  </div>
                </div>
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

export default FormPeriode;
