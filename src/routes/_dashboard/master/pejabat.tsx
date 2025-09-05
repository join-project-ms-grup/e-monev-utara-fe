import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/master/pejabat')({
    head: () => ({
    meta: [
      {
        title: `Pejabat - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Pejabat',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Master - Pejabat</h4>
            <span>Ini halaman master pejabat</span>
        </>
    )
}
