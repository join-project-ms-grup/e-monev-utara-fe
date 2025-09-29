import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config'
import IOSKTable from '../../../../components/tables/rkpd/renstra/IOSKTable'

export const Route = createFileRoute('/_dashboard/rkpd/renstra/iosk')({
    head: () => ({
    meta: [
      {
        title: `Indikator Output Sub Kegiatan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Output Sub Kegiatan',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <IOSKTable />
        </>
    )
}
