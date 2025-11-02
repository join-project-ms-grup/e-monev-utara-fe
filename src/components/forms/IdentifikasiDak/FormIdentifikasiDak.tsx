import React, { useState } from 'react';
import JenisBidangProgramKegiatanDAK from './JenisBidangProgramKegiatanDAK';
import DetailDak from './DetailDak';
import CatatanMekanismePelaksana from './CatatanMekanismePelaksana';
import ChecklistDokumenKegiatan from './ChecklistDokumenKegiatan';

const htmlFormIdentifikasiDak = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className='w-full max-w-3xl mx-auto mt-8'>
      <div className='flex border-b'>
        <button
          onClick={() => setActiveTab(1)}
          className={`px-4 py-2 font-medium ${
            activeTab === 1
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Jenis, Bidang, Program & Kegiatan DAK
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`px-4 py-2 font-medium ${
            activeTab === 2
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Detail DAK
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={`px-4 py-2 font-medium ${
            activeTab === 3
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Catatan & Mekanisme Pelaksana
        </button>
        <button
          onClick={() => setActiveTab(4)}
          className={`px-4 py-2 font-medium ${
            activeTab === 4
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Checklist Dokumen dan Kegiatan Pelaksanaan
        </button>
      </div>

      <div className='mt-6'>
        {activeTab === 1 && <JenisBidangProgramKegiatanDAK />}
        {activeTab === 2 && <DetailDak />}
        {activeTab === 3 && <CatatanMekanismePelaksana />}
        {activeTab === 4 && <ChecklistDokumenKegiatan />}
      </div>
    </div>
  );
};

export default htmlFormIdentifikasiDak;
