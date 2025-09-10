import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'

export const Route = createFileRoute('/_dashboard/iku/iku_capaian')({
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
            <h4>Indikator Kinerja Utama - Capaian Indikator IKU</h4>
            <span>Ini halaman indikator kinerja utama capaian indikator iku</span>
        </>
    )
}
