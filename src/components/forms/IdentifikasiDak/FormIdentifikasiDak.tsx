import { useState } from 'react';
import AksiButton from '../../inputs/AksiButton';
import { MdArrowBack } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import {
  addIdentifikasiDAK,
  type IdentifikasiDAKForm,
  type IdentifikasiDAKFormSubmit,
} from '../../../services/DAK/DAKIdentifikasiService';
import { useForm, useStore } from '@tanstack/react-form';
import {
  useListSubJenisDAK,
  useListBidangDAK,
  useListSubBidangDAK,
  useListTahunDAK,
  useListOPDDAK,
  useListRekUrusanDAK,
  useListRekBidangDAK,
  useListRekProgramDAK,
  useListRekKegiatanDAK,
  useListRekSubKegiatanDAK,
} from '../../../hooks/DAK/ListDataDAK';
import InputSearchBox from '../../inputs/InputSearchBox';
import InputText from '../../inputs/InputText';
import ErrorField from '../ErrorField';
import InputFile from '../../inputs/InputFile';
import InputTextArea from '../../inputs/InputTextArea';
import {
  identifikasidakSchema,
  identifikasidakSchemaSubmit,
  mapErrors,
  mapToInput,
} from '../schemas/DAK/SchemaIdentifikasiDak';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../lib/api';
import { debounce } from 'lodash';

interface Props {
  onBack: () => void;
}

