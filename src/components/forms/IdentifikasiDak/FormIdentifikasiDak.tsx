import { type FormEvent } from 'react';
import JenisBidangProgramKegiatanDAK from './JenisBidangProgramKegiatanDAK';
import DetailDak from './DetailDak';
import CatatanMekanismePelaksana from './CatatanMekanismePelaksana';
import ChecklistDokumenKegiatan from './ChecklistDokumenKegiatan';
import AksiButton from '../../inputs/AksiButton';
import { MdArrowBack } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import toast from 'react-hot-toast';

interface htmlFormIdentifikasiDak {
  onBack: () => void;
}

const htmlFormIdentifikasiDak = ({ onBack }: htmlFormIdentifikasiDak) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.error('Error')
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
        <span className='font-bold'>Tambah Data Identifikasi DAK Kabupaten / Kota</span>
      </div>
      <br />
      <br />
      <form onSubmit={handleSubmit} className='space-y-2'>
        <div className='space-y-8'>
          <JenisBidangProgramKegiatanDAK />
          <DetailDak />
          <CatatanMekanismePelaksana />
          <ChecklistDokumenKegiatan />
        </div>
        <InputButton className='float-end px-2'>Simpan</InputButton>
        {/* <button className='bg-red-300 px-2 py-1 rounded float-end'>
          Submit
        </button> */}
      </form>
    </div>
  );
};

export default htmlFormIdentifikasiDak;
