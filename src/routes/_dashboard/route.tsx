import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TopBar from '../../components/Topbar';
import { useAuth } from '../../contexts/AuthContext';

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: ({ context }) => {
    const { token } = context;
    if (!token) {
      throw redirect({ to: '/auth' });
    }
  },
  component: RouteComponent,
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
        <div className='flex-1 flex flex-col'>
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
