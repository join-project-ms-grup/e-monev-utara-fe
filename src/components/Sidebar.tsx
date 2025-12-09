import { useEffect, useRef, useState, type JSX } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  MdDashboard,
  MdSettings,
  MdKeyboardArrowDown,
  MdFiberManualRecord,
  MdShowChart,
  MdEventNote,
  MdAssessment,
  MdMonitor,
  MdContentPaste,
} from 'react-icons/md';
import { getRoleId } from '../lib/usercookie';

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

type MenuItem = {
  type?: 'item' | 'separator';
  label: string;
  icon?: JSX.Element;
  to?: string;
  akses?: number | number[];
  submenu?: SubMenuItem[];
};

type SubMenuItem = {
  label: string;
  to?: string;
  icon?: JSX.Element;
  akses?: number | number[];
  submenu?: SubMenuItem[];
};

// Base Menu
const menuUtama: MenuItem[] = [
  { label: 'Dashboard', icon: <MdDashboard />, to: '/' },
  // {
  //   type: 'separator',
  //   label: 'MENU',
  // },
  {
    label: 'Konfigurasi',
    icon: <MdSettings />,
    akses: [1, 2],
    submenu: [
      { label: 'Role', to: '/konfigurasi/role', akses: 1 },
      { label: 'User', to: '/konfigurasi/user' },
      { label: 'Periode', to: '/konfigurasi/periode' },
      { label: 'SKPD', to: '/konfigurasi/skpd', akses: [1, 2] },
    ],
  },
];

// Menu RKPD
const menuRKPD: MenuItem[] = [
  {
    type: 'separator',
    label: 'MENU RKPD',
    akses: [2, 3],
  },
  {
    label: 'RENSTRA - RPJMD',
    icon: <MdEventNote />,
    akses: [2, 3],
    submenu: [
      { label: 'Rekening', to: '/rkpd/renstra_rpjmd/rekening' },
      { label: 'Perencanaan', to: '/rkpd/renstra_rpjmd/perencanaan' },
      { label: 'Realisasi', to: '/rkpd/renstra_rpjmd/realisasi' },
      { label: 'Evaluasi RPJMD', to: '/rkpd/hasil_evaluasi/rpjmd' },
      { label: 'Evaluasi Renstra', to: '/rkpd/hasil_evaluasi/renstra' },
    ],
  },
  {
    label: 'IKU - IKD',
    icon: <MdShowChart />,
    akses: [2, 3],
    submenu: [
      { label: 'Pilih IKU/IKD', to: '/rkpd/iku_ikd/tagging' },
      { label: 'Indikator Kinerja Utama', to: '/rkpd/iku_ikd/iku' },
      { label: 'Realisasi IKU', to: '/rkpd/iku_ikd/iku_capaian' },
      { label: 'Indikator Kinerja Daerah', to: '/rkpd/iku_ikd/ikd' },
      { label: 'Realisasi IKD', to: '/rkpd/iku_ikd/ikd_capaian' },
    ],
  },
  {
    label: 'RENJA - RKPD',
    icon: <MdEventNote />,
    akses: [2, 3],
    submenu: [
      { label: 'Rekening', to: '/rkpd/renja_rkpd/rekening' },
      { label: 'Perencanaan', to: '/rkpd/renja_rkpd/perencanaan' },
      { label: 'Realisasi', to: '/rkpd/renja_rkpd/realisasi' },
      { label: 'Evaluasi RKPD', to: '/rkpd/hasil_evaluasi/rkpd' },
      { label: 'Evaulasi RENJA', to: '/rkpd/hasil_evaluasi/renja' },
    ],
  },
];

