import { useState, type FormEvent } from 'react';
import JenisBidangProgramKegiatanDAK from './JenisBidangProgramKegiatanDAK';
import DetailDak from './DetailDak';
import CatatanMekanismePelaksana from './CatatanMekanismePelaksana';
import ChecklistDokumenKegiatan from './ChecklistDokumenKegiatan';
import AksiButton from '../../inputs/AksiButton';
import { MdArrowBack } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import toast from 'react-hot-toast';
import type { IdentifikasiDAKForm } from '../../../services/DAK/DAKIdentifikasiService';

interface htmlFormIdentifikasiDak {
  onBack: () => void;
}

const htmlFormIdentifikasiDak = ({
  onBack,
}: htmlFormIdentifikasiDak) => {
  const initialFormData: IdentifikasiDAKForm = {
    sub_jenis_id: 0,
    sub_bidang_id: 0,
    tahun: 0,
    opd_id: 0,
    bidang_opd: '',
    sub_kegiatan_id: 0,
    catatan: null,
    nama_paket: '',
    detail_paket: '',
    volume: 0,
    satuan: '',
    estimasi: '',
    jumlah_penerima: '',
    anggaran: 0,
    des_kel: '',
    kec: '',
    bujur: [0, 0, 0],
    lintang: [0, 0, 0],
    foto: null,
    mekanisme: 'swakelola',
    metode: '',
    volume_mekanisme: 0,
    uang_mekanisme: 0,
    dokumen: [
      {
        id_berkas: 0,
        file: null,
        Waktu: null,
        Keterangan: null,
      },
    ],
  };

  const [formData, setFormData] =
    useState<IdentifikasiDAKForm>(initialFormData);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('FormData',formData)
  };

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
      <form onSubmit={handleSubmit} className='space-y-2'>
        <div className='space-y-8'>
          <JenisBidangProgramKegiatanDAK formData={formData} setFormData={setFormData} />
          <DetailDak />
          <CatatanMekanismePelaksana />
          <ChecklistDokumenKegiatan />
        </div>
        <InputButton className='float-end px-2'>Simpan</InputButton>
      </form>
    </div>
  );
};

export default htmlFormIdentifikasiDak;
