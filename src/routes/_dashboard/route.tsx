import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TopBar from '../../components/Topbar';
import { getPeriodeFromCookie } from '../../lib/usercookie';
import InputButton from '../../components/inputs/InputButton';
import { MdLogout } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getPeriode } from '../../services/PeriodeService';
import InputSearchBox, {
  type OptionItem,
} from '../../components/inputs/InputSearchBox';
import Cookies from 'js-cookie';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: ({ context }) => {
    const { token } = context;
    if (!token) {
      throw redirect({ to: '/auth' });
    }
  },
  component: () => {
    if (getPeriodeFromCookie()) {
      return RouteComponent();
    } else {
      return PilihPeriodeComponent();
    }
  },
});

function RouteComponent() {
  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <div className='flex min-h-screen'>
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className='flex-1 flex flex-col min-w-0'>
          {/* Topbar */}
          <TopBar toggleSidebar={toggleSidebar} />

          {/* Content */}
          <Breadcrumb className='px-8 pt-2' />
          <main className='flex-1 px-8 py-2 z-0'>
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}

function PilihPeriodeComponent() {
  const [periode, setPeriode] = useState('');
  const { data: listPeriode } = useQuery({
    queryKey: ['list_periode_pilih_periode'],
    queryFn: async () => {
      const periodeResult = await getPeriode();
      return (
        periodeResult?.map((item) => ({
          label: `${item.mulai} - ${item.akhir}`,
          value: item.id?.toString(),
        })) || []
      );
    },
    enabled: !getPeriodeFromCookie()
  });

  return (
    <>
      <div className='h-screen flex items-center justify-center flex-col space-y-2'>
        <div className='shadow rounded min-w-md'>
          <div className='w-full bg-red-50 flex items-center justify-center p-2'>
            <h4>Pilih Periode</h4>
          </div>
          <div className='bg-white flex items-center justify-center'>
            <div className='py-4 space-y-2'>
              <InputSearchBox
                id='periode'
                className='w-52 h-9'
                btnclassName='bg-white'
                value={periode}
                onChange={(val) => setPeriode(val)}
                options={(listPeriode as OptionItem[]) || []}
                defaultOptionLabel='Pilih Periode'
                withSearch
                onClear={() => setPeriode('')}
              />
              <InputButton
                className='px-2 w-full h-9'
                onClick={() => {
                  if (periode) {
                    Cookies.set('periode', periode, { sameSite: 'strict' });
                  }
                  if (getPeriodeFromCookie() && periode) {
                    window.location.reload();
                  }
                }}
              >
                Pilih
              </InputButton>
            </div>
          </div>
        </div>
        <div>
          <InputButton className='px-2 h-9'>
            <Link
              to={'/auth/logout'}
              className='inline-flex gap-2 items-center text-sm'
            >
              <MdLogout />
              Keluar
            </Link>
          </InputButton>
        </div>
      </div>
    </>
  );
}
