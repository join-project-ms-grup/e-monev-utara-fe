import React from 'react';
import { useForm } from '@tanstack/react-form';
import InputText from '../../inputs/InputText';
import ErrorField from '../ErrorField';
import InputToggle from '../../inputs/InputToggle';
import InputButton from '../../inputs/InputButton';
import type { SubJenisDAKForm } from '../../../services/DAK/DAKJenisService';
import {
  mapErrors,
  mapToInput,
  subjenisdakSchema,
  subjenisdakSchemaSubmit,
} from '../schemas/DAK/SchemaSubJenisDak';
import InputTextArea from '../../inputs/InputTextArea';
import InputSearchBox from '../../inputs/InputSearchBox';

// #region Types
interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: SubJenisDAKForm;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: SubJenisDAKForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: SubJenisDAKForm) => void;
}

type FormProps = FormAddProps | FormEditProps;
// #endregion

const FormSubJenisDak: React.FC<FormProps> = ({
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
    defaultValues: {
      ...defaultValues,
      kode_jenis: '1',
    },
    onSubmit: async ({ value }) => {
      if (type === 'Add') {
        const payload = {
          keterangan: value.keterangan ?? null,
          kode_jenis: value.kode_jenis,
          nama: value.nama,
        };
        onSubmit(payload);
      } else {
        if (value.id == null) return;
        const payload = {
          keterangan: value.keterangan,
          nama: value.nama,
          status: value.status,
          id: value.id,
        };
        onSubmit(payload);
      }
    },
    validators: {
      onChange: ({ value }) => validateWith(subjenisdakSchema, value),
      onSubmit: ({ value }) => validateWith(subjenisdakSchemaSubmit, value),
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
        className='max-w-md mx-auto space-y-2'
      >
        <div>
          {/* MARK NAMA */}
          <form.Field name='nama'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='nama'>
                  Nama{` `}
                  <code className='text-red-500 text-xs align-text-top'>
                    (*)
                  </code>
                </label>
                <InputText
                  placeholder='Nama...'
                  id='nama'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
        </div>
        <div className='flex flex-row gap-2'>
          {/* MARK: STATUS */}
          <form.Field name='kode_jenis'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='kode_jenis'>Jenis</label>
                <InputSearchBox
                  value={field.state.value ?? '1'}
                  options={[
                    { label: 'Fisik', value: '1' },
                    { label: 'Non-Fisik', value: '2' },
                  ]}
                  onChange={(val) => field.handleChange(val)}
                />
              </div>
            )}
          </form.Field>
          {/* MARK: STATUS */}
          {type === 'Edit' && (
            <form.Field name='status'>
              {(field) => (
                <div>
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
          )}
        </div>
        <div>
          {/* MARK: KETERANGAN */}
          <form.Field name='keterangan'>
            {(field) => (
              <div className='col-span-2'>
                <label htmlFor='keterangan'>Keterangan</label>
                <InputTextArea
                  id='keterangan'
                  placeholder='Keterangan...'
                  value={field.state.value ?? ''}
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

export default FormSubJenisDak;
