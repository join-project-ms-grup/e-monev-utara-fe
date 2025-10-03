import React from 'react';
import type { Master } from '../../services/MasterService';
import { useForm } from '@tanstack/react-form';
import InputButton from '../inputs/InputButton';
import InputText from '../inputs/InputText';
import ErrorField from './ErrorField';
import { rekeningSchema, rekeningSchemaSubmit } from './schemas/SchemaRekening';
import InputSearchBox from '../inputs/InputSearchBox';

interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: Master;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: Master) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: Master }) => void;
}

type FormProps = FormAddProps | FormEditProps;

const FormRekening: React.FC<FormProps> = ({
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
          type: value.rekening?.toString() ?? '',
        };

        const result = rekeningSchema.safeParse(input);

        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              kode: errors.kode?._errors[0],
              name: errors.name?._errors[0],
              type: errors.type?._errors[0],
            },
          };
        }
      },
      onSubmit: ({ value }) => {
        const input = {
          kode: value.kode?.toString() ?? '',
          name: value.name?.toString() ?? '',
          type: value.rekening?.toString() ?? '',
        };
        const result = rekeningSchemaSubmit.safeParse(input);
        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              kode: errors.kode?._errors[0],
              name: errors.name?._errors[0],
              type: errors.type?._errors[0],
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
                <label htmlFor='kode'>Mulai</label>
                <InputText
                  inputMode='numeric'
                  type='text'
                  maxLength={4}
                  placeholder='Kode...'
                  id='kode'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Nama */}
          <form.Field name='name'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='akhir'>Nama</label>
                <InputText
                  type='text'
                  placeholder='Nama...'
                  id='name'
                  value={field.state.value!}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          {/* Field Rekening */}
          <form.Field name='rekening'>
            {(field) => {
              return (
                <div className='flex-1'>
                  <label htmlFor='rekening'>Rekening</label>
                  <InputSearchBox
                    id='rekening'
                    name='rekening'
                    options={[
                      { label: 'Urusan', value: 'urusan' },
                      { label: 'Bidang', value: 'bidang' },
                      { label: 'Program', value: 'program' },
                      { label: 'Kegiatan', value: 'kegiatan' },
                      { label: 'Sub Kegiatan', value: 'subKegiatan' },
                    ]}
                    value={field.state.value!}
                    onChange={(val) => field.handleChange(val)}
                    defaultOptionLabel='Pilih Rekening'
                    className='h-9'
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              );
            }}
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

export default FormRekening;
