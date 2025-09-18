import React, { useState } from 'react';
import InputButton from '../inputs/InputButton';
import InputSelectBox from '../inputs/InputSelectBox';
import type { SKPDForm, SKPDFormState } from '../../types/data';
import { InputField } from '../inputs/InputField';

interface BaseFormProps {
  children?: React.ReactElement;
  formData: SKPDFormState;
  setFormData: React.Dispatch<React.SetStateAction<SKPDFormState>>;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: SKPDForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: SKPDForm & {status?: string | boolean} }) => void;
}

type FormProps = FormAddProps | FormEditProps;

const FormSKPD: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  formData,
  setFormData,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.kode || !formData.name) {
      setError('Kode dan Nama wajib diisi.');
      return;
    }

    setError(null);

    if (type === 'Add') {
      onSubmit(formData);
    } else {
      if (formData.id == null) {
        setError('ID tidak ditemukan untuk mode edit.');
        return;
      }
      const { id, ...payload } = formData;
      onSubmit({ id, payload });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto p-4 space-y-4'>
      {error && <div className='text-red-600 text-sm mb-2'>{error}</div>}
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='kode'>Kode</label>
        <InputField
          type='text'
          inputMode='numeric'
          id='kode'
          label='Kode'
          name='kode'
          maxLength={10}
          value={formData.kode!}
          onChange={handleChange}
          className='col-span-3'
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='shortname'>Singkatan</label>
        <InputField
          id='shortname'
          label='Singkatan'
          name='shortname'
          value={formData.shortname}
          onChange={handleChange}
          className='col-span-3'
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='name'>Nama</label>
        <InputField
          id='name'
          label='Nama'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='col-span-3'
          required
        />
      </div>
      {type == 'Edit' && (
        <div className='grid grid-cols-4 items-center gap-2'>
          <label htmlFor='status'>Status</label>
          <InputSelectBox
            id='status'
            name='status'
            options={[
              { label: 'Ya', value: 'true' },
              { label: 'Tidak', value: 'false' },
            ]}
            value={(formData as SKPDFormState).status?.toString()}
            onChange={(val) =>
              setFormData({ ...(formData as SKPDFormState), status: val })
            }
            defaultOptionLabel='Pilih Status'
            className='col-span-3'
            required
          />
        </div>
      )}
      {children ? (
        children
      ) : (
        <InputButton type='submit'>
          {type === 'Add' ? 'Tambah' : 'Simpan Perubahan'}
        </InputButton>
      )}
    </form>
  );
};

export default FormSKPD;
