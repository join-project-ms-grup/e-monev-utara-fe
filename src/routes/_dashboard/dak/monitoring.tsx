import { createFileRoute } from '@tanstack/react-router';
import MonitoringDakTable from '../../../components/tables/dak/MonitoringDakTable';
import { SITE_NAME } from '../../../lib/config';

export const Route = createFileRoute('/_dashboard/dak/monitoring')({
  head: () => ({
    meta: [
      {
        title: `Monitoring DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Monitoring DAK',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <MonitoringDakTable />
    </>
  );
}
