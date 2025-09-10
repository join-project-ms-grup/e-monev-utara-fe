import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'

export const Route = createFileRoute('/_dashboard/iku/iku_list')({
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
            <h4>Indikator Kinerja Utama - Indikator IKU</h4>
            <span>Ini halaman indikator kinerja utama indikator iku</span>
        </>
    )
}
