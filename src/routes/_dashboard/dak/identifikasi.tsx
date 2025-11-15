import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import IdentifikasiDakTable from '../../../components/tables/dak/IdentifikasiDakTable';
import { SITE_NAME } from '../../../lib/config';
import F_IdentDak from '../../../components/forms/IdentifikasiDak/F_IdentDak';

export const Route = createFileRoute('/_dashboard/dak/identifikasi')({
  head: () => ({
    meta: [
      {
        title: `Identifikasi DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Identifikasi DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [posisi, setPosisi] = useState<'Tabel' | 'Add' | 'Edit'>('Tabel');

  type DakData = {
    tahun: string;
    opd: string;
    jenis: string;
    subJenis: string;
    id_ident?: string;
  };

  const [dakData, setDakData] = useState<DakData>({
    tahun: '',
    opd: '',
    jenis: '',
    subJenis: '',
    id_ident: '',
  });

  const handleChange = (field: keyof DakData, value: string) => {
    setDakData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (posisi === 'Tabel') {
    return (
      <IdentifikasiDakTable
        onAdd={() => {
          handleChange('id_ident', '');
          setPosisi('Add');
        }}
        onEdit={() => setPosisi('Add')}
        dakData={dakData}
        changeDakData={handleChange}
      />
    );
  } else if (posisi === 'Add') {
    return (
      <F_IdentDak
        dakData={dakData}
        onBack={() => {
          handleChange('id_ident', '');
          setPosisi('Tabel');
        }}
      />
    );
  } 
}
