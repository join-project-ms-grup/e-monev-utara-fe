import { useEffect, useRef, useState, type JSX } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  MdDashboard,
  MdViewList,
  MdSettings,
  MdKeyboardArrowDown,
  MdInsights,
  MdInventory,
  MdAssignmentTurnedIn,
  MdFiberManualRecord,
  MdDragIndicator,
  MdSpeed,
  MdPayments,
  MdAssignment,
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
  akses?: number;
  submenu?: SubMenuItem[];
};

type SubMenuItem = {
  label: string;
  to?: string;
  icon?: JSX.Element;
  akses?: number;
  submenu?: SubMenuItem[];
};

// Base Menu
const menuUtama: MenuItem[] = [
  { label: 'Dashboard', icon: <MdDashboard />, to: '/' },
  {
    type: 'separator',
    label: 'MENU',
  },
  {
    label: 'Master',
    icon: <MdInventory />,
    submenu: [
      { label: 'Rekening', to: '/master/rekening' },
      { label: 'Role', to: '/master/role', akses: 1 && 2 },
      { label: 'Periode', to: '/master/periode' },
      { label: 'SKPD', to: '/master/skpd', akses: 1 && 2 },
    ],
  },
  {
    label: 'Konfigurasi',
    icon: <MdSettings />,
    akses: 1 && 2,
    submenu: [{ label: 'User', to: '/konfigurasi/user' }],
  },
];

// Menu RKPD
const menuRKPD: MenuItem[] = [
  {
    type: 'separator',
    label: 'MENU RKPD',
    akses: 3,
  },
  {
    label: 'Pagu Indikatif',
    icon: <MdDragIndicator />,
    to: '/rkpd/pagu_indikatif',
    akses: 3,
  },
  { label: 'Indikator', icon: <MdSpeed />, to: '/rkpd/indikator', akses: 3 },
  { label: 'Capaian', icon: <MdInsights />, to: '/rkpd/capaian', akses: 2 },
  {
    label: 'Realisasi',
    icon: <MdAssignmentTurnedIn />,
    to: '/rkpd/realisasi',
    akses: 2,
  },
  {
    label: 'Indikator Kinerja Utama',
    icon: <MdInsights />,
    submenu: [
      { label: 'Tagging Indikator', to: '/rkpd/iku/iku_tagging' },
      { label: 'Indikator IKU', to: '/rkpd/iku/iku_list' },
      { label: 'Capaian Indikator IKU', to: '/rkpd/iku/iku_capaian' },
    ],
    akses: 3,
  },
  {
    label: 'Hasil Evaluasi',
    icon: <MdAssignment />,
    submenu: [
      { label: 'RKPD', to: '/rkpd/hasil_evaluasi/rkpd' },
      { label: 'Renstra', to: '/rkpd/hasil_evaluasi/renstra' },
      { label: 'RPJMD', to: '/rkpd/hasil_evaluasi/rpjmd' },
    ],
    akses: 3,
  },
];

// Menu DAK
const menuDAK: MenuItem[] = [
  {
    type: 'separator',
    label: 'MENU DAK',
    akses: 4,
  },
  {
    label: 'DAK Kabupaten',
    icon: <MdPayments />,
    submenu: [
      { label: 'Identifikasi DAK', to: '/dak/kabupaten/identifikasi' },
      { label: 'Monitoring DAK', to: '/dak/kabupaten/monitoring' },
    ],
    akses: 4,
  },
  {
    label: 'Daftar dan Jenis DAK',
    icon: <MdViewList />,
    to: '/dak/daftardak',
    akses: 4,
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

  const canAccess = (menu: MenuItem | SubMenuItem, roleId: number): boolean => {
    if (roleId === 1 || roleId === 2) return true;
    if (menu.akses && menu.akses !== roleId) {
      return false;
    }
    if (menu.submenu) {
      menu.submenu = menu.submenu
        .map((sub) => ({ ...sub }))
        .filter((sub) => canAccess(sub, roleId));
      return menu.submenu.length > 0;
    }
    return true;
  };

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

  const filteredMenus = menus
    .map((menu) => ({ ...menu }))
    .filter((menu) => canAccess(menu, getRoleId()!));

  return (
    <aside
      className={`flex flex-col bg-white text-[#333] sticky top-0 whitespace-break-spaces h-screen transition-all duration-200 ${sidebarOpen ? 'w-72' : 'w-20'}`}
    >
      <div className='flex flex-row items-center justify-center'>
        <div className='px-6 py-4'>
          <img src='/mahabbah.png' alt='MAHABBAH LOGO' />
        </div>
      </div>
      <nav className='overflow-y-auto overflow-x-hidden sidebar-scroll space-y-2 p-4'>
        {filteredMenus.map(renderMenu)}
      </nav>
    </aside>
  );
};

export default Sidebar;
