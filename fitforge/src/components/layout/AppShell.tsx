'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import { useGamificationStore } from '@/stores/gamificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, X } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

    // Pull only primitives + stable actions — avoid pulling objects/arrays that
    // change reference every render (which would make useEffect fire infinitely).
    const showLevelUpModal = useGamificationStore(s => s.showLevelUpModal);
    const clearLevelUpModal = useGamificationStore(s => s.clearLevelUpModal);
    const level = useGamificationStore(s => s.level);
    const badgeCount = useGamificationStore(s => s.recentlyUnlockedBadges.length);
    const firstBadge = useGamificationStore(s => s.recentlyUnlockedBadges[0]);
    const clearRecentlyUnlockedBadges = useGamificationStore(s => s.clearRecentlyUnlockedBadges);

    // ── BUG FIX #1: recordDailyLogin ─────────────────────────────────────────
    // Previously: useEffect(() => {recordDailyLogin();}, [recordDailyLogin])
    // The Zustand action is a new function reference on every render when
    // extracted via destructuring, causing an infinite loop.
    // Fix: Use a ref so the effect only runs once on mount.
    const didRunDailyLogin = useRef(false);
    useEffect(() => {
        if (didRunDailyLogin.current) return;
        didRunDailyLogin.current = true;
        useGamificationStore.getState().recordDailyLogin();
    }, []);

    // ── BUG FIX #2: Infinite Confetti ────────────────────────────────────────
    // Previously: useEffect(() => { confetti(...) }, [showLevelUpModal, recentlyUnlockedBadges])
    // `recentlyUnlockedBadges` is a new array reference every render, so
    // confetti would fire on every single re-render (memory/CPU explosion!).
    // Fix: Depend on the primitive `badgeCount` and track the last-seen count.
    const lastBadgeCount = useRef(0);
    useEffect(() => {
        const shouldFire =
            showLevelUpModal ||
            badgeCount > lastBadgeCount.current;

        if (shouldFire) {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f97316', '#10b981', '#3b82f6', '#eab308'],
            });
        }
        lastBadgeCount.current = badgeCount;
    }, [showLevelUpModal, badgeCount]);

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
                    {children}
                </main>
            </div>
            <MobileNav />

            {/* Global Gamification Celebration Modals */}
            <AnimatePresence>
                {/* Level Up Modal */}
                {showLevelUpModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
                            className="bg-zinc-900 border-2 border-orange-500/50 p-8 rounded-2xl max-w-sm w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>

                            <button
                                onClick={clearLevelUpModal}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 rounded-full p-1"
                            >
                                <X size={16} />
                            </button>

                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)] mb-6">
                                <Trophy size={48} className="text-white drop-shadow-md" />
                            </div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400"
                            >
                                LEVEL UP!
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-zinc-300 mb-6"
                            >
                                You are now Level <span className="font-bold text-white text-xl">{level}</span>.
                                Keep crushing your goals!
                            </motion.p>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                onClick={clearLevelUpModal}
                                className="w-full py-3 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 transition-colors text-white"
                            >
                                Awesome!
                            </motion.button>
                        </motion.div>
                    </div>
                )}

                {/* Badge Unlock Notification (Show one at a time) */}
                {badgeCount > 0 && !showLevelUpModal && firstBadge && (
                    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className="bg-zinc-900 border border-emerald-500/50 p-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] max-w-sm flex items-start gap-4"
                        >
                            <div className="mt-1 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                                <Star size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Badge Unlocked!</div>
                                <h3 className="font-bold text-zinc-100">{firstBadge.name}</h3>
                                <p className="text-xs text-zinc-400">{firstBadge.description}</p>
                            </div>
                            <button
                                onClick={clearRecentlyUnlockedBadges}
                                className="text-zinc-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
