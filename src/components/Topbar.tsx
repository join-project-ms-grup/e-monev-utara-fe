import { Link, useMatches } from '@tanstack/react-router';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MdKeyboardArrowDown, MdMenu, MdSwapHoriz } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import Cookies from 'js-cookie';
import AksiButton from './inputs/AksiButton';
import { getPeriodeFromCookie } from '../lib/usercookie';

type TopbarProps = {
  toggleSidebar: () => void;
};

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const { user, refreshPeriodeCookie } = useAuth();
  const matches = useMatches();
  const pageTitle = matches[matches.length - 1].staticData?.title;

  return (
    <header className='z-10 sticky top-0 h-[70px] text-gray-800 p-4 flex justify-between items-center space-x-4 border-b-1 border-gray-200 bg-white'>
      <button
        className='transition-all active:scale-80 hover:opacity-60'
        onClick={toggleSidebar}
      >
        <MdMenu className='size-6' />
      </button>
      <div className='flex-1'>
        <h4>{pageTitle}</h4>
      </div>
      <div className='inline-flex gap-2 items-center'>
        <b>
          Periode: {getPeriodeFromCookie()?.mulai} -{' '}
          {getPeriodeFromCookie()?.akhir}
        </b>
        <AksiButton
          tooltip='Ubah Periode'
          className='hover:bg-[var(--color-2)]!'
          Icon={MdSwapHoriz}
          onClick={() => {
            Cookies.remove('skip_periode');
            Cookies.remove('periode');
            refreshPeriodeCookie();
          }}
        />
      </div>
      <Menu>
        <MenuButton
          className={
            'flex flex-row justify-center items-center gap-2 px-2 py-2 focus-visible:outline-0'
          }
        >
          <div className='flex flex-col items-start'>
            <span className='font-medium'>{user?.nama}</span>
            <span className='text-sm'>{user?.roleName}</span>
          </div>
          <MdKeyboardArrowDown />
        </MenuButton>
        <MenuItems
          anchor='bottom'
          modal={false}
          className={
            'right-0 bg-white text-black p-2 w-36 rounded shadow-lg focus-visible:outline-0 z-20'
          }
        >
          <MenuItem>
            <Link
              className='block py-1 px-2 hover:bg-gray-200 rounded'
              to={'/auth/logout'}
            >
              Keluar
            </Link>
          </MenuItem>
        </MenuItems>
      </Menu>
    </header>
  );
};

export default Topbar;
