import { Link, useMatches } from '@tanstack/react-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MdMenu } from 'react-icons/md';

type TopbarProps = {
    toggleSidebar: () => void;
};

const Topbar = ({ toggleSidebar }: TopbarProps) => {
    const matches = useMatches();
    // Judul Route
    const pageTitle = matches[matches.length - 1].staticData?.title;

    return (
        <header className="topbar">
            <button
                className='transition-all active:scale-80 hover:opacity-60'
                onClick={toggleSidebar}
            >
                <MdMenu className='size-6' />
            </button>
            <div className='flex-1'>
                <h4>{pageTitle}</h4>
            </div>
            <Menu>
                <MenuButton className={'text-[#921733] flex flex-row justify-center items-center gap-2 px-2 py-2 focus-visible:outline-0'}>
                    {/* <div className='rounded-full overflow-hidden bg-[#921733]'>
                        <img src='/avatar/default-avatar.png' width={32} />
                    </div> */}
                    <span className='font-medium'>Administrator</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
                        <path d="M8 12l-6-6h12z" />
                    </svg>
                </MenuButton>
                <MenuItems anchor="bottom" className={"right-0 mt-2 bg-white text-black p-2 w-32 rounded shadow-lg focus-visible:outline-0"}>
                    <MenuItem>
                        <a className="block py-1 px-2 hover:bg-gray-200 rounded" href="/#profil">
                            Profil
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <Link className="block py-1 px-2 hover:bg-gray-200 rounded" to={'/auth/logout'}>Keluar</Link>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </header>
    )
}

export default Topbar