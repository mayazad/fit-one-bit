'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvolvingAvatar } from '@/components/EvolvingAvatar';
import {
  Flame, Zap, Dumbbell, Target, Droplets, Moon,
  ChevronRight, Trophy, Utensils, TrendingUp,
  CheckCircle2, Circle, Star, Sparkles, MessageSquareQuote,
  BedDouble, Plus, Minus, Activity,
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

function getTimeGreetingAndGradient() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: 'Good Morning!', gradient: 'from-orange-900/80 via-rose-900/40 to-slate-900' };
  if (hour >= 12 && hour < 17) return { greeting: 'Good Afternoon!', gradient: 'from-teal-900/80 via-blue-900/40 to-slate-900' };
  if (hour >= 17 && hour < 21) return { greeting: 'Good Evening!', gradient: 'from-purple-900/80 via-fuchsia-900/40 to-slate-900' };
  return { greeting: 'Good Night!', gradient: 'from-indigo-950 via-purple-900/40 to-slate-900' };
}



export default function DashboardPage() {
  const { level, streak, xp, waterGlasses, waterGoal, sleepHours, getProgress, addWater, removeWater, addXp } = useGamificationStore();
  const { weeklyPlan, completedWorkouts } = useWorkoutStore();
  const { getTodayCompletion } = useDietStore();
  const progress = getProgress();
  const avatar = getAvatarForLevel(level);
  const quote = getDailyQuote();
  const { greeting, gradient } = getTimeGreetingAndGradient();

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const today = weeklyPlan[todayIndex];
  const todayMeals = getTodayCompletion();
  const mealsCompleted = Object.values(todayMeals).filter(Boolean).length;

  // Interactive quests state
  const [questToggles, setQuestToggles] = useState<Record<string, boolean>>({});

  const quests = [
    { id: 'workout', title: 'Complete today\'s workout', xp: 50, done: today?.completed ?? false, icon: Dumbbell },
    { id: 'meal', title: 'Track all meals', xp: 20, done: mealsCompleted === 4, icon: Utensils },
    { id: 'water', title: `Drink ${waterGoal} glasses of water`, xp: 10, done: waterGlasses >= waterGoal, icon: Droplets },
    { id: 'sleep', title: 'Log sleep (7+ hours)', xp: 10, done: sleepHours >= 7, icon: Moon },
  ];

  const isQuestDone = (quest: typeof quests[0]) => quest.done || questToggles[quest.id];
  const questsDone = quests.filter(q => isQuestDone(q)).length;

  const toggleQuest = useCallback((id: string) => {
    const quest = quests.find(q => q.id === id);
    if (quest?.done) return;
    const newState = !questToggles[id];
    setQuestToggles(prev => ({ ...prev, [id]: newState }));
    if (newState && quest) {
      addXp(quest.xp);
      showXpToast(quest.xp);
    }
  }, [quests, questToggles, addXp]);

  // XP Toast notification
  const [xpToast, setXpToast] = useState<number | null>(null);
  const showXpToast = (amount: number) => {
    setXpToast(amount);
    setTimeout(() => setXpToast(null), 2000);
  };

  // Water splash animation state
  const [waterSplash, setWaterSplash] = useState(false);
  const handleAddWater = () => {
    addWater();
    addXp(5);
    showXpToast(5);
    setWaterSplash(true);
    setTimeout(() => setWaterSplash(false), 600);
  };

  // Sleep tracker
  const { setSleep } = useGamificationStore();
  const handleSleepChange = (h: number) => {
    const clamped = Math.max(0, Math.min(12, h));
    setSleep(clamped);
  };

  // Weekly heatmap (mock: active on days with completed exercises)
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapActivity = weeklyPlan.map(d => d.completedExercises.length / Math.max(d.exercises.length, 1));

  const sleepQuality = sleepHours >= 8 ? { label: 'Excellent', color: 'text-emerald-400' }
    : sleepHours >= 7 ? { label: 'Good', color: 'text-cyan-400' }
      : sleepHours >= 6 ? { label: 'Fair', color: 'text-yellow-400' }
        : { label: 'Poor', color: 'text-red-400' };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* ═══════════════════════════════════════════════ */}
      {/* XP TOAST NOTIFICATION (Fixed overlay)         */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {xpToast !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 backdrop-blur-md border border-cyan-500/30 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300">+{xpToast} XP</span>
            <span className="text-xs text-muted-foreground">earned!</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION with DiceBear Avatar              */}
      {/* ═══════════════════════════════════════════════ */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradient} backdrop-blur-md border border-white/10 shadow-2xl`}
      >
        {/* Deep grid background pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Ambient glow blobs & Spotlight for Avatar */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* Unified Flex Container */}
        <div className="relative w-full flex flex-col md:flex-row items-center overflow-hidden rounded-2xl pt-6 pb-6 px-4 md:p-0 min-h-[350px] md:h-[300px] gap-2 md:gap-0">

          {/* Avatar Area (Middle on mobile, Left on Desktop) */}
          <div className="relative order-2 md:order-1 w-full md:w-[40%] h-[150px] sm:h-[180px] md:h-full flex items-end justify-center md:justify-end md:pr-8 z-10 shrink-0">
            <EvolvingAvatar level={level} />
          </div>

          {/* Text Area (Top on mobile, Right on Desktop) */}
          <div className="relative order-1 md:order-2 flex-1 flex flex-col items-center md:items-start text-center md:text-left md:justify-center md:pr-12 md:pl-4 z-10 w-full">
            {/* The Header Row */}
            <div className="flex flex-col flex-wrap sm:flex-row items-center gap-2 sm:gap-4 mb-2 z-10 w-full justify-center md:justify-start">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                {greeting}
              </h1>
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs sm:text-sm">
                Lv. {level} {avatar.name}
              </Badge>
            </div>

            {/* The Subtitle */}
            <p className="text-sm text-white/80 max-w-sm drop-shadow mb-4 md:mb-8 z-10">
              Just getting started
            </p>

            {/* The XP Bar (Desktop Only Location - Hidden on Mobile) */}
            <div className="hidden md:block w-full max-w-md mt-4 z-10">
              <div className="flex justify-between items-end mb-2 drop-shadow">
                <div className="flex flex-col text-left">
                  <span className="text-white/80 flex items-center gap-1.5 text-sm font-medium mb-1">
                    <Sparkles size={14} className="text-cyan-400" />
                    Level {level}
                  </span>
                  <span className="text-xs text-cyan-200/60 uppercase tracking-widest">{avatar.name} Stage</span>
                </div>
                <span className="text-cyan-300 font-bold text-sm bg-cyan-950/50 px-2 py-1 rounded-md border border-cyan-500/20">{progress.xp} / {progress.xpNeeded} XP</span>
              </div>
              <div className="h-3.5 sm:h-4 rounded-full bg-slate-900/60 overflow-hidden border border-white/10 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* The XP Bar (Mobile Only Location - Sits at bottom of stacking order) */}
          <div className="order-3 md:hidden w-full max-w-md mx-auto mt-4 z-10">
            <div className="flex justify-between items-end mb-2 drop-shadow">
              <div className="flex flex-col text-left">
                <span className="text-white/80 flex items-center gap-1.5 text-sm font-medium mb-1">
                  <Sparkles size={14} className="text-cyan-400" />
                  Level {level}
                </span>
                <span className="text-xs text-cyan-200/60 uppercase tracking-widest">{avatar.name} Stage</span>
              </div>
              <span className="text-cyan-300 font-bold text-sm bg-cyan-950/50 px-2 py-1 rounded-md border border-cyan-500/20">{progress.xp} / {progress.xpNeeded} XP</span>
            </div>
            <div className="h-3.5 sm:h-4 rounded-full bg-slate-900/60 overflow-hidden border border-white/10 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════ */}
      {/* STATS ROW — True Glassmorphism                 */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Streak', value: `${streak} days`, icon: Flame, color: 'text-orange-400', gradient: 'from-orange-500/15 to-red-500/10', glow: 'shadow-orange-500/10' },
          { label: 'Level', value: `Level ${level}`, icon: Zap, color: 'text-cyan-400', gradient: 'from-cyan-500/15 to-blue-500/10', glow: 'shadow-cyan-500/10' },
          { label: 'Workouts', value: `${completedWorkouts}/6`, icon: Dumbbell, color: 'text-emerald-400', gradient: 'from-emerald-500/15 to-green-500/10', glow: 'shadow-emerald-500/10' },
          { label: 'XP Total', value: `${xp} XP`, icon: Star, color: 'text-violet-400', gradient: 'from-violet-500/15 to-purple-500/10', glow: 'shadow-violet-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i + 1} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-default hover:shadow-lg ${stat.glow}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <stat.icon size={14} className={stat.color} />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* MAIN GRID                                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* ─── DAILY QUESTS (Interactive) ─── */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-slate-900/50 backdrop-blur-md border border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10">
                      <Target size={16} className="text-cyan-400" />
                    </div>
                    Daily Quests
                  </CardTitle>
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                    {questsDone}/{quests.length} Done
                  </Badge>
                </div>
                {/* Quest progress bar */}
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
                  <motion.div
                    animate={{ width: `${(questsDone / quests.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {quests.map((quest) => {
                  const done = isQuestDone(quest);
                  return (
                    <motion.button
                      key={quest.id}
                      onClick={() => toggleQuest(quest.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer text-left ${done
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/15'
                        }`}
                    >
                      <motion.div
                        animate={done ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {done ? (
                          <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle size={18} className="text-muted-foreground flex-shrink-0 group-hover:text-foreground" />
                        )}
                      </motion.div>
                      <div className={`p-1 rounded-md ${done ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                        <quest.icon size={14} className={`transition-colors duration-300 ${done ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                      </div>
                      <span className={`flex-1 text-sm transition-all duration-300 ${done ? 'line-through text-muted-foreground/60' : ''}`}>
                        {quest.title}
                      </span>
                      <AnimatePresence>
                        {done && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="text-[10px] text-emerald-400 font-medium"
                          >
                            ✓
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <Badge variant="secondary" className={`text-xs transition-all duration-300 ${done ? 'bg-emerald-500/10 text-emerald-400/60 border-emerald-500/15' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        +{quest.xp} XP
                      </Badge>
                    </motion.button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── TODAY'S WORKOUT PREVIEW ─── */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-slate-900/50 backdrop-blur-md border border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                      <Dumbbell size={16} className="text-emerald-400" />
                    </div>
                    Today&apos;s Workout — {days[new Date().getDay()]}
                  </CardTitle>
                  <Link href="/workouts">
                    <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                      View All <ChevronRight size={14} />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {today?.isRestDay ? (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex justify-center mb-2"
                    >
                      <Moon className="w-10 h-10 text-indigo-400" />
                    </motion.div>
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
                        <div key={exId} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isDone ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/15'}`}>
                          <span className="text-xl">{ex.icon}</span>
                          <div className="flex-1">
                            <p className={`text-sm font-medium transition-all duration-300 ${isDone ? 'line-through text-muted-foreground/60' : ''}`}>{ex.name}</p>
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

        {/* ═══════════════════════════════════════════════ */}
        {/* RIGHT COLUMN                                   */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* ─── WATER TRACKER (Glassmorphism + Splash) ─── */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-slate-900/50 backdrop-blur-md border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <Droplets size={16} className="text-blue-400" />
                  </div>
                  Water Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <motion.p
                    key={waterGlasses}
                    initial={{ scale: 1.3, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold text-blue-400 mb-1"
                  >
                    {waterGlasses}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mb-3">of {waterGoal} glasses</p>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden mb-3 border border-white/5">
                    <motion.div
                      animate={{ width: `${Math.min((waterGlasses / waterGoal) * 100, 100)}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    />
                  </div>
                  {/* Glass icons row */}
                  <div className="flex justify-center gap-1 mb-3">
                    {Array.from({ length: waterGoal }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={false}
                        animate={i < waterGlasses ? { scale: [1, 1.2, 1], opacity: 1 } : { opacity: 0.2 }}
                        transition={{ duration: 0.3 }}
                        className={i < waterGlasses ? 'text-blue-400' : 'text-muted-foreground'}
                      >
                        <Droplets size={16} />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={removeWater}
                      className="text-xs border-white/10 hover:bg-white/5 backdrop-blur-sm"
                    >
                      −
                    </Button>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        onClick={handleAddWater}
                        className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 backdrop-blur-sm relative overflow-hidden"
                      >
                        <AnimatePresence>
                          {waterSplash && (
                            <motion.span
                              initial={{ opacity: 1, scale: 0 }}
                              animate={{ opacity: 0, scale: 3 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute inset-0 bg-blue-400/20 rounded-full"
                            />
                          )}
                        </AnimatePresence>
                        <div className="flex items-center gap-1">
                          <span>+ Add Glass</span>
                          <Droplets size={14} />
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── SLEEP TRACKER ─── */}
          <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-slate-900/50 backdrop-blur-md border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10">
                    <BedDouble size={16} className="text-indigo-400" />
                  </div>
                  Sleep Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <motion.p
                    key={sleepHours}
                    initial={{ scale: 1.2, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold text-indigo-400 mb-0.5"
                  >
                    {sleepHours}h
                  </motion.p>
                  <p className={`text-xs font-medium mb-3 ${sleepQuality.color}`}>{sleepQuality.label}</p>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden mb-3 border border-white/5">
                    <motion.div
                      animate={{ width: `${Math.min((sleepHours / 10) * 100, 100)}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                    />
                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSleepChange(sleepHours - 0.5)}
                      className="text-xs border-white/10 hover:bg-white/5 h-7 w-7 p-0 rounded-lg"
                    >
                      <Minus size={12} />
                    </Button>
                    <span className="text-sm font-medium w-16 text-center">{sleepHours}h sleep</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSleepChange(sleepHours + 0.5)}
                      className="text-xs border-white/10 hover:bg-white/5 h-7 w-7 p-0 rounded-lg"
                    >
                      <Plus size={12} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── WEEKLY ACTIVITY HEATMAP ─── */}
          <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-slate-900/50 backdrop-blur-md border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10">
                    <Activity size={16} className="text-emerald-400" />
                  </div>
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between gap-1">
                  {heatmapDays.map((day, i) => {
                    const activity = heatmapActivity[i] ?? 0;
                    const isToday = i === todayIndex;
                    const bg = activity >= 1 ? 'bg-emerald-500'
                      : activity > 0.5 ? 'bg-emerald-500/60'
                        : activity > 0 ? 'bg-emerald-500/30'
                          : 'bg-white/5';
                    return (
                      <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className={`w-full aspect-square rounded-md ${bg} ${isToday ? 'ring-1 ring-cyan-400' : ''} transition-colors cursor-default`}
                          title={`${day}: ${Math.round(activity * 100)}% complete`}
                        />
                        <span className={`text-[9px] uppercase tracking-widest ${isToday ? 'text-cyan-400 font-bold' : 'text-muted-foreground'}`}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-3 justify-end">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-white/5" /><span className="text-[9px] text-muted-foreground">None</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-500/30" /><span className="text-[9px] text-muted-foreground">Some</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-500" /><span className="text-[9px] text-muted-foreground">Full</span></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── QUICK ACTIONS (Glassmorphism) ─── */}
          <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-slate-900/50 backdrop-blur-md border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Start Workout', href: '/workouts', icon: Dumbbell, color: 'text-emerald-400', hoverBg: 'hover:bg-emerald-500/10' },
                  { label: 'Log Meal', href: '/diet', icon: Utensils, color: 'text-amber-400', hoverBg: 'hover:bg-amber-500/10' },
                  { label: 'Track Progress', href: '/progress', icon: TrendingUp, color: 'text-cyan-400', hoverBg: 'hover:bg-cyan-500/10' },
                  { label: 'Achievements', href: '/achievements', icon: Trophy, color: 'text-violet-400', hoverBg: 'hover:bg-violet-500/10' },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 ${action.hoverBg} transition-all duration-300 cursor-pointer group`}
                    >
                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                        <action.icon size={14} className={action.color} />
                      </div>
                      <span className="text-sm flex-1">{action.label}</span>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── MOTIVATIONAL QUOTE ─── */}
          <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-md border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />
              <CardContent className="p-5 relative">
                <div className="flex items-start gap-2 mb-2">
                  <div className="p-1 rounded-md bg-fuchsia-500/10">
                    <MessageSquareQuote size={16} className="text-fuchsia-400" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-0.5">Quote of the Day</p>
                </div>
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
