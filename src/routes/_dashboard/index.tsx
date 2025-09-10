import { createFileRoute } from '@tanstack/react-router'
import { SITE_NAME } from '../../lib/config'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/_dashboard/')({
  head: () => ({
    meta: [
      {
        title: `Dashboard - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Dashboard',
  },
  component: RouteComponent,
})

function RouteComponent() {
  const clickMe = () => {
    toast.success('Ouch !');
  }

    return (
        <>
            <h4>Dashboard</h4>
            <p>Ini halaman dashboard</p>
            <button className='px-2 py-1 bg-[var(--color-2)] rounded text-[var(--text-3)] active:scale-90 transition-all' onClick={clickMe}>Click Me !</button>
        </>
    )
}
