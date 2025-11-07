import React from 'react';
import InputButton from '../inputs/InputButton';
import { useForm } from '@tanstack/react-form';
import ErrorField from './ErrorField';
import InputText from '../inputs/InputText';
import type { RealisasiForm } from '../../services/RealisasiService';
import {
  mapErrors,
  mapToInput,
  realisasiSchema,
  realisasiSchemaSubmit,
} from './schemas/SchemaRealisasi';

// #region Types
interface FormProps {
  children?: React.ReactElement;
  defaultValues: RealisasiForm;
  onSubmit: (data: RealisasiForm) => void;
}
// #endregion

const FormRealisasi: React.FC<FormProps> = ({
  children,
  onSubmit,
  defaultValues,
}) => {
  console.log('REALISASI DATA', defaultValues);
  const values = defaultValues;

  // #region Form
  // const validateWith = (schema: any, value: any) => {
  //   const input = mapToInput(value);
  //   const result = schema.safeParse(input);
  //   return result.success
  //     ? { fields: {} }
  //     : { fields: mapErrors(result.error.format()) };
  // };

  // const form = useForm({
  //   defaultValues,
  //   onSubmit: async ({ value }) => {
  //     onSubmit(value);
  //   },
  //   validators: {
  //     onChange: ({ value }) => validateWith(realisasiSchema, value),
  //     onSubmit: ({ value }) => validateWith(realisasiSchemaSubmit, value),
  //   },
  // });
  // #endregion

  return (
    <div className='space-y-4'>
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
          *Total Realisasi Fisik seluruh triwulan KURANG dari target kinerja
          tahun evaluasi (34 Paket).
        </p>
        <p>
          *Total Realisasi Keuangan seluruh bulan KURANG dari anggaran kinerja
          tahun evaluasi (Rp. 178.257.750).
        </p>
      </div>
      <div className='grid grid-cols-3 grid-rows-2 gap-2'>
        <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
          <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Triwulan 1
          </div>
          <div className='grid grid-rows-2 gap-2 px-4 py-4'>
            <InputText Iconlabel='Satuan' id='triCap1' IconlabelPos='right' />
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
            <InputText Iconlabel='Rp' id='triRea1' />
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
          <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Triwulan 2
          </div>
          <div className='grid grid-rows-2 gap-2 px-4 py-4'>
            <InputText Iconlabel='Satuan' id='triCap2' IconlabelPos='right' />
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
            <InputText Iconlabel='Rp' id='triRea2' />
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
          <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Triwulan 3
          </div>
          <div className='grid grid-rows-2 gap-2 px-4 py-4'>
            <InputText Iconlabel='Satuan' id='triCap3' IconlabelPos='right' />
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
            <InputText Iconlabel='Rp' id='triRea3' />
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
          <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Triwulan 4
          </div>
          <div className='grid grid-rows-2 gap-2 px-4 py-4'>
            <InputText Iconlabel='Satuan' id='triCap4' IconlabelPos='right' />
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
            <InputText Iconlabel='Rp' id='triRea4' />
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
            <InputText Iconlabel='Satuan' id='tahunanCap' IconlabelPos='right' />
            <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
              <div
                className='bg-green-600 h-4 rounded-full flex items-center px-2'
                style={{ width: `10%` }}
              >
                <span className='text-white text-xs whitespace-nowrap'>
                  200 %
                </span>
              </div>
            </div>
            <InputText Iconlabel='Rp' id='tahunanRea' />
            <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
              <div
                className='bg-green-600 h-4 rounded-full flex items-center px-2'
                style={{ width: `10%` }}
              >
                <span className='text-white text-xs whitespace-nowrap'>
                  200 %
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='col-start-3 row-start-2 border border-gray-300 bg-gray-100 rounded overflow-hidden'>
          <div className='bg-blue-400 text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Realisasi Kinerja s.d tahun yg dievaluasi
          </div>
          <div className='grid grid-rows-2 gap-2 px-4 py-4'>
            <InputText Iconlabel='Satuan' id='sdCap' IconlabelPos='right' />
            <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
              <div
                className='bg-blue-400 h-4 rounded-full flex items-center px-2'
                style={{ width: `10%` }}
              >
                <span className='text-white text-xs whitespace-nowrap'>
                  200 %
                </span>
              </div>
            </div>
            <InputText Iconlabel='Rp' id='sdRea' />
            <div className='w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
              <div
                className='bg-blue-400 h-4 rounded-full flex items-center px-2'
                style={{ width: `10%` }}
              >
                <span className='text-white text-xs whitespace-nowrap'>
                  200 %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRealisasi;
