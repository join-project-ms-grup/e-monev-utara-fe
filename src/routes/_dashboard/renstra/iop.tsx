import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../configs/config'

export const Route = createFileRoute('/_dashboard/renstra/iop')({
    head: () => ({
    meta: [
      {
        title: `Indikator Outcome Program - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Indikator Outcome Program',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h4>Indikator Outcome Program</h4>
            <span>Ini halaman indikator outcome program</span>
        </>
    )
}
