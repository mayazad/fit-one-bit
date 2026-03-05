'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Activity,
    Dumbbell,
    UtensilsCrossed,
    TrendingUp,
    Bot,
    User,
    Settings,
    Trophy,
    X,
    CheckCircle,
    CalendarDays,
    Moon,
    StretchHorizontal
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/sleep', label: 'Sleep', icon: Moon },
    { href: '/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/flexibility', label: 'Flexibility', icon: StretchHorizontal },
    { href: '/diet', label: 'Diet Plan', icon: UtensilsCrossed },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
    { href: '/habits', label: 'Habits', icon: CheckCircle }, // Added new habits link
    { href: '/gamification', label: 'Gamification', icon: Trophy },
    { href: '/achievements', label: 'Achievements', icon: Trophy },
    { href: '/ai-coach', label: 'AI Coach', icon: Bot },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    desktopOpen?: boolean;
}

export default function Sidebar({ isOpen, onClose, desktopOpen = true }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full z-50 glass-card border-r border-border
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          ${desktopOpen ? 'lg:translate-x-0 lg:static lg:z-auto lg:w-64 lg:px-0' : 'lg:-translate-x-full lg:w-0 lg:border-none lg:px-0 lg:opacity-0 lg:absolute'}
        `}
            >
                {/* Logo */}
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
                        <Image src="/logo.png" alt="eFit Logo" width={150} height={50} priority className="w-auto h-8 lg:h-10 transition-transform duration-300 group-hover:scale-105" />
                        <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 hover:scale-105 transition-transform duration-300">eFit</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-3 mt-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group
                      ${isActive
                                                ? 'text-orange-500 bg-orange-500/10'
                                                : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/50'
                                            }
                    `}
                                    >
                                        <Icon size={18} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-orange-500' : ''}`} />
                                        <span className="relative z-10">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-dot"
                                                className="absolute right-3 w-1.5 h-1.5 rounded-full bg-orange-500"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <div className="glass-card rounded-xl p-3">
                        <p className="text-xs text-muted-foreground">Powered by eFit AI</p>
                        <p className="text-xs font-medium gradient-text">eFit v1.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
