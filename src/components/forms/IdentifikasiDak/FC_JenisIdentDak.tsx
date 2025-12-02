import { useStore } from '@tanstack/react-form';
import {
  useListBidangDAK,
  useListOPDDAK,
  useListRekBidangDAK,
  useListRekKegiatanDAK,
  useListRekProgramDAK,
  useListRekSubKegiatanDAK,
  useListRekUrusanDAK,
  useListSubBidangDAK,
  useListSubJenisDAK,
  useListTahunDAK,
} from '../../../hooks/DAK/ListDataDAK';
import { withForm } from '../form-context';
import { initIdentDAKForm } from './FV_IdentDak';
import { getRoleId } from '../../../lib/usercookie';

// FC (FORM CHILD)
export const FC_JenisIdentDak = withForm({
  defaultValues: initIdentDAKForm,
  props: {
    title: '',
  },
  render: function Render({ form, title }) {
    const njenisDAK = useStore(form.store, (state) => state.values.jenis_dak_id);
    const nbidangDAK = useStore(
      form.store,
      (state) => state.values.bidang_dak_id,
    );
    const listSubJenisDAK = useListSubJenisDAK(Number(njenisDAK));
    const listBidangDAK = useListBidangDAK(Number(njenisDAK));
    const listSubBidangDAK = useListSubBidangDAK(Number(nbidangDAK));
    const listTahunDAK = useListTahunDAK();
    const listOPDDAK = useListOPDDAK();

    return (
      <div className='max-w-4xl mx-auto '>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
          {/* MARK: JENIS BIDANG PROGRAM KEGIATAN DAK */}
          <h5 className='whitespace-nowrap mx-3'>{title}</h5>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
        </div>

        <div className='space-y-2 '>
          <div className='grid lg:grid-cols-2 gap-2'>
            {/* MARK: JENIS DAK */}
            <form.AppField
              name='jenis_dak_id'
              listeners={{
                onChange: () => form.setFieldValue('sub_jenis_id', 0),
              }}
              children={(field) => (
                <field.SelectField
                  label='Jenis DAK'
                  placeholder='Pilih Jenis DAK'
                  reqLabel
                  options={[
                    { label: 'Fisik', value: '1' },
                    { label: 'Non-Fisik', value: '2' },
                  ]}
                />
              )}
            />
            {/* MARK: SUB JENIS DAK */}
            <form.AppField
              name='sub_jenis_id'
              listeners={{
                onChange: () => form.setFieldValue('bidang_dak_id', ''),
              }}
              children={(field) => (
                <field.SelectField
                  label='Sub-Jenis DAK'
                  placeholder='Pilih Sub-Jenis DAK'
                  reqLabel
                  options={listSubJenisDAK}
                  disabled={!njenisDAK}
                />
              )}
            />
            {/* MARK: BIDANG DAK */}
            <form.AppField
              name='bidang_dak_id'
              listeners={{
                onChange: () => form.setFieldValue('sub_bidang_id', 0),
              }}
              children={(field) => (
                <field.SelectField
                  label='Bidang DAK'
                  placeholder='Pilih Bidang DAK'
                  reqLabel
                  options={listBidangDAK}
                  disabled={!form.state.values.sub_jenis_id}
                />
              )}
            />
            {/* MARK: SUB BIDANG DAK */}
            <form.AppField
              name='sub_bidang_id'
              children={(field) => (
                <field.SelectField
                  label='Sub-Bidang DAK'
                  placeholder='Pilih Sub-Bidang DAK'
                  reqLabel
                  options={listSubBidangDAK}
                  disabled={!nbidangDAK}
                />
              )}
            />
          </div>
          <div className='grid lg:grid-cols-[1fr_2fr_2fr] gap-2'>
            {/* MARK: TAHUN DAK */}
            <form.AppField
              name='tahun'
              children={(field) => (
                <field.SelectField
                  label='Tahun'
                  placeholder='Pilih Tahun'
                  reqLabel
                  options={listTahunDAK}
                />
              )}
            />
            {/* MARK: OPD DAK */}
            <form.AppField
              name='opd_id'
              children={(field) => (
                <field.SelectField
                  label='OPD'
                  placeholder='Pilih OPD'
                  disabled={getRoleId() === 4}
                  reqLabel
                  options={listOPDDAK}
                />
              )}
            />
            {/* MARK: BIDANG OPD DAK */}
            <form.AppField
              name='bidang_opd'
              children={(field) => (
                <field.TextField
                  label='Bidang OPD'
                  placeholder='Bidang OPD...'
                  reqLabel
                />
              )}
            />
          </div>
          <RekeningSelector form={form} />
        </div>
      </div>
    );
  },
});

