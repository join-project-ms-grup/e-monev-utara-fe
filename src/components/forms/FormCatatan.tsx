import React, { useState } from 'react';
import InputButton from '../inputs/InputButton';
import {
  catatanSchema,
  catatanSchemaSubmit,
  mapErrorsCatatan,
  mapToInputCatatan,
} from './schemas/SchemaCatatan';
import { useForm } from '@tanstack/react-form';
import ErrorField from './ErrorField';
import InputTextArea from '../inputs/InputTextArea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../lib/api';
import {
  getCatatanEvaluasi,
  updateCatatanEvaluasi,
  type CatatanForm,
} from '../../services/CatatanService';

interface Props {
  onPreview: () => void;
  setCatatan: React.Dispatch<React.SetStateAction<CatatanForm>>;
  children?: React.ReactElement;
  type: string;
  skpdPerId: number;
}

const FormCatatan = ({ onPreview, children, type, skpdPerId, setCatatan }: Props) => {
  const queryClient = useQueryClient();
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['catatan', type, skpdPerId],
    queryFn: () =>
      getCatatanEvaluasi({
        skpd_periode_id: skpdPerId,
        type: type,
      }),
  });

  const validateWith = (schema: any, value: any) => {
    const input = mapToInputCatatan(value);
    const result = schema.safeParse(input);
    return result.success
      ? { fields: {} }
      : { fields: mapErrorsCatatan(result.error.format()) };
  };

  const form = useForm({
    defaultValues: {
      pendorong: data?.pendorong,
      penghambat: data?.penghambat,
      tl_1: data?.tl_1,
      tl_2: data?.tl_2,
      skpd_periode_id: skpdPerId,
      type: type,
    },
    onSubmit: async ({ value }) => {
      updateMutation.mutate(value);
    },
    validators: {
      onChange: ({ value }) => validateWith(catatanSchema, value),
      onSubmit: ({ value }) => validateWith(catatanSchemaSubmit, value),
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: CatatanForm) => {
      setLoadingMutation(true);
      setCatatan(payload)
      return updateCatatanEvaluasi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catatan', type, skpdPerId] });
      queryClient.invalidateQueries({
        queryKey: ['tabel_renstra', skpdPerId, 5],
      });
      onPreview();
      toast.success('Catatan berhasil ditambahkan');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });

  const inputTitleRenstra = ['Faktor pendorong pencapaian kinerja', 'Faktor penghambat']

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='mx-auto space-y-4'
      >
        <div className='flex flex-col gap-4'>
          <form.Field name='pendorong'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='pendorong'>
                  Faktor pendorong pencapaian kinerja
                </label>
                <InputTextArea
                  placeholder='Faktor pendorong...'
                  id='pendorong'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name='penghambat'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='penghambat'>Faktor penghambat</label>
                <InputTextArea
                  placeholder='Faktor penghambat...'
                  id='penghambat'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name='tl_1'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='tl_1'>
                  Usulan tindak lanjut pada Renja Perangkat Daerah
                  kabupaten/kota berikutnya
                </label>
                <InputTextArea
                  placeholder='Usulan tindak lanjut pada Renja...'
                  id='tl_1'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  invalid={!field.state.meta.isValid}
                />
                <ErrorField field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name='tl_2'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='tl_2'>
                  Usulan tindak lanjut pada Renstra Perangkat Daerah
                  kabupaten/kota berikutnya
                </label>
                <InputTextArea
                  placeholder='Usulan tindak lanjut pada Renstra...'
                  id='tl_2'
                  value={field.state.value}
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
          <div className='float-end'>
            <InputButton className='px-4 bg-green-600' isLoading={loadingMutation}>
              Lihat Evaluasi<span className='uppercase'>{type}</span>
            </InputButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormCatatan;
