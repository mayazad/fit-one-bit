'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Target, Save, Edit2, Star, Flame, Zap, Dumbbell, Trophy, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { useGamificationStore } from '@/stores/gamificationStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { getAvatarForLevel } from '@/data/gamification';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4 },
    }),
};

export default function ProfilePage() {
    const { profile, updateProfile } = useUserStore();
    const { level, xp, streak, longestStreak, badges } = useGamificationStore();
    const { completedWorkouts, totalExercisesCompleted } = useWorkoutStore();
    const avatar = getAvatarForLevel(level);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: profile.name,
        age: profile.age.toString(),
        height: profile.height,
        weight: profile.weight.toString(),
    });

    const handleSave = () => {
        updateProfile({
            name: form.name,
            age: parseInt(form.age) || 25,
            height: form.height,
            weight: parseFloat(form.weight) || 56,
        });
        setEditing(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Profile</h1>
                <p className="text-sm text-muted-foreground">Your fitness identity and progress.</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="bg-gradient-to-br from-cyan-500/10 via-violet-600/10 to-fuchsia-500/10 border-white/5">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center glow">
                                <User size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{profile.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{avatar.name}</Badge>
                                    <Badge variant="secondary">Level {level}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {editing ? (
                            <div className="space-y-3">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                                        <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="bg-white/5 border-white/10" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Height</label>
                                        <Input value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="bg-white/5 border-white/10" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
                                        <Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="bg-white/5 border-white/10" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} size="sm" className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-0">
                                        <Save size={14} className="mr-1" /> Save
                                    </Button>
                                    <Button onClick={() => setEditing(false)} variant="outline" size="sm" className="border-white/10">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { label: 'Age', value: `${profile.age} years` },
                                        { label: 'Height', value: profile.height },
                                        { label: 'Weight', value: `${profile.weight} kg` },
                                        { label: 'Level', value: `Level ${level}` },
                                    ].map((item) => (
                                        <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                                            <p className="text-xs text-muted-foreground">{item.label}</p>
                                            <p className="text-sm font-medium mt-0.5">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="mt-3 border-white/10">
                                    <Edit2 size={14} className="mr-1" /> Edit Profile
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Goals */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target size={18} className="text-cyan-400" />
                            Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {profile.goals.map((goal) => (
                                <Badge key={goal} variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                                    <Target size={10} className="mr-1" />{goal}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Lifetime Stats */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="glass-card border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Lifetime Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {([
                                { label: 'Total XP', value: xp.toString(), Icon: Star, color: 'text-violet-400' },
                                { label: 'Current Streak', value: `${streak} days`, Icon: Flame, color: 'text-orange-400' },
                                { label: 'Longest Streak', value: `${longestStreak} days`, Icon: Zap, color: 'text-yellow-400' },
                                { label: 'Workouts Done', value: completedWorkouts.toString(), Icon: Dumbbell, color: 'text-cyan-400' },
                                { label: 'Exercises Done', value: totalExercisesCompleted.toString(), Icon: Trophy, color: 'text-emerald-400' },
                                { label: 'Badges Earned', value: `${badges.filter(b => b.unlocked).length}`, Icon: Award, color: 'text-amber-400' },
                            ] as const).map((stat) => (
                                <div key={stat.label} className="p-3 rounded-xl bg-white/3 border border-white/5 text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <stat.Icon size={20} className={stat.color} />
                                    </div>
                                    <p className="text-lg font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
