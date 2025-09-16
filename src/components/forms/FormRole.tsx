import React, { useState } from 'react';
import InputButton from '../inputs/InputButton';
import InputText from '../inputs/InputText';
import InputSelectBox from '../inputs/InputSelectBox';
import type { RoleAdminType, RoleEditType } from '../../types/data';

interface FormAddProps {
  type: 'Add';
  children?: React.ReactElement;
  onSubmit: (data: RoleAdminType) => void;
  formData: RoleAdminType;
  setFormData: React.Dispatch<React.SetStateAction<RoleAdminType>>;
}

interface FormEditProps {
  type: 'Edit';
  children?: React.ReactElement;
  onSubmit: (data: RoleEditType) => void;
  formData: RoleEditType;
  setFormData: React.Dispatch<React.SetStateAction<RoleEditType>>;
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

    // if (!formData.kode || !formData.name) {
    //   setError('Kode dan Nama wajib diisi.');
    //   return;
    // }

    setError(null);

    if (type === 'Add') {
      onSubmit(formData);
    } else {
      onSubmit({ ...formData, id: (formData as any).id });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto p-4 space-y-4'>
      {error && <div className='text-red-600 text-sm mb-2'>{error}</div>}
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='kode'>Kode</label>
        <InputText
          type='number'
          id='kode'
          label='Kode'
          name='kode'
          min={1}
          value={formData.kode}
          onChange={handleChange}
          className='col-span-3'
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='name'>Nama</label>
        <InputText
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
          {type === 'Add' ? 'Tambah' : 'Simpan Perubahan'}
        </InputButton>
      )}
    </form>
  );
};

export default FormRole;
