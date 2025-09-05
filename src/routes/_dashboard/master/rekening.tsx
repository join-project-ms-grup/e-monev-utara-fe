import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/master/rekening')({
    head: () => ({
    meta: [
      {
        title: `Rekening - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Rekening',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Master - Rekening</h4>
            <span>Ini halaman master rekening</span>
        </>
    )
}
