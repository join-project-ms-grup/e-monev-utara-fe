import { createFileRoute } from '@tanstack/react-router'
import IndikatorIKDTable from '../../../../components/tables/rkpd/ikd/IndikatorIKDTable'
import { SITE_NAME } from '../../../../lib/config'

export const Route = createFileRoute('/_dashboard/rkpd/ikd/ikd_list')({
    head: () => ({
    meta: [
      {
        title: `Indikator IKD - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator IKD',
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