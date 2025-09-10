import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'

export const Route = createFileRoute('/_dashboard/renja/')({
    head: () => ({
    meta: [
      {
        title: `Renja - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Renja',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Renja</h4>
            <span>Ini halaman renja</span>
        </>
    )
}
