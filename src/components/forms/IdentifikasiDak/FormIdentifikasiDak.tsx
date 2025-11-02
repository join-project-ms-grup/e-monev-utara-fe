import React, { useState } from 'react';
import JenisBidangProgramKegiatanDAK from './JenisBidangProgramKegiatanDAK';
import DetailDak from './DetailDak';
import CatatanMekanismePelaksana from './CatatanMekanismePelaksana';
import ChecklistDokumenKegiatan from './ChecklistDokumenKegiatan';

const htmlFormIdentifikasiDak = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className='w-full max-w-6xl mx-auto'>
      <div className='flex'>
        <button
          onClick={() => setActiveTab(1)}
          className={`px-4 py-2 font-medium ${
            activeTab === 1
              ? 'border-b-2 border-[var(--color-2)] text-[var(--color-2)]'
              : 'hover:text-[var(--color-2)]'
          }`}
        >
          Jenis, Bidang, Program & Kegiatan DAK
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`px-4 py-2 font-medium ${
            activeTab === 2
              ? 'border-b-2 border-[var(--color-2)] text-[var(--color-2)]'
              : 'hover:text-[var(--color-2)]'
          }`}
        >
          Detail DAK
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={`px-4 py-2 font-medium ${
            activeTab === 3
              ? 'border-b-2 border-[var(--color-2)] text-[var(--color-2)]'
              : 'hover:text-[var(--color-2)]'
          }`}
        >
          Catatan & Mekanisme Pelaksana
        </button>
        <button
          onClick={() => setActiveTab(4)}
          className={`px-4 py-2 font-medium ${
            activeTab === 4
              ? 'border-b-2 border-[var(--color-2)] text-[var(--color-2)]'
              : 'hover:text-[var(--color-2)]'
          }`}
        >
          Checklist Dokumen dan Kegiatan Pelaksanaan
        </button>
      </div>

      <div className='mt-2'>
        {activeTab === 1 && <JenisBidangProgramKegiatanDAK />}
        {activeTab === 2 && <DetailDak />}
        {activeTab === 3 && <CatatanMekanismePelaksana />}
        {activeTab === 4 && <ChecklistDokumenKegiatan />}
      </div>
    </div>
  );
};

export default htmlFormIdentifikasiDak;
