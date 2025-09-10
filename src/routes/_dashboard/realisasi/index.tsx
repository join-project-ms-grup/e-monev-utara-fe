import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'

export const Route = createFileRoute('/_dashboard/realisasi/')({
    head: () => ({
    meta: [
      {
        title: `Realisasi - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Realisasi',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Realisasi</h4>
            <span>Ini halaman realisasi</span>
        </>
    )
}
