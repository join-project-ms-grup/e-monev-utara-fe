import React from 'react';
import { useForm } from '@tanstack/react-form';
import {
  mapErrors,
  mapToInput,
  tahundakSchema,
  tahundakSchemaSubmit,
} from '../schemas/DAK/SchemaTahunDak';
import type { TahunDAKForm } from '../../../services/DAK/DAKTahunService';
import InputButton from '../../inputs/InputButton';
import InputText from '../../inputs/InputText';
import ErrorField from '../ErrorField';

// #region Types
interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: TahunDAKForm;
  onSubmit: (data: TahunDAKForm) => void;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
}

type FormProps = FormAddProps | FormEditProps;
// #endregion

const FormTahunDak: React.FC<FormProps> = ({
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
      onChange: ({ value }) => validateWith(tahundakSchema, value),
      onSubmit: ({ value }) => validateWith(tahundakSchemaSubmit, value),
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
          <form.Field name='tahun'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='tahun'>Tahun</label>
                <InputText
                  inputMode='numeric'
                  type='text'
                  maxLength={4}
                  placeholder='Tahun...'
                  id='tahun'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Tahun Akhir */}
          <form.Field name='keterangan'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='keterangan'>Keterangan</label>
                <InputText
                  type='text'
                  placeholder='Keterangan...'
                  id='keterangan'
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

export default FormTahunDak;
