import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config'
import IOKTable from '../../../../components/tables/rkpd/renstra/IOKTable'

export const Route = createFileRoute('/_dashboard/rkpd/renstra/iok')({
    head: () => ({
    meta: [
      {
        title: `Indikator Output Kegiatan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Output Kegiatan',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <IOKTable />
        </>
    )
}
