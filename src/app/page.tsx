'use client';

import { motion } from 'framer-motion';
import {
  Flame, Zap, Dumbbell, Target, Droplets, Moon,
  ChevronRight, Trophy, Utensils, TrendingUp,
  CheckCircle2, Circle, Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGamificationStore } from '@/stores/gamificationStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useDietStore } from '@/stores/dietStore';
import { getDailyQuote, getAvatarForLevel } from '@/data/gamification';
import { exercises } from '@/data/exercises';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DashboardPage() {
  const { level, streak, xp, waterGlasses, waterGoal, sleepHours, getProgress, addWater, removeWater, addXp } = useGamificationStore();
  const { weeklyPlan, completedWorkouts } = useWorkoutStore();
  const { getTodayCompletion } = useDietStore();
  const progress = getProgress();
  const avatar = getAvatarForLevel(level);
  const quote = getDailyQuote();

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const today = weeklyPlan[todayIndex];
  const todayMeals = getTodayCompletion();
  const mealsCompleted = Object.values(todayMeals).filter(Boolean).length;

  // Daily quests
  const quests = [
    { id: 'workout', title: 'Complete today\'s workout', xp: 50, done: today?.completed ?? false, icon: Dumbbell },
    { id: 'meal', title: 'Track all meals', xp: 20, done: mealsCompleted === 4, icon: Utensils },
    { id: 'water', title: `Drink ${waterGoal} glasses of water`, xp: 10, done: waterGlasses >= waterGoal, icon: Droplets },
    { id: 'sleep', title: 'Log sleep (7+ hours)', xp: 10, done: sleepHours >= 7, icon: Moon },
  ];
  const questsDone = quests.filter(q => q.done).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Section */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-violet-600/10 to-fuchsia-500/10 border border-white/5 p-6 sm:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-4xl glow shadow-2xl"
          >
            {avatar.emoji}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!</h1>
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {avatar.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Level {level} • {avatar.description}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">XP Progress</span>
                  <span className="text-cyan-400 font-medium">{progress.xp}/{progress.xpNeeded}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Streak', value: `${streak} days`, icon: Flame, color: 'text-orange-400', bg: 'from-orange-500/10 to-red-500/10' },
          { label: 'Level', value: `Level ${level}`, icon: Zap, color: 'text-cyan-400', bg: 'from-cyan-500/10 to-blue-500/10' },
          { label: 'Workouts', value: `${completedWorkouts}/6`, icon: Dumbbell, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-green-500/10' },
          { label: 'XP Total', value: `${xp} XP`, icon: Star, color: 'text-violet-400', bg: 'from-violet-500/10 to-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i + 1} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className={`bg-gradient-to-br ${stat.bg} border-white/5 hover:border-white/10 transition-all duration-300 group cursor-default`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={16} className={stat.color} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Quests + Quote */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quests */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target size={18} className="text-cyan-400" />
                    Daily Quests
                  </CardTitle>
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                    {questsDone}/{quests.length} Done
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {quests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${quest.done
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-white/3 border border-white/5 hover:border-white/10'
                      }`}
                  >
                    {quest.done ? (
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground flex-shrink-0" />
                    )}
                    <quest.icon size={16} className={quest.done ? 'text-emerald-400' : 'text-muted-foreground'} />
                    <span className={`flex-1 text-sm ${quest.done ? 'line-through text-muted-foreground' : ''}`}>
                      {quest.title}
                    </span>
                    <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                      +{quest.xp} XP
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Workout Preview */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Dumbbell size={18} className="text-emerald-400" />
                    Today&apos;s Workout — {days[new Date().getDay()]}
                  </CardTitle>
                  <Link href="/workouts">
                    <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
                      View All <ChevronRight size={14} />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {today?.isRestDay ? (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-2">😴</p>
                    <p className="text-lg font-medium">Rest Day</p>
                    <p className="text-sm text-muted-foreground">Your muscles are recovering and growing!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {today?.exercises.slice(0, 4).map((exId) => {
                      const ex = exercises.find(e => e.id === exId);
                      if (!ex) return null;
                      const isDone = today.completedExercises.includes(exId);
                      return (
                        <div key={exId} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDone ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/3 border border-white/5'}`}>
                          <span className="text-xl">{ex.icon}</span>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>{ex.name}</p>
                            <p className="text-xs text-muted-foreground">{ex.sets} × {ex.reps}</p>
                          </div>
                          {isDone && <CheckCircle2 size={16} className="text-emerald-400" />}
                        </div>
                      );
                    })}
                    {(today?.exercises.length ?? 0) > 4 && (
                      <p className="text-xs text-muted-foreground text-center pt-1">+{(today?.exercises.length ?? 0) - 4} more exercises</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Water + Quick Links + Quote */}
        <div className="space-y-6">
          {/* Water Tracker */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets size={18} className="text-blue-400" />
                  Water Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400 mb-1">{waterGlasses}</p>
                  <p className="text-xs text-muted-foreground mb-3">of {waterGoal} glasses</p>
                  <Progress value={(waterGlasses / waterGoal) * 100} className="h-2 mb-3" />
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={removeWater}
                      className="text-xs border-white/10 hover:bg-white/5"
                    >
                      −
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => { addWater(); addXp(5); }}
                      className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                    >
                      + Add Glass 💧
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Start Workout', href: '/workouts', icon: Dumbbell, color: 'text-emerald-400' },
                  { label: 'Log Meal', href: '/diet', icon: Utensils, color: 'text-amber-400' },
                  { label: 'Track Progress', href: '/progress', icon: TrendingUp, color: 'text-cyan-400' },
                  { label: 'Achievements', href: '/achievements', icon: Trophy, color: 'text-violet-400' },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group">
                      <action.icon size={16} className={action.color} />
                      <span className="text-sm flex-1">{action.label}</span>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-white/5">
              <CardContent className="p-5">
                <p className="text-sm italic leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
                <p className="text-xs text-muted-foreground mt-2">— {quote.author}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
