import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import IdentifikasiDakTable from '../../../../components/tables/dak/IdentifikasiDakTable';
import { useState } from 'react';
import FormIdentifikasiDak from '../../../../components/forms/IdentifikasiDak/FormIdentifikasiDak';

export const Route = createFileRoute('/_dashboard/dak/kabupaten/identifikasi')({
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
  const [posisi, setPosisi] = useState<'Tabel' | 'Add'>('Tabel');

  if (posisi === 'Tabel') {
    return <IdentifikasiDakTable onAdd={() => setPosisi('Add')} />;
  } else {
    return <FormIdentifikasiDak onBack={() => setPosisi('Tabel')} />;
  }
}
