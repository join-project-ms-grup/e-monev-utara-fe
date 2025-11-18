import { useAppForm } from '../form-context';
import { SchemaFormIdentDAK, useIdentDAKFormData } from './FV_IdentDak';
import { FC_JenisIdentDak } from './FC_JenisIdentDak';
import AksiButton from '../../inputs/AksiButton';
import { MdArrowBack } from 'react-icons/md';
import { FC_DetailIdentDak } from './FC_DetailIdentDak';
import { FC_MekanIdentDak } from './FC_MekanIdentDak';
import { FC_DokIdentDak } from './FC_DokIdentDak';
import { useStore } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { useM_IdentDAK } from './M_IdentifikasiDAK';

type DakData = {
  tahun: string;
  opd: string;
  jenis: string;
  subJenis: string;
  id_ident?: string;
};

interface F_IdentDakProps {
  onBack: () => void;
  dakData: DakData;
}

// F (FORM)
const F_IdentDak = ({ onBack, dakData }: F_IdentDakProps) => {
  const { mutateWithToast, loading } = useM_IdentDAK();

  const { initialValues } = useIdentDAKFormData(Number(dakData.id_ident));

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      const addPayload = {
        sub_jenis_id: Number(value.sub_jenis_id),
        sub_bidang_id: Number(value.sub_bidang_id),
        tahun: Number(value.tahun),
        opd_id: Number(value.opd_id),
        bidang_opd: value.bidang_opd,
        sub_kegiatan_id: Number(value.sub_kegiatan_id),
        catatan: value.catatan,
        nama_paket: value.nama_paket,
        detail_paket: value.detail_paket,
        volume: Number(value.volume),
        satuan: value.satuan,
        estimasi: value.estimasi,
        jumlah_penerima: value.jumlah_penerima?.toString() ?? '',
        anggaran: Number(value.anggaran),
        des_kel: value.des_kel,
        kec: value.kec,
        bujur: `[${value.bujur[0]},${value.bujur[1]},${value.bujur[2]}]`,
        lintang: `[${value.lintang[0]},${value.lintang[1]},${value.lintang[2]}]`,
        foto: null,
        mekanisme: value.mekanisme,
        metode: value.metode,
        volume_mekanisme: Number(value.volume_mekanisme),
        uang_mekanisme: Number(value.uang_mekanisme),
        dokumen: value.dokumen as any,
      };
      const { dokumen, ...addPayloadWithoutDokumen } = addPayload;
      const editPayload = {
        ...addPayloadWithoutDokumen,
        id_ident: Number(value.id_ident),
      };

      mutateWithToast(value.id_ident ? editPayload : addPayload, () => {
        onBack();
      });
    },
    onSubmitInvalid: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: SchemaFormIdentDAK,
    },
  });

  const njenisDAK = useStore(form.store, (s) => s.values.jenis_dak_id);
  const identID = useStore(form.store, (s) => s.values.id_ident);
  return (
    <div>
      <div className='inline-flex items-center gap-2'>
        <AksiButton
          Icon={MdArrowBack}
          className='hover:bg-[var(--color-2)]!'
          onClick={onBack}
          tooltip='Kembali'
        />
        <span className='font-bold'>
          {identID ? 'Ubah' : 'Tambah'} Data Identifikasi DAK Kabupaten / Kota
        </span>
      </div>
      <form
        className='space-y-8 mt-8'
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FC_JenisIdentDak
          title={'Jenis, Bidang, Program & Kegiatan DAK'}
          form={form}
        />
        <FC_DetailIdentDak title={'Detail DAK'} form={form} />
        <FC_MekanIdentDak
          title={'Catatan & Mekanisme Pelaksanaan'}
          form={form}
        />
        {njenisDAK === '1' && !identID && (
          <FC_DokIdentDak
            title={'Checklist Dokumen dan Kegiatan Pelaksanaan'}
            form={form}
          />
        )}
        <div className='max-w-4xl mx-auto'>
          <div className='float-end'>
            <form.AppForm>
              <form.SubmitButton isLoading={loading}>Simpan</form.SubmitButton>
            </form.AppForm>
          </div>
        </div>
      </form>
    </div>
  );
};

export default F_IdentDak;
