import React, { useEffect, useState } from 'react';
import InputButton from '../inputs/InputButton';
import {
  getSKPDPeriode,
  type PeriodeForm,
} from '../../services/PeriodeService';
import { useForm, useStore } from '@tanstack/react-form';
import { MdCalendarMonth } from 'react-icons/md';
import InputText from '../inputs/InputText';
import InputToggle from '../inputs/InputToggle';
import { mapErrors, mapToInput, periodeSchema, periodeSchemaSubmit } from './schemas/SchemaPeriode';
import ErrorField from './ErrorField';
import { useQuery } from '@tanstack/react-query';
import { getSKPD, type SKPDType } from '../../services/SKPDService';
import InputSearchBox, { type OptionItem } from '../inputs/InputSearchBox';

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

  const values = useStore(form.store, (s) => s.values);

  // #region Pilihan Input SKPD
  const { data } = useQuery({
    queryKey: ['list_SKPD'],
    queryFn: () => getSKPD(),
  });
  const [selectedSKPD, setSelectedSKPD] = useState<SKPDType[]>([]);

  const handleAddSKPD = (value: string) => {
    const id = parseInt(value);
    const selected = data?.find((item) => item.id === id);
    if (selected && !selectedSKPD.some((x) => x.id === id)) {
      setSelectedSKPD((prev) => [...prev, selected]);
    }
  };

  const handleRemoveSKPD = (id: number) => {
    setSelectedSKPD((prev) => prev.filter((x) => x.id !== id));
  };

  const { data: skpdbyperiode } = useQuery({
    queryKey: ['list_skpdbyperiode', values.id],
    queryFn: () => getSKPDPeriode(Number(values.id)),
    enabled: type === 'Edit' && values.id !== 0,
  });

  const [firstOpen, setFirstOpen] = useState(true);
  useEffect(() => {
    setFirstOpen(false);
    if (!firstOpen) {
      const skpdterpilih = selectedSKPD.map((item) => item.id).join(', ');
      form.setFieldValue('skpds', skpdterpilih);

      if (!skpdterpilih) {
        form.setFieldValue('skpds', 'all');
      }
    }
  }, [selectedSKPD]);

  useEffect(() => {
    if (type === 'Edit' && values.id !== 0 && skpdbyperiode) {
      const normalizedSKPD = skpdbyperiode.map(({ skpd_id, name }) => ({
        id: skpd_id,
        name: name,
      }));
      setSelectedSKPD(normalizedSKPD);
    }
  }, [skpdbyperiode]);

  const listSKPD =
    data?.map((item) => ({
      label: item.name,
      value: item.id?.toString(),
      disabled: selectedSKPD.some(
        (skpd) => skpd.id?.toString() === item.id?.toString(),
      ),
    })) || [];
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
            )}
          </form.Field>
        </div>
        {/* Field SKPD */}
        <div>
          <label htmlFor='listskpd'>
            SKPD{' '}
            <span className='text-sm italic opacity-50'>
              *kosongkan jika ingin semua SKPD
            </span>
          </label>
          <InputSearchBox
            id='listskpd'
            options={listSKPD as OptionItem[]}
            onChange={handleAddSKPD}
            value=''
            defaultValue=''
            defaultOptionLabel='Pilih SKPD'
            className='h-9'
            withSearch
          />
          {/* Daftar SKPD terpilih */}
          {selectedSKPD.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-2'>
              {selectedSKPD.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center bg-white shadow px-2 py-1 rounded-full text-sm'
                >
                  <span>{item.name}</span>
                  <button
                    type='button'
                    onClick={() => handleRemoveSKPD(item.id!)}
                    className='ml-2 text-red-500 hover:text-red-700'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <form.Field name='skpds'>
            {(field) => (
              <input
                id='skpds'
                name='skpds'
                type='hidden'
                value={(field.state.value as []) ?? ''}
                readOnly
                className='py-1 px-2 mt-2 border rounded'
              />
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
