import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config'
import CapaianIKUTable from '../../../../components/tables/rkpd/iku/CapaianIKUTable'

export const Route = createFileRoute('/_dashboard/rkpd/iku/iku_capaian')({
    head: () => ({
    meta: [
      {
        title: `Capaian Indikator IKU - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Capaian Indikator IKU',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <CapaianIKUTable />
        </>
    )
}
