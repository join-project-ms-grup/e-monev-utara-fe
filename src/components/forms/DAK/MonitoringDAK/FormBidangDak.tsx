import React from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import type { BidangDAKForm } from '../../../../services/DAK/DAKBidangService';
import {
  bidangdakSchema,
  bidangdakSchemaSubmit,
  mapErrorsBidangDak,
  mapToInputBidangDak,
} from '../../schemas/DAK/SchemaBidangDak';
import InputText from '../../../inputs/InputText';
import InputSearchBox from '../../../inputs/InputSearchBox';
import InputToggle from '../../../inputs/InputToggle';
import InputTextArea from '../../../inputs/InputTextArea';
import ErrorField from '../../ErrorField';
import InputButton from '../../../inputs/InputButton';
import { useListBidangDAK } from '../../../../hooks/DAK/ListDataDAK';

// #region Types
interface FormProps {
  children?: React.ReactElement;
  defaultValues: BidangDAKForm;
  onSubmit: (data: BidangDAKForm) => void;
  type: 'Add' | 'Edit';
}
// #endregion

const FormBidangDak: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  defaultValues,
}) => {
  // #region Form
  const validateWith = (schema: any, value: any) => {
    const input = mapToInputBidangDak(value);
    const result = schema.safeParse(input);
    return result.success
      ? { fields: {} }
      : { fields: mapErrorsBidangDak(result.error.format()) };
  };

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      type: 'bidang',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
    validators: {
      onChange: ({ value }) => validateWith(bidangdakSchema, value),
      onSubmit: ({ value }) => validateWith(bidangdakSchemaSubmit, value),
    },
  });
  const formValues = useStore(form.store).values;
  const listBidangDak = useListBidangDAK(Number(formValues.jenis_dak));
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
        {/* MARK: TIPE */}
        {type === 'Add' && (
          <>
            <div>
              <form.Field name='type'>
                {(field) => (
                  <div className='flex-1'>
                    <label htmlFor='type'>Tambah ke</label>
                    <InputSearchBox
                      id='type'
                      value={field.state.value ?? 'bidang'}
                      options={[
                        { label: 'Bidang', value: 'bidang' },
                        { label: 'Sub Bidang', value: 'sub' },
                      ]}
                      onChange={(val) => {
                        field.handleChange(val);
                        form.setFieldValue('id_bidang', 0);
                      }}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </>
        )}
        <div>
          {/* MARK NAMA */}
          <form.Field name='name'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='name'>
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
          <form.Field name='jenis_dak'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='kode_jenis'>Jenis</label>
                <InputSearchBox
                  value={field.state.value?.toString()}
                  options={[
                    { label: 'Fisik', value: '1' },
                    { label: 'Non-Fisik', value: '2' },
                  ]}
                  onChange={(val) => field.handleChange(Number(val))}
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
        {formValues.type === 'sub' && (
          <div>
            <form.Field name='id_bidang'>
              {(field) => (
                <div className='flex-1'>
                  <label htmlFor='type'>Bidang</label>
                  <InputSearchBox
                    id='type'
                    placeholder='Pilih Bidang'
                    value={field.state.value?.toString()}
                    options={listBidangDak}
                    onChange={(val) => field.handleChange(Number(val))}
                    onClear={() => field.handleChange(0)}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>
        )}
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

export default FormBidangDak;
