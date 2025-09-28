import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../../lib/config'
import TaggingIndikatorTable from '../../../../components/tables/rkpd/iku/TaggingIndikatorTable'

export const Route = createFileRoute('/_dashboard/rkpd/iku/iku_tagging')({
    head: () => ({
    meta: [
      {
        title: `Tagging Indikator - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Tagging Indikator',
  },
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <TaggingIndikatorTable />
        </>
    )
}
