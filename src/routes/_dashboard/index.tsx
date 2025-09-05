import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../configs/config'

export const Route = createFileRoute('/_dashboard/')({
  head: () => ({
    meta: [
      {
        title: `Dashboard - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Dashboard',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Dashboard</h4>
            <span>Ini halaman dashboard</span>
        </>
    )
}
