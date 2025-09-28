import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config'
import IndikatorIKUTable from '../../../../components/tables/rkpd/iku/IndikatorIKUTable'

export const Route = createFileRoute('/_dashboard/rkpd/iku/iku_list')({
    head: () => ({
    meta: [
      {
        title: `Indikator IKU - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator IKU',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
           <IndikatorIKUTable />
        </>
    )
}
