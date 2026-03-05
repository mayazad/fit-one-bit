'use client';

import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Flame, Medal, Award, Crown, Zap } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
        }
    })
};

// Map icon strings to actual Lucide components
const iconMap: Record<string, any> = {
    target: Target,
    flame: Flame,
    zap: Zap,
    dumbbell: Medal,
    trophy: Trophy,
    sword: Award,
    crown: Crown,
    salad: Star,
    droplets: Star,
    star: Star,
    sparkles: Star,
    gem: Star,
    sunrise: Star,
    activity: Star,
    shield: Shield,
};

import { Shield } from 'lucide-react'; // Backup import 

export default function GamificationPage() {
    const { xp, level, badges, getProgress } = useGamificationStore();
    const { xpNeeded, percentage } = getProgress();

    // Mock Weekly Challenges
    const weeklyChallenges = [
        { id: 1, title: 'Burn 1500 kcal', progress: 850, target: 1500, unit: 'kcal', xpReward: 150 },
        { id: 2, title: 'Drink 50 Glasses of Water', progress: 32, target: 50, unit: 'glasses', xpReward: 100 },
        { id: 3, title: 'Workout 4 Times', progress: 2, target: 4, unit: 'workouts', xpReward: 200 }
    ];

    // Mock Leaderboard
    const leaderboard = [
        { rank: 1, name: 'Alex Fit', xp: xp + 420 },
        { rank: 2, name: 'Sarah Strong', xp: xp + 150 },
        { rank: 3, name: 'You', xp: xp, isUser: true },
        { rank: 4, name: 'John Doe', xp: xp - 300 },
        { rank: 5, name: 'Newbie21', xp: xp - 850 }
    ].sort((a, b) => b.xp - a.xp).map((user, index) => ({ ...user, rank: index + 1 }));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Gamification Hub</h1>
                <p className="text-sm text-muted-foreground">Compete, complete challenges, and earn badges.</p>
            </motion.div>

            {/* Current Level Banner */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)]">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex flex-col items-center justify-center p-1 shadow-lg shrink-0">
                            <div className="w-full h-full rounded-full border-2 border-white/20 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-orange-100/80">LEVEL</span>
                                <span className="text-3xl font-black text-white leading-none">{level}</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full space-y-2 text-center md:text-left">
                            <h2 className="text-xl font-bold text-orange-400">Keep Grinding!</h2>
                            <div className="flex justify-between text-xs text-zinc-400 font-medium px-1">
                                <span>{xp} XP</span>
                                <span>{xpNeeded} XP for next level</span>
                            </div>
                            <Progress value={percentage} className="h-3 bg-zinc-900/50" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Challenges & Leaderboard */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Weekly Challenges */}
                    <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                        <Card className="glass-card border-zinc-800/50">
                            <CardHeader className="pb-3 border-b border-zinc-800/50">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Target size={18} className="text-orange-400" />
                                    Weekly Challenges
                                </CardTitle>
                                <CardDescription className="text-xs">Reset every Monday</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-zinc-800/50">
                                    {weeklyChallenges.map(challenge => (
                                        <div key={challenge.id} className="p-4 hover:bg-zinc-800/20 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-sm text-zinc-200">{challenge.title}</h4>
                                                <UIBadge variant="secondary" className="bg-orange-500/10 text-orange-400 border-none text-[10px]">+{challenge.xpReward} XP</UIBadge>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                <span>{challenge.progress} {challenge.unit}</span>
                                                <span>{challenge.target} {challenge.unit}</span>
                                            </div>
                                            <Progress
                                                value={(challenge.progress / challenge.target) * 100}
                                                className="h-1.5"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Leaderboard */}
                    <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
                        <Card className="glass-card border-zinc-800/50">
                            <CardHeader className="pb-3 border-b border-zinc-800/50">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Trophy size={18} className="text-amber-400" />
                                    Global Leaderboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-zinc-800/50">
                                    {leaderboard.map(user => (
                                        <div key={user.rank} className={`p-3 flex items-center gap-3 ${user.isUser ? 'bg-orange-500/5 border-l-2 border-l-orange-500' : ''}`}>
                                            <div className={`w-6 text-center font-bold font-mono text-sm ${user.rank === 1 ? 'text-amber-400' :
                                                user.rank === 2 ? 'text-zinc-300' :
                                                    user.rank === 3 ? 'text-orange-700' :
                                                        'text-zinc-600'
                                                }`}>
                                                #{user.rank}
                                            </div>
                                            <div className={`flex-1 font-medium text-sm ${user.isUser ? 'text-orange-400' : 'text-zinc-300'}`}>
                                                {user.name} {user.isUser && '(You)'}
                                            </div>
                                            <div className="text-xs font-mono text-muted-foreground bg-zinc-900 px-2 py-1 rounded">
                                                {user.xp.toLocaleString()} XP
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Column: Badges */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="h-full">
                        <Card className="glass-card border-zinc-800/50 h-full">
                            <CardHeader className="pb-3 border-b border-zinc-800/50 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Medal size={18} className="text-orange-400" />
                                        Badge Collection
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
                                    </CardDescription>
                                </div>
                                <Progress
                                    value={(badges.filter(b => b.unlocked).length / badges.length) * 100}
                                    className="h-2 w-24"
                                />
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {badges.map(badge => {
                                        const IconComponent = iconMap[badge.icon] || Star;

                                        return (
                                            <div
                                                key={badge.id}
                                                className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 text-center ${badge.unlocked
                                                    ? 'bg-zinc-900/80 border-orange-500/30 hover:border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                                                    : 'bg-zinc-900/30 border-zinc-800/50 grayscale opacity-50'
                                                    }`}
                                            >
                                                {badge.unlocked && (
                                                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                        <Star size={8} /> DONE
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.unlocked ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-400' : 'bg-zinc-800 text-zinc-500'
                                                    }`}>
                                                    <IconComponent size={24} className={badge.unlocked ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : ''} />
                                                </div>
                                                <h3 className={`text-xs font-bold mb-1 ${badge.unlocked ? 'text-zinc-100' : 'text-zinc-500'}`}>
                                                    {badge.name}
                                                </h3>
                                                <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                                                    {badge.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
