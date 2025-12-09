import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config'
import IndikatorIKUTable from '../../../../components/tables/rkpd/iku_ikd/IndikatorIKUTable'

export const Route = createFileRoute('/_dashboard/rkpd/iku_ikd/iku')({
    head: () => ({
    meta: [
      {
        title: `Indikator Kinerja Utama - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Kinerja Utama',
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