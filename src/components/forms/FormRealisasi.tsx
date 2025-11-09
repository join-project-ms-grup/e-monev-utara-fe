import React from 'react';
import InputButton from '../inputs/InputButton';
import { useForm } from '@tanstack/react-form';
import ErrorField from './ErrorField';
import InputText from '../inputs/InputText';
import type { RealisasiFormRKPD } from '../../services/RealisasiService';
import { formatUang } from '../../lib/helper';
import {
  mapErrors,
  mapToInput,
  realisasiRKPDSchema,
  realisasiRKPDSchemaSubmit,
} from './schemas/SchemaRealisasiRKPD';

// #region Types
interface FormProps {
  children?: React.ReactElement;
  defaultValues: RealisasiFormRKPD;
  onSubmit: (data: RealisasiFormRKPD) => void;
}
// #endregion

const FormRealisasi: React.FC<FormProps> = ({
  children,
  onSubmit,
  defaultValues,
}) => {
  const values = defaultValues;

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
      onSubmit(value);
    },
    validators: {
      onChange: ({ value }) => validateWith(realisasiRKPDSchema, value),
      onSubmit: ({ value }) => validateWith(realisasiRKPDSchemaSubmit, value),
    },
  });
  // #endregion

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className='space-y-4'
    >
      <div>
        <div className='table-responsive'>
          <table className='w-full'>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Sub Kegiatan</th>
                <th>Indikator</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{values.rekening_kode}</td>
                <td>{values.rekening_name}</td>
                <td>{values.indikator_name}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='bg-gray-100 p-2 rounded'>
          <p>
            *Total Realisasi Fisik seluruh triwulan{' '}
            <span
              style={{
                fontWeight: 'bold',
                color:
                  (values.total_capaian ?? 0) < (values.target ?? 0)
                    ? 'red'
                    : 'green',
              }}
            >
              {(values.total_capaian ?? 0) < (values.target ?? 0)
                ? 'KURANG'
                : 'LEBIH'}
            </span>{' '}
            dari target kinerja tahun evaluasi ({values.target ?? 0}).
          </p>
          <p>
            *Total Realisasi Keuangan seluruh bulan{' '}
            <span
              style={{
                fontWeight: 'bold',
                color:
                  (values.total_anggaran ?? 0) < (values.target_anggaran ?? 0)
                    ? 'red'
                    : 'green',
              }}
            >
              {(values.total_anggaran ?? 0) < (values.target_anggaran ?? 0)
                ? 'KURANG'
                : 'LEBIH'}
            </span>{' '}
            dari anggaran kinerja tahun evaluasi (
            {formatUang(values.target_anggaran ?? 0)}).
          </p>
        </div>
        <div className='grid grid-cols-3 grid-rows-2 gap-2'>
          {/* Triwulan 1 */}
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Triwulan 1
            </div>
            <div className='grid grid-rows-2 gap-2 px-4 py-4'>
              <form.Field name='capaian_1'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      inputMode='numeric'
                      Iconlabel={values.satuan} disabled={!(form.getFieldValue('id_rincian'))}
                      IconlabelPos='right'
                      isRibu
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
              <form.Field name='realisasi_1'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      Iconlabel='Rp.'
                      inputMode='numeric'
                      isRibu
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            {/* Triwulan 2 */}
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Triwulan 2
            </div>
            <div className='grid grid-rows-2 gap-2 px-4 py-4'>
              <form.Field name='capaian_2'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      Iconlabel={values.satuan} disabled={!(form.getFieldValue('id_rincian'))}
                      IconlabelPos='right'
                      inputMode='numeric'
                      isRibu
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
              <form.Field name='realisasi_2'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      Iconlabel='Rp.'
                      inputMode='numeric'
                      isRibu
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            {/* Triwulan 3 */}
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Triwulan 3
            </div>
            <div className='grid grid-rows-2 gap-2 px-4 py-4'>
              <form.Field name='capaian_3'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      Iconlabel={values.satuan} disabled={!(form.getFieldValue('id_rincian'))}
                      IconlabelPos='right'
                      inputMode='numeric'
                      isRibu
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2 relative'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
              <form.Field name='realisasi_3'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      Iconlabel='Rp.'
                      value={field.state.value}
                      inputMode='numeric'
                      isRibu
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            {/* Triwulan 4 */}
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Triwulan 4
            </div>
            <div className='grid grid-rows-2 gap-2 px-4 py-4'>
              <form.Field name='capaian_4'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      Iconlabel={values.satuan} disabled={!(form.getFieldValue('id_rincian'))}
                      IconlabelPos='right'
                      inputMode='numeric'
                      isRibu
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
              <form.Field name='realisasi_4'>
                {(field) => (
                  <div className='flex-1'>
                    <InputText
                      Iconlabel='Rp.'
                      value={field.state.value}
                      inputMode='numeric'
                      isRibu
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-[var(--color-2)] h-4 rounded-full flex items-center px-2'
                  style={{ width: `10%` }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    200 %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='col-start-3 row-start-1 border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            <div className='bg-green-600 text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Realisasi Kinerja Tahunan yg dievaluasi
            </div>
            <div className='grid grid-rows-2 gap-2 px-4 py-4'>
              <InputText
                Iconlabel={values.satuan}
                id='tahunanCap'
                IconlabelPos='right'
                value={values.total_capaian ?? 0}
                inputMode='numeric'
                isRibu
                disabled
                readOnly
              />
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-green-600 h-4 rounded-full flex items-center px-2'
                  style={{
                    width: `${(values.total_capaian ?? 0) < 100 ? values.total_capaian : 100}%`,
                  }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    {values.persen_capaian ?? 0}
                    {` %`}
                  </span>
                </div>
              </div>
              <InputText
                Iconlabel='Rp.'
                id='tahunanRea'
                value={values.total_anggaran ?? 0}
                inputMode='numeric'
                isRibu
                disabled
                readOnly
              />
              <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
                <div
                  className='bg-green-600 h-4 rounded-full flex items-center px-2'
                  style={{
                    width: `${(values.persen_anggaran ?? 0) < 100 ? values.persen_anggaran : 100}%`,
                  }}
                >
                  <span className='text-white text-xs whitespace-nowrap'>
                    {values.persen_anggaran}
                    {` %`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='col-start-3 flex items-end'>
            <InputButton className='w-full' type='submit'>
              Simpan
            </InputButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormRealisasi;
