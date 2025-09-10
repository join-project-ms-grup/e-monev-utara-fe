import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'

export const Route = createFileRoute('/_dashboard/renstra/iok')({
    head: () => ({
    meta: [
      {
        title: `Indikator Output Kegiatan - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Output Kegiatan',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Indikator Output Kegiatan</h4>
            <span>Ini halaman indikator output kegiatan</span>
        </>
    )
}
