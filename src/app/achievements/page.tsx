'use client';

import { motion } from 'framer-motion';
import { Trophy, Lock, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamificationStore } from '@/stores/gamificationStore';
import { avatarStages, getXpForLevel } from '@/data/gamification';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4 },
    }),
};

export default function AchievementsPage() {
    const { level, xp, badges, streak, longestStreak, getProgress } = useGamificationStore();
    const progress = getProgress();

    const unlockedCount = badges.filter(b => b.unlocked).length;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Achievements</h1>
                <p className="text-sm text-muted-foreground">Level up and unlock rewards 🏆</p>
            </motion.div>

            {/* Level Progress */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="bg-gradient-to-br from-cyan-500/10 via-violet-600/10 to-fuchsia-500/10 border-white/5">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-3xl glow">
                                    {avatarStages.find(s => level >= s.level)?.emoji || '🌱'}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Level {level}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {avatarStages.find(s => level >= s.level)?.name || 'Novice'} •{' '}
                                        {avatarStages.find(s => level >= s.level)?.description}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold gradient-text">{xp} XP</p>
                                <p className="text-xs text-muted-foreground">Total earned</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Next Level</span>
                                <span className="text-cyan-400">{progress.xp}/{progress.xpNeeded} XP</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress.percentage}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Avatar Evolution */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Star size={18} className="text-yellow-400" />
                            Avatar Evolution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                            {avatarStages.map((stage, i) => {
                                const isUnlocked = level >= stage.level;
                                const isCurrent = level >= stage.level && (i === avatarStages.length - 1 || level < avatarStages[i + 1].level);
                                return (
                                    <div key={stage.stage} className="flex flex-col items-center flex-shrink-0">
                                        <div
                                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 transition-all ${isCurrent
                                                    ? 'bg-gradient-to-br from-cyan-500 to-violet-600 glow scale-110'
                                                    : isUnlocked
                                                        ? 'bg-gradient-to-br from-cyan-500/20 to-violet-600/20'
                                                        : 'bg-white/5 grayscale opacity-40'
                                                }`}
                                        >
                                            {isUnlocked ? stage.emoji : <Lock size={20} />}
                                        </div>
                                        <p className={`text-xs font-medium ${isCurrent ? 'text-cyan-400' : isUnlocked ? '' : 'text-muted-foreground'}`}>
                                            {stage.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">Lv.{stage.level}+</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Current Streak', value: `${streak} days`, icon: '🔥' },
                    { label: 'Longest Streak', value: `${longestStreak} days`, icon: '⚡' },
                    { label: 'Badges Earned', value: `${unlockedCount}/${badges.length}`, icon: '🏅' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} custom={i + 2} initial="hidden" animate="visible" variants={fadeUp}>
                        <Card className="glass-card border-white/5 text-center">
                            <CardContent className="p-4">
                                <p className="text-2xl mb-1">{stat.icon}</p>
                                <p className="text-lg font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Badges */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-white/5">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Trophy size={18} className="text-yellow-400" />
                                Badges
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">
                                {unlockedCount}/{badges.length} Unlocked
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {badges.map((badge, i) => (
                                <motion.div
                                    key={badge.id}
                                    custom={i + 6}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeUp}
                                    className={`p-4 rounded-xl text-center transition-all ${badge.unlocked
                                            ? 'bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20'
                                            : 'bg-white/3 border border-white/5 opacity-50'
                                        }`}
                                >
                                    <p className="text-3xl mb-2">{badge.unlocked ? badge.icon : '🔒'}</p>
                                    <p className={`text-sm font-medium mb-0.5 ${badge.unlocked ? '' : 'text-muted-foreground'}`}>
                                        {badge.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                                    {badge.unlocked && badge.unlockedAt && (
                                        <Badge variant="secondary" className="text-[10px] mt-2">
                                            ✓ Unlocked
                                        </Badge>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
