import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../configs/config'

export const Route = createFileRoute('/auth/')({
  head: () => ({
    meta: [
      {
        title: `Autentikasi - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Autentikasi',
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <h4>Masuk</h4>
      <span>Form Masuk</span>
    </>
  )
}
