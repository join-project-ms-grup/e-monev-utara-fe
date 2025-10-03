import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../../lib/config';
import IdentifikasiDakTable from '../../../../components/tables/dak/IdentifikasiDakTable';

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
  return (
    <>
    <IdentifikasiDakTable />
    </>
  )
}
