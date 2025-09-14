import React, { useState } from 'react';
import InputButton from '../inputs/InputButton';
import InputText from '../inputs/InputText';
import InputSelectBox from '../inputs/InputSelectBox';
import type { SKPDAddType, SKPDEditType } from '../../types/data';

interface FormAddProps {
  type: 'Add';
  children?: React.ReactElement;
  onSubmit: (data: SKPDAddType) => void;
  formData: SKPDAddType;
  setFormData: React.Dispatch<React.SetStateAction<SKPDAddType>>;
}

interface FormEditProps {
  type: 'Edit';
  children?: React.ReactElement;
  onSubmit: (data: SKPDEditType) => void;
  formData: SKPDEditType;
  setFormData: React.Dispatch<React.SetStateAction<SKPDEditType>>;
}

type FormSKPDProps = FormAddProps | FormEditProps;

const FormSKPD: React.FC<FormSKPDProps> = ({
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
      onSubmit({ ...formData, id: (formData as any).id });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto p-4 space-y-4'>
      {error && <div className='text-red-600 text-sm mb-2'>{error}</div>}
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='kode'>Kode</label>
        <InputText
          id='kode'
          label='Kode'
          name='kode'
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
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='shortname'>Singkatan</label>
        <InputText
          id='shortname'
          label='Singkatan'
          name='shortname'
          value={formData.shortname}
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
            value={(formData as SKPDEditType).status.toString()}
            onChange={(val) =>
              setFormData({ ...(formData as SKPDEditType), status: val })
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
