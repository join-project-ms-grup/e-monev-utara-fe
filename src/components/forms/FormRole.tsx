import React, { useState } from 'react';
import InputButton from '../inputs/InputButton';
import type { RoleForm, RoleFormState } from '../../types/data';
import { InputField } from '../inputs/InputField';

interface BaseFormProps {
  children?: React.ReactElement;
  formData: RoleFormState;
  setFormData: React.Dispatch<React.SetStateAction<RoleFormState>>;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: RoleForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: RoleForm }) => void;
}

type FormProps = FormAddProps | FormEditProps;

const FormRole: React.FC<FormProps> = ({
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
      {children ? (
        children
      ) : (
        <InputButton type='submit'>
          {type === 'Add' ? 'Tambah' : 'Simpan'}
        </InputButton>
      )}
    </form>
  );
};

export default FormRole;
