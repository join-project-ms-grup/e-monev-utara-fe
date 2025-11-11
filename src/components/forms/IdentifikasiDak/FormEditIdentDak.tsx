import { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useForm, useStore } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { debounce } from 'lodash';
import {
  editIdentifikasiDAK,
  getIdentifikasiDetailDAK,
  type IdentifikasiDAKForm,
  type IdentifikasiDAKFormEdit,
} from '../../../services/DAK/DAKIdentifikasiService';
import {
  useGetIdentDetailDAK,
  useListSubJenisDAK,
} from '../../../hooks/DAK/ListDataDAK';
import type { ApiResponse } from '../../../lib/api';
import AksiButton from '../../inputs/AksiButton';
import InputButton from '../../inputs/InputButton';
import {
  identifikasidakSchema,
  identifikasidakSchemaSubmit,
} from '../schemas/DAK/SchemaIdentifikasiDak';
import { mapToInput, mapErrors } from '../schemas/SchemaPagu';
import FormIdentJenisBidangDak from './FormIdentJenisBidangDak';
import FormIdentDetailDak from './FormIdentDetailDak';
import FormIdentMekanismeDak from './FormIdentMekanismeDak';
import Spinner from '../../inputs/Spinner';

type DakData = {
  tahun: string;
  opd: string;
  jenis: string;
  subJenis: string;
  id_ident?: string;
};

interface Props {
  onBack: () => void;
  dataDak: DakData;
}

type FormType = Omit<IdentifikasiDAKForm, 'dokumen'> & { id_ident: number };

const FormEditIdentDak = ({ onBack, dataDak }: Props) => {
  const { data: editData, isLoading } = useQuery({
    queryKey: ['detail_identifikasi_dak', dataDak.id_ident],
    queryFn: () => getIdentifikasiDetailDAK(Number(dataDak.id_ident)),
  });

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
    defaultValues: {
      // non payload
      n_jenisDAK: editData?.jenis_dak_id.toString() ?? '',
      n_bidangDAK: editData?.bidang_dak_id.toString() ?? '',
      n_idUrusan: editData?.urusan_id.toString() ?? '',
      n_idBidang: editData?.bidang_id.toString() ?? '',
      n_idProgram: editData?.program_id.toString() ?? '',
      n_idKegiatan: editData?.kegiatan_id.toString() ?? '',
      // payload
      id_ident: Number(dataDak.id_ident),
      sub_jenis_id: editData?.sub_jenis_dak_id ?? 0,
      sub_bidang_id: editData?.sub_bidang_dak_id ?? 0,
      tahun: editData?.tahun ?? 0,
      opd_id: editData?.opd_id ?? 0,
      bidang_opd: editData?.bidang_opd ?? '',
      sub_kegiatan_id: editData?.subKegiatan_id ?? 0,
      catatan: editData?.catatan ?? '',
      nama_paket: editData?.nama_paket ?? '',
      detail_paket: editData?.detail_paket ?? '',
      volume: editData?.volume ?? 0,
      satuan: editData?.satuan ?? '',
      estimasi: editData?.estimasi_waktu ?? '',
      jumlah_penerima: editData?.jumlah_penerima_manfaat ?? '',
      anggaran: Number(editData?.anggaran_dak) ?? 0,
      des_kel: editData?.desa_kel ?? '',
      kec: editData?.kec ?? '',
      bujur: [
        editData?.bujur[0].toString() ?? '',
        editData?.bujur[1].toString() ?? '',
        editData?.bujur[2].toString() ?? '',
      ],
      lintang: [
        editData?.lintang[0].toString() ?? '',
        editData?.lintang[1].toString() ?? '',
        editData?.lintang[2].toString() ?? '',
      ],
      foto: editData?.foto_kegiatan ?? null,
      mekanisme: editData?.mekanisme ?? 'swakelola',
      metode: editData?.metode_pembayaran ?? '',
      volume_mekanisme: editData?.mekanisme_volume ?? 0,
      uang_mekanisme: Number(editData?.mekanisme_uang) ?? 0,
    },
    onSubmit: async ({ value }) => {
      if (value) {
        editMutation.mutate({
          id_ident: Number(dataDak.id_ident),
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
        });
      }
    },
    onSubmitInvalid: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onChange: ({ value }) => debouncedValidate(value),
      onSubmit: ({ value }) => validateWith(identifikasidakSchemaSubmit, value),
    },
  });
  const formValues = useStore(form.store).values;
  // #endregion

  //#region MUTASI
  const queryClient = useQueryClient();
  const [loadingMutation, setLoadingMutation] = useState(false);
  const editMutation = useMutation({
    mutationFn: async (payload: IdentifikasiDAKFormEdit) => {
      setLoadingMutation(true);
      // return console.log(payload);
      return editIdentifikasiDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_identifikasi_dak'] });
      // setFormData(initialFormData);
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

  if (isLoading) {
    return (
      <div className='w-full mx-auto'>
        <div className='inline-flex items-center gap-2'>
          <AksiButton
            Icon={MdArrowBack}
            className='hover:bg-[var(--color-2)]!'
            onClick={onBack}
            tooltip='Kembali'
          />
          <div className='inline-flex gap-2 items-center'>
            <span className='font-bold'>
              Ubah Data Identifikasi DAK Kabupaten / Kota
            </span>
            <Spinner color='red' size={24} />
          </div>
        </div>
      </div>
    );
  }

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
          Ubah Data Identifikasi DAK Kabupaten / Kota
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
          <FormIdentJenisBidangDak form={form} formValues={formValues} />
          <FormIdentDetailDak form={form} />
          <FormIdentMekanismeDak form={form} />
        </div>
        <InputButton className='float-end px-2' isLoading={loadingMutation}>
          Simpan
        </InputButton>
      </form>
    </div>
  );
};

export default FormEditIdentDak;
