import {
  getMasalahDAK,
  getMonitorMasalahDAK,
} from '../../../../services/DAK/DAKMonitoringService';
import { useQuery } from '@tanstack/react-query';
import {
  SchemaFormMonitorMasalahDak,
  useMonitorMasalahDakFormData,
} from './FV_MonitorMasalahDak';
import { useAppForm } from '../../form-context';
import toast from 'react-hot-toast';
import { useM_MonitorMasalahDAK } from './M_MonitorMasalahDak';
import { useStore } from '@tanstack/react-form';

const F_MonitorMasalahDak = ({
  id_realisasi,
  triwulan,
  onSuccess,
}: {
  id_realisasi: number;
  triwulan: string;
  onSuccess?: () => void;
}) => {
  const { data: dataMasalah } = useQuery({
    queryKey: ['list_masalah_dak'],
    queryFn: async () => {
      const data = await getMasalahDAK(1);
      return data;
    },
  });
  const { data } = useQuery({
    queryKey: ['list_masalah_realisasi_dak'],
    queryFn: async () => {
      const data = await getMonitorMasalahDAK(id_realisasi);
      return data;
    },
    enabled: !!id_realisasi,
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

  const { mutateWithToast, loading } = useM_MonitorMasalahDAK();
  const { initialValues } = useMonitorMasalahDakFormData(data);

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      if (id_realisasi) {
        const payload = {
          id_realisasi: id_realisasi,
          masalah: value.masalah,
          masalah_lain: value.masalah_lain,
          file_masalah: '[]',
        };
        mutateWithToast(payload, () => {
          onSuccess?.();
        });
      }
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: SchemaFormMonitorMasalahDak,
    },
  });

  const valueMasalah = useStore(form.store, (state) => state.values.masalah);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='max-w-2xl mx-auto space-y-4'
      >
        <table className='table-spacing'>
          <tbody>
            <tr>
              <td>Triwulan</td>
              <td>{getTriwulan(Number(triwulan))}</td>
            </tr>
            <tr>
              <td>Masalah</td>
              <td>
                <div className='flex flex-col'>
                  {dataMasalah?.map((item) => {
                    // selalu ambil dari form, bukan dari data awal
                    const currentArr = (() => {
                      try {
                        return JSON.parse(valueMasalah || '[]');
                      } catch {
                        return [];
                      }
                    })();

                    const isChecked = currentArr.includes(item.id);

                    return (
                      <div key={item.id} className='inline-flex gap-2'>
                        <input
                          type='checkbox'
                          id={`masalah_${item.id}`}
                          checked={isChecked}
                          onChange={(e) => {
                            let updated = [...currentArr];

                            if (e.target.checked) {
                              updated.push(item.id);
                            } else {
                              updated = updated.filter((v) => v !== item.id);
                            }

                            form.setFieldValue(
                              'masalah',
                              JSON.stringify(updated),
                            );
                          }}
                        />

                        <label htmlFor={`masalah_${item.id}`}>
                          {item.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <td>Masalah Lain</td>
              <td>
                <form.AppField
                  name='masalah_lain'
                  children={(field) => (
                    <field.TextField label='' placeholder='Masalah Lain...' />
                  )}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className='float-end'>
          <form.AppForm>
            <form.SubmitButton isLoading={loading}>Simpan</form.SubmitButton>
          </form.AppForm>
        </div>
      </form>
    </div>
  );
};

export default F_MonitorMasalahDak;
