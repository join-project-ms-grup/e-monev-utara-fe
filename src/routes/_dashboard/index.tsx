import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../lib/config'

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
            <h4>Selamat datang di E-MAHABBAH</h4>
            <p>Monitoring, Analisis Hasil Pembangunan Daerah</p>
        </>
    )
}
