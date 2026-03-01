'use client';

import { Menu, Flame, Zap, User, Settings, LogOut, FileText, CreditCard, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGamificationStore } from '@/stores/gamificationStore';
import { useUserStore } from '@/stores/userStore';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
    onMenuClick: () => void;
    onDesktopMenuClick?: () => void;
}

export default function Topbar({ onMenuClick, onDesktopMenuClick }: TopbarProps) {
    const router = useRouter();
    const { level, streak, getProgress, getAvatarStage, hydrateGamification } = useGamificationStore();
    const { profile, setUserProfile, setOnboarded } = useUserStore();
    const progress = getProgress();
    const avatar = getAvatarStage();

    const handleLogout = () => {
        // Clear Zustand stores
        setUserProfile({
            id: '',
            name: '',
            age: 0,
            height: '',
            weight: 0,
            goals: [],
            avatar: 'beginner',
            primaryClass: undefined,
            createdAt: '',
        });
        setOnboarded(false);
        hydrateGamification({ xp: 0, level: 1, streak: 0 });

        // Redirect to landing page
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-30 glass-card border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Left: Menu + Title */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                        <Menu size={22} />
                    </button>
                    {onDesktopMenuClick && (
                        <button
                            onClick={onDesktopMenuClick}
                            className="hidden lg:block text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                            <Menu size={22} />
                        </button>
                    )}
                    <div className="hidden sm:block">
                        <h2 className="text-sm font-medium text-muted-foreground">Welcome back</h2>
                    </div>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-4">
                    {/* Streak */}
                    <div className="flex items-center gap-1.5 text-sm">
                        <Flame size={16} className="text-orange-400" />
                        <span className="font-bold text-orange-400">{streak}</span>
                        <span className="text-muted-foreground hidden sm:inline text-xs">day streak</span>
                    </div>

                    {/* Level + XP Bar */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <Zap size={16} className="text-orange-400" />
                            <span className="text-sm font-bold">Lv.{level}</span>
                        </div>
                        <div className="w-20 hidden sm:block">
                            <Progress value={progress.percentage} className="h-2" />
                        </div>
                    </div>

                    {/* Avatar */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center glow cursor-pointer hover:scale-105 transition-transform outline-none">
                                <User size={18} className="text-zinc-50" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800/50 text-zinc-50 shadow-xl shadow-black/50 overflow-hidden">
                            <DropdownMenuLabel className="font-normal py-3">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{profile?.name || 'Explorer'}</p>
                                    <p className="text-[10px] uppercase tracking-wider mt-1 text-orange-400">Level {level} {avatar.name}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-900/50" />
                            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-900/50 focus:bg-zinc-900/50 py-2.5" onClick={() => router.push('/profile')}>
                                <User className="mr-2 h-4 w-4 text-zinc-50/70" />
                                <span>My Character</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-900/50 focus:bg-zinc-900/50 py-2.5" onClick={() => router.push('/settings')}>
                                <Settings className="mr-2 h-4 w-4 text-zinc-50/70" />
                                <span>Preferences</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-900/50 focus:bg-zinc-900/50 py-2.5" onClick={() => router.push('/billing')}>
                                <CreditCard className="mr-2 h-4 w-4 text-zinc-50/70" />
                                <span>Forge Pass / Billing</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-zinc-900/50" />

                            <DropdownMenuItem className="cursor-pointer hover:bg-zinc-900/50 focus:bg-zinc-900/50 py-2.5" onClick={() => router.push('/support')}>
                                <HelpCircle className="mr-2 h-4 w-4 text-zinc-50/70" />
                                <span>Help & Support</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-zinc-900/50" />

                            <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 py-2.5" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Save & Quit</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
