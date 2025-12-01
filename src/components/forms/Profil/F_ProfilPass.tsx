import React from 'react';
import {
  ProfilPassSchema,
  useM_ProfilPass,
  useProfilPassSFData,
} from './FH_Profil';
import { useAppForm } from '../form-context';
import toast from 'react-hot-toast';
import { useStore } from '@tanstack/react-form';

const F_ProfilPass = () => {
  const { initialValues } = useProfilPassSFData();
  const { mutateWithToast, loading } = useM_ProfilPass();
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const payload = {
        password: value.password,
      };

      mutateWithToast(payload, () => {
        form.setFieldValue('password', '')
        form.setFieldValue('passwordConfirm', '')
      });
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: ProfilPassSchema,
    },
  });

const getPass = useStore(form.store, (state) => state.values.password);

  return (
    <div className='space-y-4'>
      <h4>Ubah Password</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='space-y-4'
      >
        <div className='space-y-2'>
          {/* MARK: Field Password */}
          <form.AppField
            name='password'
            children={(field) => (
              <field.TextField
                type='password'
                label='Password'
                placeholder='Password...'
                reqLabel
              />
            )}
          />
          {/* MARK: Field Konfirmasi Password */}
          <form.AppField
            name='passwordConfirm'
            children={(field) => (
              <field.TextField
                type='password'
                label='Konfirmasi Password'
                placeholder='Konfirmasi Password...'
                reqLabel
              />
            )}
          />
        </div>

        <div className='flex justify-end items-end'>
          <form.AppForm>
            <form.SubmitButton isLoading={loading} disable={!getPass}>Simpan</form.SubmitButton>
          </form.AppForm>
        </div>
      </form>
    </div>
  );
};

export default F_ProfilPass;
