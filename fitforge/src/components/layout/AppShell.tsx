'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import { PageTransition } from '@/components/PageTransition';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

    // Landing page, onboarding, and auth get a clean, standalone layout
    const standaloneRoutes = ['/', '/onboarding', '/login'];
    if (standaloneRoutes.includes(pathname)) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                desktopOpen={desktopSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
                <Topbar
                    onMenuClick={() => setSidebarOpen(true)}
                    onDesktopMenuClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                />
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-6 px-4 sm:px-6 py-6">
                    <PageTransition>{children}</PageTransition>
                </main>
            </div>
            <MobileNav />
        </div>
    );
}
