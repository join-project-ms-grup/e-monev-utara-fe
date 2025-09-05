import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/master/pegawai')({
    head: () => ({
    meta: [
      {
        title: `Pegawai - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Pegawai',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Master - Pegawai</h4>
            <span>Ini halaman master pegawai</span>
        </>
    )
}
