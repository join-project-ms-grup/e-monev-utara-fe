import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/master/jadwal')({
  head: () => ({
    meta: [
      {
        title: `Jadwal - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Jadwal',
  },
  component: RouteComponent,
  context: () => ({
    getTitle: () => 'Jadwal',
  }),
})

function RouteComponent() {
    return (
        <>
            <h4>Master - Jadwal</h4>
            <span>Ini halaman master jadwal</span>
        </>
    )
}
