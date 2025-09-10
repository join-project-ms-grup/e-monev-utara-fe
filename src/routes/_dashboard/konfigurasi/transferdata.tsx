import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'

export const Route = createFileRoute('/_dashboard/konfigurasi/transferdata')({
  head: () => ({
    meta: [
      {
        title: `Transfer Data - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Transfer Data',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Konfigurasi - Transfer Data</h4>
            <span>Ini halaman konfigurasi transfer data</span>
        </>
    )
}