const RekeningSelector = withForm({
  defaultValues: initIdentDAKForm,
  render: function Render({ form }) {
    const nidUrusan = useStore(form.store, (state) => state.values.urusan_id);
    const nidBidang = useStore(form.store, (state) => state.values.bidang_id);
    const nidProgram = useStore(
      form.store,
      (state) => state.values.program_id,
    );
    const nidKegiatan = useStore(
      form.store,
      (state) => state.values.kegiatan_id,
    );

    const listRekUrusanDAK = useListRekUrusanDAK();
    const listRekBidangDAK = useListRekBidangDAK(Number(nidUrusan));
    const listRekProgramDAK = useListRekProgramDAK(
      Number(nidUrusan),
      Number(nidBidang),
    );
    const listRekKegiatanDAK = useListRekKegiatanDAK(
      Number(nidUrusan),
      Number(nidBidang),
      Number(nidProgram),
    );
    const listRekSubKegiatanDAK = useListRekSubKegiatanDAK(
      Number(nidUrusan),
      Number(nidBidang),
      Number(nidProgram),
      Number(nidKegiatan),
    );

    return (
      <div className='space-y-2'>
        {/* MARK: REKENING URUSAN */}
        <form.AppField
          name='urusan_id'
          listeners={{
            onChange: () => form.setFieldValue('bidang_id', ''),
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
        {/* MARK: REKENING BIDANG */}
        <form.AppField
          name='bidang_id'
          listeners={{
            onChange: () => form.setFieldValue('program_id', ''),
          }}
          children={(field) => (
            <field.SelectField
              label='Bidang'
              placeholder='Pilih Bidang'
              reqLabel
              options={listRekBidangDAK}
              disabled={!form.state.values.urusan_id}
            />
          )}
        />
        {/* MARK: REKENING PROGRAM */}
        <form.AppField
          name='program_id'
          listeners={{
            onChange: () => form.setFieldValue('kegiatan_id', ''),
          }}
          children={(field) => (
            <field.SelectField
              label='Program'
              placeholder='Pilih Program'
              reqLabel
              options={listRekProgramDAK}
              disabled={!form.state.values.bidang_id}
            />
          )}
        />

        {/* MARK: REKENING KEGIATAN */}
        <form.AppField
          name='kegiatan_id'
          listeners={{
            onChange: () => form.setFieldValue('sub_kegiatan_id', 0),
          }}
          children={(field) => (
            <field.SelectField
              label='Kegiatan'
              placeholder='Pilih Kegiatan'
              reqLabel
              options={listRekKegiatanDAK}
              disabled={!form.state.values.program_id}
            />
          )}
        />

        {/* MARK: REKENING SUB KEGIATAN */}
        <form.AppField
          name='sub_kegiatan_id'
          children={(field) => (
            <field.SelectField
              label='Sub Kegiatan'
              placeholder='Pilih Sub Kegiatan'
              reqLabel
              options={listRekSubKegiatanDAK}
              disabled={!form.state.values.kegiatan_id}
            />
          )}
        />
      </div>
    );
  },
});
