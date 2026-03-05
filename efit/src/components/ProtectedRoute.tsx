'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/forgot-password'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { profile } = useUserStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const isPublicRoute = publicRoutes.includes(pathname);
        const isAuthenticated = !!profile.id;

        if (!isAuthenticated && !isPublicRoute) {
            // Trying to access protected route while logged out
            router.replace('/login');
        } else if (isAuthenticated && pathname === '/login') {
            // Trying to access login while already logged in
            router.replace('/dashboard');
        }
    }, [pathname, profile.id, router, isClient]);

    // Simple loading state to prevent flash of content
    if (!isClient) return null;

    return <>{children}</>;
}
