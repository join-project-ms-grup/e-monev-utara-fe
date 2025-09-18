import React, { useState } from 'react';
import InputButton from '../inputs/InputButton';
import InputSelectBox from '../inputs/InputSelectBox';
import type { UserForm, UserFormState } from '../../types/data';
import { InputField } from '../inputs/InputField';

interface BaseFormProps {
  children?: React.ReactElement;
  formData: UserFormState;
  setFormData: React.Dispatch<React.SetStateAction<UserFormState>>;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: UserForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: UserForm }) => void;
}

type FormProps = FormAddProps | FormEditProps;

export const FormUser: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  formData,
  setFormData,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [passConfirm, setPassConfirm] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== passConfirm) {
      setError('Password dan Konfirmasi Password harus sama');
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
      {error && <div className='text-red-600 mb-6'>{error}</div>}
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='name'>Username</label>
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
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='fullname'>Nama</label>
        <InputField
          id='fullname'
          label='Fullname'
          name='fullname'
          value={formData.fullname}
          onChange={handleChange}
          className='col-span-3'
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='email'>Email</label>
        <InputField
          type='email'
          id='email'
          label='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='col-span-3'
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='role'>Role</label>
        <InputSelectBox
          id='role'
          name='role'
          options={[
            { label: 'Administrator', value: '2' },
            { label: 'RKPD', value: '3' },
            { label: 'DAK', value: '4' },
          ]}
          value={(formData as UserForm).role_id?.toString()}
          onChange={(val) =>
            setFormData({ ...(formData as UserForm), role_id: Number(val) })
          }
          defaultOptionLabel='Pilih Role'
          className='col-span-3'
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='password'>Password</label>
        <InputField
          type='password'
          id='password'
          label='Password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          className='col-span-3'
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-2'>
        <label htmlFor='passConfirm'></label>
        <InputField
          type='password'
          id='passConfirm'
          label='Konfirmasi Password'
          name='passConfirm'
          value={passConfirm}
          onChange={e => setPassConfirm(e.target.value)}
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
