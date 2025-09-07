import { useEffect, useRef, useState, type JSX } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { MdDashboard, MdViewList, MdSettings, MdKeyboardArrowDown, MdInsights, MdLibraryBooks, MdInventory, MdAssignmentTurnedIn, MdFiberManualRecord } from "react-icons/md"

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

type MenuItem = {
  type?: 'item' | 'separator'
  label: string
  icon?: JSX.Element
  to?: string
  submenu?: SubMenuItem[]
}

type SubMenuItem = {
  label: string
  to?: string
}

const menus: MenuItem[] = [
  { label: 'Dashboard', icon: <MdDashboard />, to: '/' },
  {
    type: 'separator',
    label: 'MENU'
  },
  {
    label: 'Master',
    icon: <MdInventory />,
    submenu: [
      { label: 'Organisasi', to: '/master/organisasi' },
      { label: 'Rekening', to: '/master/rekening' },
      { label: 'Jadwal', to: '/master/jadwal' },
      { label: 'Pegawai', to: '/master/pegawai' },
      { label: 'Pejabat', to: '/master/pejabat' },
    ]
  },
  {
    label: 'Renstra',
    icon: <MdLibraryBooks />,
    submenu: [
      { label: 'Indikator Outcome\nProgram', to: '/renstra/iop' },
      { label: 'Indikator Output Kegiatan', to: '/renstra/iok' },
      { label: 'Indikator Output Sub\nKegiatan', to: '/renstra/iosk' },
    ]
  },
  {
    label: 'Indikator Kinerja Utama',
    icon: <MdInsights />,
    submenu: [
      { label: 'Tagging Indikator', to: '/iku/iku_tagging' },
      { label: 'Indikator IKU', to: '/iku/iku_list' },
      { label: 'Capaian Indikator IKU', to: '/iku/iku_capaian' },
    ]
  },
  { label: 'Renja', icon: <MdViewList />, to: '/renja' },
  { label: 'Realisasi', icon: <MdAssignmentTurnedIn />, to: '/Realisasi' },
  {
    label: 'Konfigurasi',
    icon: <MdSettings />,
    submenu: [
      { label: 'User', to: '/konfigurasi/user' },
      { label: 'Transfer Data', to: '/konfigurasi/transferdata' },
    ]
  },
]

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

  const location = useLocation()
  const prevSidebarOpen = useRef(sidebarOpen)

  useEffect(() => {
    if (!prevSidebarOpen.current && sidebarOpen) {
      const openParentMenu: { [key: string]: boolean } = {}
      menus.forEach(menu => {
        if (menu.submenu?.some(sub => sub.to === location.pathname)) {
          openParentMenu[menu.label] = true
        }
      })
      setOpenMenus(openParentMenu)
    }
    if (prevSidebarOpen.current && !sidebarOpen) {
      setOpenMenus({})
    }

    prevSidebarOpen.current = sidebarOpen
  }, [sidebarOpen, location.pathname])

  const toggleMenu = (label: string) => {
    if (!sidebarOpen) {
      setSidebarOpen(true)
      setTimeout(() => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
      }, 0)
    } else {
      setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
    }
  }


  const renderMenu = (menu: MenuItem) => {
    if (menu.type === 'separator') {
      return (
        <div key={menu.label} className="px-3">
          {sidebarOpen ? (
            <div className="py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-nowrap">
              {menu.label}
            </div>
          ) : (
            <div className="border-t border-gray-300 my-2" />
          )}
        </div>
      )
    }


    const isActive = menu.to === location.pathname
      || menu.submenu?.some(sub => sub.to === location.pathname);

    if (menu.submenu) {
      return (
        <div key={menu.label}>
          <button
            type="button"
            onClick={() => toggleMenu(menu.label)}
            className={`sidelink w-full flex items-center justify-between ${isActive && !openMenus[menu.label] ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              {menu.icon}
              <span className={`${sidebarOpen ? "" : "close"}`}>{menu.label}</span>
            </div>
            {sidebarOpen && <MdKeyboardArrowDown className={`transition-transform ${openMenus[menu.label] ? "rotate-180" : ""}`} />}
          </button>
          {sidebarOpen && (
            <div
              className={`ml-6 flex flex-col space-y-2 mt-2 overflow-hidden transition-all duration-200 ease-in-out
      ${openMenus[menu.label] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {menu.submenu.map(sub => (
                <Link
                  key={sub.label}
                  to={sub.to!}
                  className="sidelink"
                >
                  <span className={`flex flex-row gap-2 items-center ${sidebarOpen ? "" : "close"}`}>
                    <MdFiberManualRecord />
                    {sub.label}
                  </span>
                </Link>
              ))}
            </div>
          )}

        </div>
      )
    }

    return (
      <Link key={menu.label} to={menu.to!} className="sidelink">
        {menu.icon}
        <span className={`${sidebarOpen ? "" : "close"}`}>{menu.label}</span>
      </Link>
    )
  }


  return (
    <aside
      className={`sidebar ${sidebarOpen ? "" : "close"}`}>
      <div className='flex flex-row items-center justify-center p-4'>
        <div className={`aspect-auto sidelogo ${sidebarOpen ? "" : "close"}`}>
          <img src="/bengkulu-utara-logo.webp" alt="" className='max-w-[32px]' />
        </div>
        <div className={`sidetitle ${sidebarOpen ? "" : "close"}`}>
          <h4>e-MONEV RKPD</h4>
          <span>Kabupaten Bengkulu Utara</span><br />
        </div>
      </div>
      <nav className='overflow-y-auto overflow-x-hidden sidebar-scroll space-y-2 p-4'>
        {menus.map(renderMenu)}
      </nav>
    </aside>
  )
}

export default Sidebar
