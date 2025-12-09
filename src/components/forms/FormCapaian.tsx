import React, {  } from 'react';
import InputButton from '../inputs/InputButton';
import { useForm } from '@tanstack/react-form';
import ErrorField from './ErrorField';
import InputText from '../inputs/InputText';
import type { CapaianForm } from '../../services/CapaianService';
import { capaianSchema, capaianSchemaSubmit, mapErrors, mapToInput } from './schemas/SchemaCapaian';

// #region Types
interface FormProps {
  children?: React.ReactElement;
  defaultValues: CapaianForm;
  onSubmit: (data: CapaianForm) => void;
}
// #endregion

const FormCapaian: React.FC<FormProps> = ({
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
      onSubmit(value);
    },
    validators: {
      onChange: ({ value }) => validateWith(capaianSchema, value),
      onSubmit: ({ value }) => validateWith(capaianSchemaSubmit, value),
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
        <div className='flex flex-col space-y-4'>
            <InputText value={form.getFieldValue('indikator_name')} onChange={() => {}} readOnly disabled />
          {/* Triwulan */}
          <div className='grid grid-cols-2 grid-rows-2 gap-2'>
            {[0, 1, 2, 3].map((n) => (
              <div key={n}>
                <form.Field name={`capaian[${n}].capaian`}>
                  {(field) => (
                    <>
                      <label htmlFor={`capaian[${n}].capaian`}>
                        Triwulan ke {n + 1}
                      </label>
                      <InputText
                        inputMode='numeric'
                        type='text'
                        placeholder='Capaian...'
                        id={`capaian[${n}].capaian`}
                        value={field.state.value ?? ''}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </>
                  )}
                </form.Field>
                <form.Field name={`capaian[${n}].triwulan`}>
                  {(field) => (
                    <>
                      <input
                        type='hidden'
                        value={field.state.value ?? ''}
                        readOnly
                      />
                    </>
                  )}
                </form.Field>
              </div>
            ))}
          </div>

          {/* Field SKPD Periode Id */}
          <form.Field name='id_rincian'>
            {(field) => (
              <>
                <input
                  id='id_rincian'
                  type='hidden'
                  value={field.state.value ?? ''}
                  readOnly
                />
                <ErrorField field={field} />
              </>
            )}
          </form.Field>
        </div>

        {children ? children : <InputButton type='submit'>Simpan</InputButton>}
      </form>
    </>
  );
};

export default FormCapaian;
