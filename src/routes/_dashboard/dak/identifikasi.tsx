import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import FormIdentifikasiDak from '../../../components/forms/IdentifikasiDak/FormIdentifikasiDak';
import IdentifikasiDakTable from '../../../components/tables/dak/IdentifikasiDakTable';
import { SITE_NAME } from '../../../lib/config';
import FormEditIdentDak from '../../../components/forms/IdentifikasiDak/FormEditIdentDak';

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
        onEdit={() => setPosisi('Edit')}
        dakData={dakData}
        changeDakData={handleChange}
      />
    );
  } else if (posisi === 'Add') {
    return (
      <FormIdentifikasiDak
        onBack={() => {
          handleChange('id_ident', '');
          setPosisi('Tabel');
        }}
      />
    );
  } else {
    return (
      <FormEditIdentDak
        dataDak={dakData}
        onBack={() => {
          handleChange('id_ident', '');
          setPosisi('Tabel');
        }}
      />
    );
  }
}
