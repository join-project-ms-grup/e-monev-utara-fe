import { createFileRoute } from '@tanstack/react-router'
import IndikatorIKDTable from '../../../../components/tables/rkpd/iku_ikd/IndikatorIKDTable'
import { SITE_NAME } from '../../../../lib/config'

export const Route = createFileRoute('/_dashboard/rkpd/iku_ikd/ikd')({
    head: () => ({
    meta: [
      {
        title: `Indikator Kinerja Daerah - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Kinerja Daerah',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
           <IndikatorIKDTable />
        </>
    )
}