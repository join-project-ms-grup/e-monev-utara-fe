import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/master/organisasi')({
  head: () => ({
    meta: [
      {
        title: `Organisasi - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Organisasi',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Master - Organisasi</h4>
            <span>Ini halaman master organisasi</span>
        </>
    )
}
