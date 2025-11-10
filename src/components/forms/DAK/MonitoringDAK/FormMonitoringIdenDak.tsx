import React from 'react';
import { getMasalahDAK } from '../../../../services/DAK/DAKMonitoringService';
import { useQuery } from '@tanstack/react-query';
import InputText from '../../../inputs/InputText';
import InputButton from '../../../inputs/InputButton';

const FormMonitoringIdenDak = ({ triwulan }: { triwulan: string }) => {
  const { data: dataMasalah } = useQuery({
    queryKey: ['list_masalah_dak'],
    queryFn: async () => {
      const data = await getMasalahDAK(1);
      return data;
    },
  });

  const getTriwulan = (value: number) => {
    switch (value) {
      case 1:
        return 'I';
      case 2:
        return 'II';
      case 3:
        return 'III';
      case 4:
        return 'IV';
      default:
        return '-';
    }
  };

  return (
    <div>
      <table className='table-spacing'>
        <tr>
          <td>Triwulan</td>
          <td>{getTriwulan(Number(triwulan))}</td>
        </tr>
        <tr>
          <td>Masalah</td>
          <td>
            <div className='flex flex-col'>
              {dataMasalah?.map((item) => {
                return (
                  <div key={item.id} className='inline-flex gap-2'>
                    <input type='checkbox' id={`masalah_${item.id}`} />
                    <label htmlFor={`masalah_${item.id}`}>{item.name}</label>
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
        <tr>
          <td>Masalah Lain</td>
          <td>
            <InputText id='masalah_lain' placeholder='Masalah Lain...' />
          </td>
        </tr>
      </table>
      <div className='float-end'>
        <InputButton className='px-4'>Simpan</InputButton>
      </div>
    </div>
  );
};

export default FormMonitoringIdenDak;
