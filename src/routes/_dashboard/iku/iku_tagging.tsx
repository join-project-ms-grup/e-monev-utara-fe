import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/iku/iku_tagging')({
    head: () => ({
    meta: [
      {
        title: `Tagging Indikator - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Tagging Indikator',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Indikator Kinerja Utama - Tagging Indikator</h4>
            <span>Ini halaman indikator kinerja utama tagging indikator</span>
        </>
    )
}
