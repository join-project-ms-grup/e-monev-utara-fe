import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import TopBar from '../../components/Topbar';

export const Route = createFileRoute('/_dashboard')({
    beforeLoad: ({ context }) => {
        const { token } = context.auth
        if (!token) {
            throw redirect({ to: "/auth" })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Topbar */}
                    <TopBar toggleSidebar={toggleSidebar} />

                    {/* Content */}
                    <main className="flex-1 p-8 space-y-4">
                        <Breadcrumb />
                        <Outlet />
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </>
    )
}
