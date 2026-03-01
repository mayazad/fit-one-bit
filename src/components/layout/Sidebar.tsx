'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Dumbbell,
    UtensilsCrossed,
    TrendingUp,
    Bot,
    User,
    Settings,
    Trophy,
    X,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/diet', label: 'Diet Plan', icon: UtensilsCrossed },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
    { href: '/achievements', label: 'Achievements', icon: Trophy },
    { href: '/ai-coach', label: 'AI Coach', icon: Bot },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
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
                    <Link href="/" className="flex items-center gap-3" onClick={onClose}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg glow">
                            F
                        </div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text">FitForge</h1>
                            <p className="text-[10px] text-muted-foreground -mt-0.5">Body Transformation</p>
                        </div>
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
                                                ? 'text-primary-foreground'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                            }
                    `}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border border-cyan-500/30 rounded-xl"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <Icon size={18} className="relative z-10" />
                                        <span className="relative z-10">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-dot"
                                                className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-400"
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
                        <p className="text-xs text-muted-foreground">Powered by FitForge AI</p>
                        <p className="text-xs font-medium gradient-text">FitForge v1.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