const FormIdentifikasiDak = ({ onBack }: Props) => {
  const initialFormData: IdentifikasiDAKForm = {
    // non payload
    n_jenisDAK: '',
    n_bidangDAK: '',
    n_idUrusan: '',
    n_idBidang: '',
    n_idProgram: '',
    n_idKegiatan: '',
    // payload
    sub_jenis_id: 0,
    sub_bidang_id: 0,
    tahun: 0,
    opd_id: 0,
    bidang_opd: '',
    sub_kegiatan_id: 0,
    catatan: '',
    nama_paket: '',
    detail_paket: '',
    volume: 0,
    satuan: '',
    estimasi: '',
    jumlah_penerima: '',
    anggaran: 0,
    des_kel: '',
    kec: '',
    bujur: ['0', '0', '0'],
    lintang: ['0', '0', '0'],
    foto: null,
    mekanisme: 'swakelola',
    metode: '',
    volume_mekanisme: 0,
    uang_mekanisme: 0,
    dokumen: Array.from({ length: 12 }, (_, i) => ({
      id_berkas: i + 1,
      file: null,
      Waktu: null,
      Keterangan: null,
    })),
  };

  const [formData, setFormData] = useState(initialFormData);

  // #region Form
  const debouncedValidate = debounce((value) => {
    return validateWith(identifikasidakSchema, value);
  }, 300);

  const validateWith = (schema: any, value: any) => {
    const input = mapToInput(value);
    const result = schema.safeParse(input);
    return result.success
      ? { fields: {} }
      : { fields: mapErrors(result.error.format()) };
  };

  const form = useForm({
    defaultValues: formData,
    onSubmit: async ({ value }) => {
      addMutation.mutate({
        sub_jenis_id: value.sub_jenis_id,
        sub_bidang_id: value.sub_bidang_id,
        tahun: value.tahun,
        opd_id: value.opd_id,
        bidang_opd: value.bidang_opd,
        sub_kegiatan_id: value.sub_kegiatan_id,
        catatan: value.catatan,
        nama_paket: value.nama_paket,
        detail_paket: value.detail_paket,
        volume: value.volume,
        satuan: value.satuan,
        estimasi: value.estimasi,
        jumlah_penerima: value.jumlah_penerima,
        anggaran: value.anggaran,
        des_kel: value.des_kel,
        kec: value.kec,
        bujur: `[${value.bujur[0]},${value.bujur[1]},${value.bujur[2]}]`,
        lintang: `[${value.lintang[0]},${value.lintang[1]},${value.lintang[2]}]`,
        foto: null,
        mekanisme: value.mekanisme,
        metode: value.metode,
        volume_mekanisme: value.volume_mekanisme,
        uang_mekanisme: value.uang_mekanisme,
        dokumen: value.dokumen
      });
      console.log('IDENTIFIKASI FORM', value);
    },
    onSubmitInvalid: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      // onChange: ({ value }) => validateWith(identifikasidakSchema, value),
      onChange: ({ value }) => debouncedValidate(value),
      onSubmit: ({ value }) => validateWith(identifikasidakSchemaSubmit, value),
    },
  });
  const formValues = useStore(form.store).values;
  // #endregion

  //#region JENIS BIDANG PROGRAM KEGIATAN DAK
  const listSubJenisDAK = useListSubJenisDAK(Number(formValues.n_jenisDAK));
  const listBidangDAK = useListBidangDAK();
  const listSubBidangDAK = useListSubBidangDAK(Number(formValues.n_bidangDAK));
  const listTahunDAK = useListTahunDAK();
  const listOPDDAK = useListOPDDAK();

  const listRekUrusanDAK = useListRekUrusanDAK();
  const listRekBidangDAK = useListRekBidangDAK(Number(formValues.n_idUrusan));
  const listRekProgramDAK = useListRekProgramDAK(
    Number(formValues.n_idUrusan),
    Number(formValues.n_idBidang),
  );
  const listRekKegiatanDAK = useListRekKegiatanDAK(
    Number(formValues.n_idUrusan),
    Number(formValues.n_idBidang),
    Number(formValues.n_idProgram),
  );
  const listRekSubKegiatanDAK = useListRekSubKegiatanDAK(
    Number(formValues.n_idUrusan),
    Number(formValues.n_idBidang),
    Number(formValues.n_idProgram),
    Number(formValues.n_idKegiatan),
  );
  //#endregion

  const listDokName = [
    { kode: 0, name: 'PERENCANAAN' },
    { kode: 1, name: 'PMK (Alokasi dan Pedoman Umum)' },
    { kode: 2, name: 'Petunjuk Teknis (Juknis)' },
    { kode: 3, name: 'Penyusunan Rencana Kerja dan Anggaran SKPD' },
    { kode: 4, name: 'Penetapan DPA - SKPD' },
    { kode: 0, name: 'PELAKSANAAN' },
    { kode: 5, name: 'SK Penetapan Pelaksanaan Kegiatan' },
    { kode: 6, name: 'Pelaksanaan Tender Pekerjaan Kontrak' },
    { kode: 7, name: 'Persiapan Pekerjaan Swakelola' },
    { kode: 8, name: 'Pelaksanaan Pekerjaan Kontrak' },
    { kode: 9, name: 'Pelaksanaan Pekerjaan Swakelola' },
    { kode: 10, name: 'Penerbitan Surat Permintaan Pembayaran (SPP)' },
    { kode: 11, name: 'Penerbitan Surat Perintah Membayar (SPM)' },
    { kode: 12, name: 'Penerbitan Surat Perintah Pencairan Dana (SP2D)' },
  ];

  //#region MUTASI
  const queryClient = useQueryClient();
  const [loadingMutation, setLoadingMutation] = useState(false);
  const addMutation = useMutation({
    mutationFn: async (payload: IdentifikasiDAKFormSubmit) => {
      setLoadingMutation(true);
      // return console.log(payload);
      return addIdentifikasiDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_identifikasi_dak'] });
      setFormData(initialFormData);
      onBack();
      toast.success('Data berhasil ditambahkan');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  //#endregion

  return (
    <div className='w-full mx-auto'>
      <div className='inline-flex items-center gap-2'>
        <AksiButton
          Icon={MdArrowBack}
          className='hover:bg-[var(--color-2)]!'
          onClick={onBack}
          tooltip='Kembali'
        />
        <span className='font-bold'>
          Tambah Data Identifikasi DAK Kabupaten / Kota
        </span>
      </div>
      <br />
      <br />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='space-y-2'
      >
        <div className='space-y-8'>
          {/* MARK: JENIS BIDANG PROGRAM KEGIATAN DAK */}
          <div className='max-w-4xl mx-auto '>
            <div className='flex items-center justify-center mb-4'>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
              <h5 className='whitespace-nowrap mx-3'>
                Jenis, Bidang, Program & Kegiatan DAK
              </h5>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
            </div>

            <div className='space-y-2 '>
              <div className='grid lg:grid-cols-2 gap-2'>
                {/* MARK: JENIS DAK */}
                <form.Field name='n_jenisDAK'>
                  {(field) => (
                    <div>
                      <label htmlFor='n_jenisDAK'>
                        Jenis DAK{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='n_jenisDAK'
                        className='h-9'
                        btnclassName='bg-white'
                        options={[
                          { label: 'Fisik', value: '1' },
                          { label: 'Non-Fisik', value: '2' },
                        ]}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e);
                          form.setFieldValue('sub_jenis_id', 0);
                        }}
                        onClear={() => {
                          field.handleChange('');
                          form.setFieldValue('sub_jenis_id', 0);
                        }}
                        invalid={!field.state.meta.isValid}
                        placeholder='Pilih Sub-Jenis DAK'
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>

                {/* MARK: SUB JENIS DAK */}
                <form.Field name='sub_jenis_id'>
                  {(field) => (
                    <div>
                      <label htmlFor='sub_jenis_id'>
                        Sub-Jenis DAK{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='subJenisDak'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listSubJenisDAK}
                        disabled={!formValues.n_jenisDAK}
                        placeholder='Pilih Sub-Jenis DAK'
                        value={field.state.value.toString()}
                        onChange={(e) => field.handleChange(Number(e))}
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
                {/* MARK: BIDANG DAK */}
                <form.Field name='n_bidangDAK'>
                  {(field) => (
                    <div>
                      <label htmlFor='n_bidangDAK'>
                        Bidang DAK{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='n_bidangDAK'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listBidangDAK}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e)}
                        onClear={() => {
                          field.handleChange('');
                          form.setFieldValue('sub_bidang_id', 0);
                        }}
                        invalid={!field.state.meta.isValid}
                        placeholder='Pilih Bidang DAK'
                        withSearch
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
                {/* MARK: SUB BIDANG DAK */}
                <form.Field name='sub_bidang_id'>
                  {(field) => (
                    <div>
                      <label htmlFor='sub_bidang_id'>
                        Sub-Bidang DAK{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='sub_bidang_id'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listSubBidangDAK}
                        value={field.state.value.toString()}
                        onChange={(e) => field.handleChange(Number(e))}
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                        disabled={!formValues.n_bidangDAK}
                        placeholder='Pilih Sub-Bidang DAK'
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div className='grid lg:grid-cols-[1fr_2fr_2fr] gap-2'>
                {/* MARK: TAHUN DAK */}
                <form.Field name='tahun'>
                  {(field) => (
                    <div>
                      <label htmlFor='tahun'>
                        Tahun{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='tahun'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listTahunDAK}
                        value={field.state.value.toString()}
                        onChange={(e) => field.handleChange(Number(e))}
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                        placeholder='Pilih Tahun'
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
                {/* MARK: OPD DAK */}
                <form.Field name='opd_id'>
                  {(field) => (
                    <div>
                      <label htmlFor='opd_id'>
                        OPD{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='opd_id'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listOPDDAK}
                        value={field.state.value.toString()}
                        onChange={(e) => field.handleChange(Number(e))}
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                        placeholder='Pilih OPD'
                        withSearch
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
                {/* MARK: BIDANG OPD DAK */}
                <form.Field name='bidang_opd'>
                  {(field) => (
                    <div>
                      <label htmlFor='bidang_opd'>
                        Bidang OPD{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='bidang_opd'
                        placeholder='Bidang OPD...'
                        value={field.state.value.toString()}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onClear={() => field.handleChange('')}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div className='space-y-2'>
                {/* MARK: REKENING URUSAN */}
                <form.Field name='n_idUrusan'>
                  {(field) => (
                    <div>
                      <label htmlFor='n_idUrusan'>
                        Urusan{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='n_idUrusan'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listRekUrusanDAK}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e);
                          form.setFieldValue('n_idBidang', '');
                          form.setFieldValue('n_idProgram', '');
                          form.setFieldValue('n_idKegiatan', '');
                        }}
                        onClear={() => {
                          field.handleChange('');
                          form.setFieldValue('n_idBidang', '');
                          form.setFieldValue('n_idProgram', '');
                          form.setFieldValue('n_idKegiatan', '');
                        }}
                        invalid={!field.state.meta.isValid}
                        withSearch
                        placeholder='Pilih Urusan'
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>

                {/* MARK: REKENING BIDANG */}
                <form.Field name='n_idBidang'>
                  {(field) => (
                    <div>
                      <label htmlFor='n_idBidang'>
                        Bidang{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='n_idBidang'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listRekBidangDAK}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e);
                          form.setFieldValue('n_idProgram', '');
                          form.setFieldValue('n_idKegiatan', '');
                        }}
                        onClear={() => {
                          field.handleChange('');
                          form.setFieldValue('n_idProgram', '');
                          form.setFieldValue('n_idKegiatan', '');
                          form.setFieldValue('sub_kegiatan_id', 0);
                        }}
                        invalid={!field.state.meta.isValid}
                        withSearch
                        placeholder='Pilih Bidang'
                        disabled={!formValues.n_idUrusan}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
                {/* MARK: REKENING PROGRAM */}
                <form.Field name='n_idProgram'>
                  {(field) => (
                    <div>
                      <label htmlFor='program'>
                        Program{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='program'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listRekProgramDAK}
                        withSearch
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e);
                          form.setFieldValue('n_idKegiatan', '');
                          form.setFieldValue('sub_kegiatan_id', 0);
                        }}
                        onClear={() => {
                          field.handleChange('');
                          form.setFieldValue('n_idKegiatan', '');
                          form.setFieldValue('sub_kegiatan_id', 0);
                        }}
                        invalid={!field.state.meta.isValid}
                        placeholder='Pilih Program'
                        disabled={!formValues.n_idBidang}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>

                {/* MARK: REKENING KEGIATAN */}
                <form.Field name='n_idKegiatan'>
                  {(field) => (
                    <div>
                      <label htmlFor='n_idKegiatan'>
                        Kegiatan{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='n_idKegiatan'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listRekKegiatanDAK}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e);
                          form.setFieldValue('sub_kegiatan_id', 0);
                        }}
                        onClear={() => {
                          field.handleChange('');
                          form.setFieldValue('sub_kegiatan_id', 0);
                        }}
                        invalid={!field.state.meta.isValid}
                        withSearch
                        placeholder='Pilih Kegiatan'
                        disabled={!formValues.n_idProgram}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>

                {/* MARK: REKENING SUB KEGIATAN */}
                <form.Field name='sub_kegiatan_id'>
                  {(field) => (
                    <div>
                      <label htmlFor='sub_kegiatan_id'>
                        Sub Kegiatan{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='sub_kegiatan_id'
                        className='h-9'
                        btnclassName='bg-white'
                        options={listRekSubKegiatanDAK}
                        value={field.state.value.toString()}
                        onChange={(e) => field.handleChange(Number(e))}
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                        withSearch
                        placeholder='Pilih Sub Kegiatan'
                        disabled={!formValues.n_idKegiatan}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </div>
          {/* MARK: DETAIL DAK */}
          <div className='max-w-4xl mx-auto '>
            <div className='flex items-center justify-center mb-4'>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
              <h5 className='whitespace-nowrap mx-3'>Detail DAK</h5>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
            </div>

            <div className='space-y-2'>
              {/* MARK: NAMA PAKET */}
              <form.Field name='nama_paket'>
                {(field) => (
                  <div>
                    <label htmlFor='nama_paket'>
                      Nama Paket{' '}
                      <code className='text-red-500 text-xs align-text-top'>
                        (*)
                      </code>
                    </label>
                    <InputText
                      id='nama_paket'
                      placeholder='Nama Paket...'
                      value={field.state.value.toString()}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onClear={() => field.handleChange('')}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              {/* MARK: DETAIL PAKET */}
              <form.Field name='detail_paket'>
                {(field) => (
                  <div>
                    <label htmlFor='detail_paket'>
                      Detail Paket{' '}
                      <code className='text-red-500 text-xs align-text-top'>
                        (*)
                      </code>
                    </label>
                    <InputTextArea
                      id='detail_paket'
                      placeholder='Detail Paket...'
                      value={field.state.value.toString()}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onClear={() => field.handleChange('')}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
              <div className='grid grid-cols-3 gap-2'>
                {/* MARK: VOLUME */}
                <form.Field name='volume'>
                  {(field) => (
                    <div>
                      <label htmlFor='volume'>
                        Volume{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='volume'
                        placeholder='Volume...'
                        isRibu
                        inputMode='numeric'
                        value={field.state.value.toString()}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>

                {/* MARK: SATUAN */}
                <form.Field name='satuan'>
                  {(field) => (
                    <div>
                      <label htmlFor='satuan'>
                        Satuan{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='satuan'
                        placeholder='Satuan...'
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onClear={() => field.handleChange('')}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>

                {/* MARK: ESTIMASI */}
                <form.Field name='estimasi'>
                  {(field) => (
                    <div>
                      <label htmlFor='waktu'>
                        Estimasi Waktu{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='waktu'
                        placeholder='Estimasi Waktu...'
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onClear={() => field.handleChange('')}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div className='grid grid-cols-[1fr_2fr] gap-2'>
                {/* MARK: JUMLAH PENERIMA MANFAAT */}
                <form.Field name='jumlah_penerima'>
                  {(field) => (
                    <div>
                      <label htmlFor='penerima'>
                        Jumlah Penerima Manfaat{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='penerima'
                        placeholder='Jumlah Penerima Manfaat...'
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onClear={() => field.handleChange('')}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
                {/* MARK: ANGGARAN */}
                <form.Field name='anggaran'>
                  {(field) => (
                    <div>
                      <label htmlFor='anggaran'>
                        Anggaran DAK{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='anggaran'
                        placeholder='Anggaran DAK...'
                        Iconlabel='Rp.'
                        isRibu
                        inputMode='numeric'
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              {/* MARK: DESA KELURAHAN */}
              <form.Field name='des_kel'>
                {(field) => (
                  <div>
                    <label htmlFor='des_kel'>
                      Desa / Kelurahan{' '}
                      <code className='text-red-500 text-xs align-text-top'>
                        (*)
                      </code>
                    </label>
                    <InputText
                      id='des_kel'
                      placeholder='Desa / Kelurahan...'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onClear={() => field.handleChange('')}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>

              {/* MARK: KECAMATAN */}
              <form.Field name='kec'>
                {(field) => (
                  <div>
                    <label htmlFor='kec'>
                      Kecamatan{' '}
                      <code className='text-red-500 text-xs align-text-top'>
                        (*)
                      </code>
                    </label>
                    <InputText
                      id='kec'
                      placeholder='Kecamatan...'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onClear={() => field.handleChange('')}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>

              {/* MARK: BUJUR */}
              <form.Field name='bujur'>
                {(field) => {
                  const value = field.state.value || [0, 0, 0];
                  const handleChange = (index: number, val: string) => {
                    const newValue = [...value];
                    newValue[index] = val;
                    field.handleChange(newValue);
                  };

                  return (
                    <div>
                      <label htmlFor='bujur'>Bujur</label>
                      <div className='grid grid-cols-3 gap-2'>
                        <div className='inline-flex'>
                          <InputText
                            id='bujur[0]'
                            placeholder='Drj...'
                            Iconlabel='°'
                            IconlabelPos='right'
                            inputMode='numeric'
                            value={value[0]}
                            onChange={(e) => handleChange(0, e.target.value)}
                            onClear={() => handleChange(0, '0')}
                            invalid={!field.state.meta.isValid}
                          />
                        </div>
                        <div className='inline-flex'>
                          <InputText
                            id='bujur[1]'
                            placeholder='Mn...'
                            Iconlabel="'"
                            IconlabelPos='right'
                            inputMode='numeric'
                            value={value[1]}
                            onChange={(e) => handleChange(1, e.target.value)}
                            onClear={() => handleChange(1, '0')}
                            invalid={!field.state.meta.isValid}
                          />
                        </div>
                        <div className='inline-flex'>
                          <InputText
                            id='bujur[2]'
                            placeholder='Dt...'
                            Iconlabel="''"
                            IconlabelPos='right'
                            inputMode='numeric'
                            value={value[2]}
                            onChange={(e) => handleChange(2, e.target.value)}
                            onClear={() => handleChange(2, '0')}
                            invalid={!field.state.meta.isValid}
                          />
                        </div>
                      </div>
                      <ErrorField field={field} />
                    </div>
                  );
                }}
              </form.Field>

              {/* MARK: LINTANG */}
              <form.Field name='lintang'>
                {(field) => {
                  const value = field.state.value || [0, 0, 0];
                  const handleChange = (index: number, val: string) => {
                    const newValue = [...value];
                    newValue[index] = val;
                    field.handleChange(newValue);
                  };

                  return (
                    <div>
                      <label htmlFor='lintang'>Lintang</label>
                      <div className='grid grid-cols-3 gap-2'>
                        <div className='inline-flex'>
                          <InputText
                            id='lintang1'
                            placeholder='Drj...'
                            Iconlabel={`°`}
                            IconlabelPos='right'
                            inputMode='numeric'
                            value={value[0]}
                            onChange={(e) => handleChange(0, e.target.value)}
                            onClear={() => handleChange(0, '0')}
                            invalid={!field.state.meta.isValid}
                          />
                        </div>
                        <div className='inline-flex'>
                          <InputText
                            id='lintang2'
                            placeholder='Mn...'
                            Iconlabel={`'`}
                            IconlabelPos='right'
                            value={value[1]}
                            onChange={(e) => handleChange(1, e.target.value)}
                            onClear={() => handleChange(1, '0')}
                            invalid={!field.state.meta.isValid}
                          />
                        </div>
                        <div className='inline-flex'>
                          <InputText
                            id='lintang3'
                            placeholder='Dt...'
                            Iconlabel={`''`}
                            IconlabelPos='right'
                            inputMode='numeric'
                            value={value[2]}
                            onChange={(e) => handleChange(2, e.target.value)}
                            onClear={() => handleChange(2, '0')}
                            invalid={!field.state.meta.isValid}
                          />
                        </div>
                      </div>
                      <ErrorField field={field} />
                    </div>
                  );
                }}
              </form.Field>

              {/* MARK: FOTO KEGIATAN */}
              <form.Field name='foto'>
                {(field) => (
                  <div>
                    <label htmlFor='foto'>Foto Kegiatan</label>
                    <InputFile
                      id='foto'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        field.handleChange(file);
                      }}
                      onClear={() => field.handleChange(null)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          {/* MARK: CATATAN MEKANISME PELAKSANAAN */}
          <div className='max-w-4xl mx-auto '>
            <div className='flex items-center mb-4'>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
              <h5 className='whitespace-nowrap mx-3'>
                Catatan & Mekanisme Pelaksanaan
              </h5>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
            </div>

            <div className='space-y-2'>
              {/* MARK: CATATAN */}
              <form.Field name='catatan'>
                {(field) => (
                  <div>
                    <label htmlFor='catatan'>
                      Catatan{' '}
                      <code className='text-red-500 text-xs align-text-top'>
                        (*)
                      </code>
                    </label>
                    <InputTextArea
                      id='catatan'
                      placeholder='Catatan...'
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onClear={() => field.handleChange('')}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>

              <div className='grid grid-cols-3 gap-2'>
                {/* MEKANISME PEMBAYARAN */}
                <form.Field name='mekanisme'>
                  {(field) => (
                    <div>
                      <label htmlFor='mekanisme'>
                        Mekanisme{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputSearchBox
                        id='mekanisme'
                        placeholder='Pilih Mekanisme'
                        className='h-9'
                        options={[
                          { label: 'Swakelola', value: 'swakelola' },
                          { label: 'Kontrak', value: 'kontrak' },
                          { label: 'eKatalog', value: 'ekatalog' },
                        ]}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e)}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
                {/* MARK: MEKANISME VOLUME */}
                <form.Field name='volume_mekanisme'>
                  {(field) => (
                    <div>
                      <label htmlFor='volume_mekanisme'>
                        Volume{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='volume_mekanisme'
                        placeholder='Volume...'
                        isRibu
                        inputMode='numeric'
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>

                {/* MARK: MEKANISME UANG */}
                <form.Field name='uang_mekanisme'>
                  {(field) => (
                    <div>
                      <label htmlFor='uang_mekanisme'>
                        Uang{' '}
                        <code className='text-red-500 text-xs align-text-top'>
                          (*)
                        </code>
                      </label>
                      <InputText
                        id='uang_mekanisme'
                        placeholder='Uang...'
                        Iconlabel='Rp.'
                        isRibu
                        inputMode='numeric'
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onClear={() => field.handleChange(0)}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              {/* MARK: MEKANISME METODE */}
              <form.Field name='metode'>
                {(field) => (
                  <div>
                    <label htmlFor='metode'>
                      Metode Pembayaran{' '}
                      <code className='text-red-500 text-xs align-text-top'>
                        (*)
                      </code>
                    </label>
                    <InputText
                      id='metode'
                      placeholder='Metode pembayaran...'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onClear={() => field.handleChange('')}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          {/* NARK: CHECKLIST DOKUMEN KEGIATAN */}
          <div>
            <div className='flex items-center mb-4'>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
              <h5 className='whitespace-nowrap mx-3'>
                Checklist Dokumen dan Kegiatan Pelaksanaan
              </h5>
              <div className='flex-grow h-px bg-[var(--color-3)]'></div>
            </div>
            <i className='opacity-75'>
              *Maks. @File Upload <b>98 MB</b>- File yang diijinkan:{' '}
              <b>doc, docx, xls, xlsx, pdf</b>
            </i>

            <div className='table-responsive'>
              <table className='w-full'>
                <thead>
                  <tr>
                    <th>Kode Berkas</th>
                    <th>Checklist</th>
                    <th>Berkas</th>
                    <th>Kesesuaian</th>
                    <th>Waktu</th>
                    <th>Keterangan</th>
                    <th>Pesan Verifikasi</th>
                    <th>Tanggal & Jam Upload</th>
                  </tr>
                </thead>

                <tbody>
                  {/* MARK: 12 DOKUMEN */}
                  {listDokName.map((dok, index) => {
                    if (dok.kode === 0) {
                      return (
                        <tr key={`${index}_${dok.kode}`}>
                          <td></td>
                          <td colSpan={7}>
                            <b>{dok.name}</b>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={`${index}_${dok.kode}`}>
                        <td className='text-center'>{dok.kode}</td>
                        <td>
                          <b>{dok.name}</b>
                        </td>
                        <td>
                          <form.Field name={`dokumen[${dok.kode - 1}].file`}>
                            {(field) => (
                              <div>
                                <InputFile
                                  tooltip
                                  id={`dokumen[${dok.kode - 1}].file`}
                                  accept='.doc,.docx,.xls,.xlsx,.pdf'
                                  wrapperClassname='w-[200px]!'
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    field.handleChange(file);
                                  }}
                                  invalid={!field.state.meta.isValid}
                                />
                                <ErrorField field={field} />
                              </div>
                            )}
                          </form.Field>
                        </td>
                        <td></td>
                        <td>
                          <form.Field name={`dokumen[${dok.kode - 1}].Waktu`}>
                            {(field) => (
                              <div>
                                <InputTextArea
                                  id={`dokumen[${dok.kode - 1}].Waktu`}
                                  placeholder='Waktu...'
                                  value={field.state.value ?? ''}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onClear={() => field.handleChange('')}
                                  invalid={!field.state.meta.isValid}
                                />
                                <ErrorField field={field} />
                              </div>
                            )}
                          </form.Field>
                        </td>
                        <td>
                          <form.Field
                            name={`dokumen[${dok.kode - 1}].Keterangan`}
                          >
                            {(field) => (
                              <div>
                                <InputTextArea
                                  id={`dokumen[${dok.kode - 1}].Keterangan`}
                                  placeholder='Keterangan...'
                                  value={field.state.value ?? ''}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onClear={() => field.handleChange('')}
                                  invalid={!field.state.meta.isValid}
                                />
                                <ErrorField field={field} />
                              </div>
                            )}
                          </form.Field>
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <InputButton className='float-end px-2' isLoading={loadingMutation}>
          Simpan
        </InputButton>
      </form>
    </div>
  );
};

export default FormIdentifikasiDak;