// Menu DAK
const menuDAK: MenuItem[] = [
  {
    type: 'separator',
    label: 'MENU DAK',
    akses: [2, 4],
  },
  {
    label: 'Master DAK',
    icon: <MdEventNote />,
    akses: [2],
    submenu: [
      { label: 'Rekening', to: '/dak/master/rekening' },
      { label: 'OPD', to: '/dak/master/opd' },
      { label: 'Tahun', to: '/dak/master/tahun' },
      { label: 'Jenis', to: '/dak/master/jenis' },
      { label: 'Bidang', to: '/dak/master/bidang' },
      { label: 'Masalah', to: '/dak/master/masalah' },
    ],
  },
  {
    label: 'Identifikasi DAK',
    icon: <MdAssessment />,
    to: '/dak/identifikasi',
    akses: [2, 4],
  },
  {
    label: 'Monitoring DAK',
    icon: <MdMonitor />,
    to: '/dak/monitoring',
    akses: [2, 4],
  },
  {
    label: 'Laporan',
    icon: <MdContentPaste />,
    to: '/dak/laporan',
    akses: [2, 4],
  },
];
const menus = [...menuUtama, ...menuRKPD, ...menuDAK];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const location = useLocation();
  const prevSidebarOpen = useRef(sidebarOpen);

  useEffect(() => {
    if (!prevSidebarOpen.current && sidebarOpen) {
      const openParentMenu: { [key: string]: boolean } = {};
      menus.forEach((menu) => {
        if (menu.submenu?.some((sub) => sub.to === location.pathname)) {
          openParentMenu[menu.label] = true;
        }
      });
      setOpenMenus(openParentMenu);
    }
    if (prevSidebarOpen.current && !sidebarOpen) {
      setOpenMenus({});
    }

    prevSidebarOpen.current = sidebarOpen;
  }, [sidebarOpen, location.pathname]);

  const toggleMenu = (label: string) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      setTimeout(() => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
      }, 0);
    } else {
      setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    }
  };

  const checkIsActive = (
    menu: MenuItem | SubMenuItem,
    path: string,
  ): boolean => {
    if (menu.to === path) return true;
    if (menu.submenu) {
      return menu.submenu.some((sub) => checkIsActive(sub, path));
    }
    return false;
  };

  // Fungsi cek akses
  const canAccess = (menu: MenuItem | SubMenuItem, roleId: number): boolean => {
    // Role 1 bisa akses semua
    if (roleId === 1) return true;

    // Jika akses tidak didefinisikan, semua role lain bisa mengakses
    if (!menu.akses) return true;

    // Normalisasi akses menjadi array
    const aksesArray = Array.isArray(menu.akses) ? menu.akses : [menu.akses];

    // Cek apakah roleId termasuk di aksesArray
    const hasAccess = aksesArray.includes(roleId);

    // Jika menu punya submenu, filter juga submenu-nya
    if (menu.submenu) {
      const filteredSubmenu = menu.submenu
        .map((sub) => ({ ...sub }))
        .filter((sub) => canAccess(sub, roleId));
      if (filteredSubmenu.length === 0 && !hasAccess) return false;
      menu.submenu = filteredSubmenu;
    }

    return hasAccess;
  };

  // Filter menu sebelum render
  const filteredMenus = menus
    .map((menu) => ({ ...menu }))
    .filter((menu) => canAccess(menu, getRoleId()!));

  const renderMenu = (menu: MenuItem) => {
    if (menu.type === 'separator') {
      return (
        <div key={menu.label} className='px-3'>
          {sidebarOpen ? (
            <div className='py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-nowrap'>
              {menu.label}
            </div>
          ) : (
            <div className='border-t border-gray-300 my-2' />
          )}
        </div>
      );
    }

    const isActive = checkIsActive(menu, location.pathname);

    if (menu.submenu) {
      return (
        <div key={menu.label}>
          <button
            type='button'
            onClick={() => toggleMenu(menu.label)}
            className={`sidelink w-full flex items-center justify-between ${isActive && !openMenus[menu.label] ? 'active' : ''}`}
          >
            <div className='flex items-center gap-2'>
              {menu.icon}
              <span className={`${sidebarOpen ? '' : 'close'}`}>
                {menu.label}
              </span>
            </div>
            {sidebarOpen && (
              <MdKeyboardArrowDown
                className={`transition-transform ${openMenus[menu.label] ? 'rotate-180' : ''}`}
              />
            )}
          </button>
          {sidebarOpen && (
            <>
              <div
                className={`ml-2 flex flex-col space-y-2 overflow-hidden transition-all duration-200 ease-in-out
      ${openMenus[menu.label] ? 'max-h-max' : 'max-h-0'}`}
              >
                <div className='mt-2 space-y-2'>
                  {menu.submenu.map((sub) =>
                    sub.submenu ? (
                      renderMenu(sub as MenuItem)
                    ) : (
                      <Link key={sub.label} to={sub.to!} className='sidelink'>
                        <span
                          className={`flex flex-row gap-2 items-center ${sidebarOpen ? '' : 'close'}`}
                        >
                          {sub.icon ? (
                            sub.icon
                          ) : (
                            <MdFiberManualRecord className='scale-70' />
                          )}
                          {sub.label}
                        </span>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <Link key={menu.label} to={menu.to!} className='sidelink'>
        {menu.icon}
        <span className={`${sidebarOpen ? '' : 'close'}`}>{menu.label}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`flex flex-col bg-white text-[#333] sticky top-0 whitespace-break-spaces h-screen transition-all duration-200 ${sidebarOpen ? 'w-72' : 'w-20'}`}
    >
      <div className='flex flex-row items-center justify-center'>
        <div className='h-[70px] flex flex-1 items-center justify-center'>
          {sidebarOpen ? (
            <img
              src='/mahabbah.png'
              className='w-52 mb-1'
              alt='MAHABBAH LOGO'
            />
          ) : (
            <img
              src='/mahabbah-small.png'
              className='w-12'
              alt='MAHABBAH LOGO'
            />
          )}
        </div>
      </div>
      <nav className='overflow-y-auto overflow-x-hidden sidebar-scroll space-y-2 p-4'>
        {filteredMenus.map(renderMenu)}
      </nav>
    </aside>
  );
};

export default Sidebar;
