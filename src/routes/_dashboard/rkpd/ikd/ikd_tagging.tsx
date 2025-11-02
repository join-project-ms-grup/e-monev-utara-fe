import { createFileRoute } from '@tanstack/react-router'
import TaggingIndikatorIKDTable from '../../../../components/tables/rkpd/ikd/TaggingIndikatorIKDTable'
import { SITE_NAME } from '../../../../lib/config'

export const Route = createFileRoute('/_dashboard/rkpd/ikd/ikd_tagging')({
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
            <TaggingIndikatorIKDTable />
        </>
    )
}
