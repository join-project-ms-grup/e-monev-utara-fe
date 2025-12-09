import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../lib/config';
import F_Profil from '../../components/forms/Profil/F_Profil';
import F_ProfilPass from '../../components/forms/Profil/F_ProfilPass';

export const Route = createFileRoute('/_dashboard/profil')({
  head: () => ({
    meta: [
      {
        title: `Profil - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Profil',
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='max-w-md mx-auto space-y-4'>
      <F_Profil />
      <F_ProfilPass />
    </div>
  )
}
