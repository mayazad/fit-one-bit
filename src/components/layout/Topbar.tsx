'use client';

import { Menu, Flame, Zap } from 'lucide-react';
import { useGamificationStore } from '@/stores/gamificationStore';
import { Progress } from '@/components/ui/progress';

interface TopbarProps {
    onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const { level, streak, getProgress, getAvatarStage } = useGamificationStore();
    const progress = getProgress();
    const avatar = getAvatarStage();

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
                            <Zap size={16} className="text-cyan-400" />
                            <span className="text-sm font-bold">Lv.{level}</span>
                        </div>
                        <div className="w-20 hidden sm:block">
                            <Progress value={progress.percentage} className="h-2" />
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-lg glow cursor-pointer">
                        {avatar.emoji}
                    </div>
                </div>
            </div>
        </header>
    );
}
