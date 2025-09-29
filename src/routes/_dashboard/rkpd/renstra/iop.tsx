import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config'
import IOPTable from '../../../../components/tables/rkpd/renstra/IOPTable'

export const Route = createFileRoute('/_dashboard/rkpd/renstra/iop')({
    head: () => ({
    meta: [
      {
        title: `Indikator Outcome Program - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Outcome Program',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <IOPTable />
        </>
    )
}
