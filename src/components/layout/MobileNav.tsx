'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dumbbell, UtensilsCrossed, TrendingUp, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
    { href: '/', icon: LayoutDashboard, label: 'Home' },
    { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
    { href: '/diet', icon: UtensilsCrossed, label: 'Diet' },
    { href: '/progress', icon: TrendingUp, label: 'Progress' },
    { href: '/ai-coach', icon: Bot, label: 'AI Coach' },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border">
            <div className="flex items-center justify-around py-2 px-1">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-active"
                                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon
                                size={20}
                                className={isActive ? 'text-cyan-400' : 'text-muted-foreground'}
                            />
                            <span
                                className={`text-[10px] ${isActive ? 'text-cyan-400 font-medium' : 'text-muted-foreground'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
