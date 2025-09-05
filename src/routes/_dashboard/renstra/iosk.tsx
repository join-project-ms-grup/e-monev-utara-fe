import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/renstra/iosk')({
    head: () => ({
    meta: [
      {
        title: `Indikator Output Sub Kegiatan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Output Sub Kegiatan',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Indikator Output Sub Kegiatan</h4>
            <span>Ini halaman indikator output sub kegiatan</span>
        </>
    )
}
