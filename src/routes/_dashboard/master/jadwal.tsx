import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../../lib/config'
import JadwalTable from '../../../components/tables/JadwalTable'

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
            <JadwalTable />
        </>
    )
}
