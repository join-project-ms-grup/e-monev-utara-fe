import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import OPDDakTable from '../../../components/tables/dak/OPDDakTable';

export const Route = createFileRoute('/_dashboard/dak/opd')({
  head: () => ({
    meta: [
      {
        title: `OPD DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'OPD DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <OPDDakTable />;
}
