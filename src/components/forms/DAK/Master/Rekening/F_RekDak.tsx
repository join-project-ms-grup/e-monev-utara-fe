import { useAppForm, withForm } from '../../../form-context';
import toast from 'react-hot-toast';
import {
  initDAKRekForm,
  SchemaFormRekDak,
  useRekDakFormData,
  type RekDakForm,
} from './FV_RekDak';
import { useEffect } from 'react';
import {
  useListRekUrusanDAK,
  useListRekBidangDAK,
  useListRekProgramDAK,
  useListRekKegiatanDAK,
} from '../../../../../hooks/DAK/ListDataDAK';
import { useStore } from '@tanstack/react-form';
import { useM_RekDAK } from './M_RekDak';

interface F_RekDakProps {
  data: RekDakForm;
  onSuccess?: () => void;
}

const F_RekDak = ({ data, onSuccess }: F_RekDakProps) => {
  const { mutateWithToast, loading } = useM_RekDAK();
  const { initialValues } = useRekDakFormData(data);

  // Form
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const addPayload = {
        type: value.type,
        parent_id: value.type === 'urusan' ? null : Number(value.parent_id),
        name: value.name,
        kode: value.kode,
      };
      const editPayload = {
        id: value.id,
        name: value.name,
        kode: value.kode,
        status: value.status,
      };

      mutateWithToast(value.id ? editPayload : addPayload, () => {
        onSuccess?.();
      });
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: SchemaFormRekDak,
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='max-w-md mx-auto space-y-4'
      >
        <div className='space-y-4'>
          <form.AppField
            name='kode'
            children={(field) => (
              <field.TextField label='Kode' placeholder='Kode...' reqLabel />
            )}
          />
          <form.AppField
            name='name'
            children={(field) => (
              <field.TextField label='Nama' placeholder='Nama...' reqLabel />
            )}
          />
          {!data.id && <RekeningSelector form={form} />}
        </div>
        <div className='float-end'>
          <form.AppForm>
            <form.SubmitButton isLoading={loading}>Simpan</form.SubmitButton>
          </form.AppForm>
        </div>
      </form>
    </>
  );
};

export default F_RekDak;

const RekeningSelector = withForm({
  defaultValues: initDAKRekForm,
  render: function Render({ form }) {
    const idUrusan = useStore(form.store, (state) => state.values.idUrusan);
    const idBidang = useStore(form.store, (state) => state.values.idBidang);
    const idProgram = useStore(form.store, (state) => state.values.idProgram);
    const idKegiatan = useStore(form.store, (state) => state.values.idKegiatan);
    const typeRek = useStore(form.store, (state) => state.values.type);

    const listRekUrusanDAK = useListRekUrusanDAK();
    const listRekBidangDAK = useListRekBidangDAK(Number(idUrusan));
    const listRekProgramDAK = useListRekProgramDAK(
      Number(idUrusan),
      Number(idBidang),
    );
    const listRekKegiatanDAK = useListRekKegiatanDAK(
      Number(idUrusan),
      Number(idBidang),
      Number(idProgram),
    );

    useEffect(() => {
      let finalParent = '';

      if (idKegiatan) {
        finalParent = idKegiatan;
      } else if (idProgram) {
        finalParent = idProgram;
      } else if (idBidang) {
        finalParent = idBidang;
      } else if (idUrusan) {
        finalParent = idUrusan;
      }

      form.setFieldValue('parent_id', finalParent);
    }, [idUrusan, idBidang, idProgram, idKegiatan]);

    return (
      <div className='space-y-2'>
        {/* MARK: TYPE */}
        <form.AppField
          name='type'
          listeners={{
            onChange: () => form.setFieldValue('idUrusan', ''),
          }}
          children={(field) => (
            <field.SelectField
              label='Rekening'
              placeholder='Pilih Rekening'
              reqLabel
              options={[
                { label: 'Urusan', value: 'urusan' },
                { label: 'Bidang', value: 'bidang' },
                { label: 'Program', value: 'program' },
                { label: 'Kegiatan', value: 'kegiatan' },
                { label: 'Sub Kegiatan', value: 'subKegiatan' },
              ]}
            />
          )}
        />
        {/* MARK: REKENING URUSAN */}
        {['bidang', 'program', 'kegiatan', 'subKegiatan'].includes(
          typeRek ?? '',
        ) && (
          <form.AppField
            name='idUrusan'
            listeners={{
              onChange: () => form.setFieldValue('idBidang', ''),
            }}
            children={(field) => (
              <field.SelectField
                label='Urusan'
                placeholder='Pilih Urusan'
                reqLabel
                options={listRekUrusanDAK}
              />
            )}
          />
        )}
        {/* MARK: REKENING BIDANG */}
        {['program', 'kegiatan', 'subKegiatan'].includes(typeRek ?? '') && (
          <form.AppField
            name='idBidang'
            listeners={{
              onChange: () => form.setFieldValue('idProgram', ''),
            }}
            children={(field) => (
              <field.SelectField
                label='Bidang'
                placeholder='Pilih Bidang'
                reqLabel
                options={listRekBidangDAK}
                disabled={!form.state.values.idUrusan}
              />
            )}
          />
        )}

        {/* MARK: REKENING PROGRAM */}
        {['kegiatan', 'subKegiatan'].includes(typeRek ?? '') && (
          <form.AppField
            name='idProgram'
            listeners={{
              onChange: () => form.setFieldValue('idKegiatan', ''),
            }}
            children={(field) => (
              <field.SelectField
                label='Program'
                placeholder='Pilih Program'
                reqLabel
                options={listRekProgramDAK}
                disabled={!form.state.values.idBidang}
              />
            )}
          />
        )}

        {/* MARK: REKENING KEGIATAN */}
        {['subKegiatan'].includes(typeRek ?? '') && (
          <form.AppField
            name='idKegiatan'
            listeners={{
              onChange: () => form.setFieldValue('idSubKegiatan', ''),
            }}
            children={(field) => (
              <field.SelectField
                label='Kegiatan'
                placeholder='Pilih Kegiatan'
                reqLabel
                options={listRekKegiatanDAK}
                disabled={!form.state.values.idProgram}
              />
            )}
          />
        )}
      </div>
    );
  },
});
