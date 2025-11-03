import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TopBar from '../../components/Topbar';
import InputButton from '../../components/inputs/InputButton';
import { MdChevronLeft, MdLogout } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getPeriode } from '../../services/PeriodeService';
import InputSearchBox, {
  type OptionItem,
} from '../../components/inputs/InputSearchBox';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
import AksiButton from '../../components/inputs/AksiButton';
import { getRoleId, isDev, skipPeriode } from '../../lib/usercookie';
import BackToTop from '../../components/BackToTop';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: ({ context }) => {
    const { token } = context;
    if (!token) {
      throw redirect({ to: '/auth' });
    }
  },
  component: RouteComponent,
});

// function RouteComponent() {
//   const { periodeCookie } = useAuth();
//   if (!periodeCookie) return <PeriodeComponent />;
//   return <MainComponent />;
// }

function RouteComponent() {
  const roleId = getRoleId();
  const { periodeCookie, skipPeriodeCookie } = useAuth();

  if (roleId === 1) {
    if (!periodeCookie && !skipPeriodeCookie) {
      return <PeriodeComponent />;
    }
    return <MainComponent />;
  } else {
    if (!periodeCookie) {
      return <PeriodeComponent />;
    }
    return <MainComponent />;
  }
}

function MainComponent() {
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
      <BackToTop />
    </>
  );
}

function PeriodeComponent() {
  const navigate = useNavigate();
  const { periodeCookie, refreshPeriodeCookie } = useAuth();
  const [periode, setPeriode] = useState('');
  const [tahun, setTahun] = useState('');
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
    enabled: !periodeCookie,
  });

  return (
    <>
      <div className='h-screen flex items-center justify-center flex-col space-y-2'>
        <div className='shadow rounded min-w-md'>
          <div className='w-full bg-red-50 flex items-center justify-center'>
            <div className='grid grid-cols-3'>
              <div className='flex justify-start items-center'>
                {isDev() && (
                  <AksiButton
                    tooltip='Lewati'
                    Icon={MdChevronLeft}
                    className='ms-2 p-1 hover:text-gray-800 hover:opacity-60'
                    hoverColor='bg-[var(--color-2)]'
                    onClick={() => {
                      Cookies.set('skip_periode', '1');
                      refreshPeriodeCookie();
                    }}
                  />
                )}
              </div>
              <h4 className='p-2'>Pilih Periode</h4>
              <div className='flex justify-end items-center'>
                <AksiButton
                  tooltip='Keluar'
                  Icon={MdLogout}
                  className='mr-2 p-1 hover:text-gray-800 hover:opacity-60'
                  hoverColor='bg-[var(--color-2)]'
                  onClick={() =>
                    navigate({ to: '/auth/logout', replace: true })
                  }
                />
              </div>
            </div>
          </div>
          <div className='bg-white flex flex-col items-center justify-center'>
            <div className='mt-4'>
              <img src='/periode/schedule.png' width={128} />
            </div>
            <div className='py-4 space-y-2'>
              <InputSearchBox
                id='periode'
                className='w-52 h-9'
                btnclassName='bg-white'
                value={periode}
                onChange={(val, e) => {
                  setPeriode(val);
                  setTahun(e?.target.name!);
                }}
                options={(listPeriode as OptionItem[]) || []}
                defaultOptionLabel='Pilih Periode'
                withSearch
                onClear={() => {
                  setPeriode('');
                  setTahun('');
                }}
              />
              <InputButton
                className='px-2 w-full h-9'
                type='button'
                onClick={() => {
                  if (periode) {
                    const [mulai, akhir] = tahun.split(' - ');
                    Cookies.set(
                      'periode',
                      JSON.stringify({
                        id: periode,
                        mulai: mulai,
                        akhir: akhir,
                      }),
                      {
                        sameSite: 'strict',
                      },
                    );
                    refreshPeriodeCookie();
                  }
                }}
              >
                Pilih
              </InputButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
