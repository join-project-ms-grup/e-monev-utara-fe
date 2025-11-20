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
  getCatatanEvaluasiRKPD,
  updateCatatanEvaluasi,
  updateCatatanEvaluasiRKPD,
  type CatatanForm,
} from '../../services/CatatanService';
import { isEqual } from 'lodash';

interface Props {
  onPreview: () => void;
  setCatatan: React.Dispatch<React.SetStateAction<CatatanForm>>;
  children?: React.ReactElement;
  type: string;
  skpdPerId: number;
}

const FormCatatan = ({
  onPreview,
  children,
  type,
  skpdPerId,
  setCatatan,
}: Props) => {
  const queryClient = useQueryClient();
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { data } = useQuery({
    queryKey: ['catatan', type, skpdPerId],
    queryFn: async () => {
      if (['renstra', 'rpjmd'].includes(type)) {
        return await getCatatanEvaluasi({
          skpd_periode_id: skpdPerId,
          type,
        });
      } else if (['rkpd', 'renja'].includes(type)) {
        return await getCatatanEvaluasiRKPD({
          skpd_periode_id: skpdPerId,
          type,
        });
      }
    },
  });

  const validateWith = (schema: any, value: any) => {
    const input = mapToInputCatatan(value);
    const result = schema.safeParse(input);
    return result.success
      ? { fields: {} }
      : { fields: mapErrorsCatatan(result.error.format()) };
  };

  const initialValue = [
    {
      pendorong: data?.pendorong,
      penghambat: data?.penghambat,
      tl_1: data?.tl_1,
      tl_2: data?.tl_2,
      skpd_periode_id: skpdPerId,
      type: type,
    },
  ];

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
      if (!isEqual([value], initialValue)) {
        updateMutation.mutate(value);
      } else {
        onPreview();
      }
    },
    validators: {
      onChange: ({ value }) => validateWith(catatanSchema, value),
      onSubmit: ({ value }) => validateWith(catatanSchemaSubmit, value),
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: CatatanForm) => {
      setLoadingMutation(true);
      setCatatan(payload);
      if (['renstra', 'rpjmd'].includes(type)) {
        return updateCatatanEvaluasi(payload);
      } else if (['rkpd', 'renja'].includes(type)) {
        return updateCatatanEvaluasiRKPD(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catatan', type, skpdPerId] });
      if (['renstra', 'rpjmd'].includes(type)) {
        queryClient.invalidateQueries({
          queryKey: ['tabel_renstra'],
        });
      } else if (['rkpd', 'renja'].includes(type)) {
        queryClient.invalidateQueries({
          queryKey: ['tabel_rkpd_tahunan'],
        });
      }

      onPreview();
      toast.success('Catatan berhasil diperbarui');
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

  const inputTitleRenstra = [
    'Faktor pendorong pencapaian kinerja',
    'Faktor penghambat',
    'Usulan tindak lanjut pada Renja Perangkat Daerah kabupaten/kota berikutnya',
    'Usulan tindak lanjut pada Renstra Perangkat Daerah kabupaten/kota berikutnya',
  ];

  const inputTitleRpjmd = [
    'Faktor pendorong keberhasilan pencapaian',
    'Faktor penghambat pencapaian kinerja',
    'Tindak lanjut yang diperlukan dalam RKPD kabupaten/kota berikutnya',
    'Tindak lanjut yang diperlukan dalam RPJMD kabupaten/kota berikutnya',
  ];

  const inputTitleRkpd = [
    'Faktor pendorong keberhasilan kinerja',
    'Faktor penghambat pencapaian kinerja',
    'Tindak lanjut yang diperlukan dalam triwulan berikutnya',
    'Tindak lanjut yang diperlukan dalam RKPD berikutnya',
  ];

  const inputTitleRenja = [
    'Faktor pendorong keberhasilan kinerja',
    'Faktor penghambat pencapaian kinerja',
    'Tindak lanjut yang diperlukan dalam triwulan berikutnya*)',
    'indak lanjut yang diperlukan dalam Renja Perangkat Daerah kabupaten/kota berikutnya*)',
  ];

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCatatan({
            pendorong: data?.pendorong,
            penghambat: data?.penghambat,
            tl_1: data?.tl_1,
            tl_2: data?.tl_2,
          });
          form.handleSubmit();
        }}
        className='mx-auto space-y-4'
      >
        <div className='flex flex-col gap-4'>
          <form.Field name='pendorong'>
            {(field) => (
              <div className='flex-1'>
                <label htmlFor='pendorong'>
                  {type === 'renstra'
                    ? inputTitleRenstra[0]
                    : type === 'rpjmd'
                      ? inputTitleRpjmd[0]
                      : type === 'rkpd'
                        ? inputTitleRkpd[0]
                        : inputTitleRenja[0]}
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
                <label htmlFor='penghambat'>
                  {type === 'renstra'
                    ? inputTitleRenstra[1]
                    : type === 'rpjmd'
                      ? inputTitleRpjmd[1]
                      : type === 'rkpd'
                        ? inputTitleRkpd[1]
                        : inputTitleRenja[1]}
                </label>
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
                  {type === 'renstra'
                    ? inputTitleRenstra[2]
                    : type === 'rpjmd'
                      ? inputTitleRpjmd[2]
                      : type === 'rkpd'
                        ? inputTitleRkpd[2]
                        : inputTitleRenja[2]}
                </label>
                <InputTextArea
                  placeholder='Usulan tindak lanjut...'
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
                  {type === 'renstra'
                    ? inputTitleRenstra[3]
                    : type === 'rpjmd'
                      ? inputTitleRpjmd[3]
                      : type === 'rkpd'
                        ? inputTitleRkpd[3]
                        : inputTitleRenja[3]}
                </label>
                <InputTextArea
                  placeholder='Usulan tindak lanjut...'
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
            <InputButton
              className='px-4 bg-green-600'
              isLoading={loadingMutation}
            >
              Lihat Evaluasi<span className='uppercase'>{type}</span>
            </InputButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormCatatan;
