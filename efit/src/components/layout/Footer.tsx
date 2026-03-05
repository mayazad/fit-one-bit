'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on specific pages where it interferes with the UI (like AI Coach)
    if (pathname === '/ai-coach') {
        return null;
    }

    return (
        <footer className="w-full pt-6 pb-24 md:pb-6 mt-auto text-center text-xs font-medium text-emerald-600/60 dark:text-slate-500 tracking-wide border-t border-emerald-100/50 dark:border-zinc-800/50 bg-[#f4f7f6]/80 dark:bg-[#0f172a]/80 relative z-50 backdrop-blur-sm">
            &copy; {new Date().getFullYear()} MayazAD. All rights reserved.
        </footer>
    );
}
