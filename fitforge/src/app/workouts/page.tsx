'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, CheckCircle2, Circle, Dumbbell, RotateCcw, Play, SkipForward, X, Trophy, Flame, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { exercises, categories } from '@/data/exercises';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useGamificationStore } from '@/stores/gamificationStore';
import { Exercise } from '@/types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4 },
    }),
};

export default function WorkoutsPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const { weeklyPlan, toggleExercise, resetWeek, completedWorkouts } = useWorkoutStore();
    const { addXp } = useGamificationStore();
    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

    // ── Guided Workout Mode ──────────────────────────────────────────
    const [workoutActive, setWorkoutActive] = useState(false);
    const [guidedDayIndex, setGuidedDayIndex] = useState(todayIndex);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    // ── Rest Timer ───────────────────────────────────────────────────
    const [restTimerActive, setRestTimerActive] = useState(false);
    const [restSecondsLeft, setRestSecondsLeft] = useState(60);
    const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startRestTimer = useCallback((seconds = 60) => {
        setRestSecondsLeft(seconds);
        setRestTimerActive(true);
    }, []);

    useEffect(() => {
        if (restTimerActive && restSecondsLeft > 0) {
            restIntervalRef.current = setInterval(() => {
                setRestSecondsLeft(prev => {
                    if (prev <= 1) {
                        setRestTimerActive(false);
                        clearInterval(restIntervalRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (restIntervalRef.current) clearInterval(restIntervalRef.current); };
    }, [restTimerActive]);

    // ── Exercise completion (with XP + visual) ───────────────────────
    const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

    const handleToggleExercise = useCallback((dayIndex: number, exerciseId: string) => {
        const day = weeklyPlan[dayIndex];
        const wasCompleted = day.completedExercises.includes(exerciseId);
        toggleExercise(dayIndex, exerciseId);
        if (!wasCompleted) {
            addXp(15);
            setJustCompletedId(exerciseId);
            setTimeout(() => setJustCompletedId(null), 800);
            startRestTimer(60);
        }
    }, [weeklyPlan, toggleExercise, addXp, startRestTimer]);

    // ── Guided Mode Navigation ───────────────────────────────────────
    const guidedDay = weeklyPlan[guidedDayIndex];
    const guidedExercises = guidedDay?.exercises ?? [];
    const currentExId = guidedExercises[currentExerciseIndex];
    const currentEx = exercises.find(e => e.id === currentExId);

    const startWorkout = (dayIndex: number) => {
        setGuidedDayIndex(dayIndex);
        setCurrentExerciseIndex(0);
        setWorkoutActive(true);
    };

    const handleGuidedComplete = () => {
        handleToggleExercise(guidedDayIndex, currentExId);
        if (currentExerciseIndex < guidedExercises.length - 1) {
            setCurrentExerciseIndex(i => i + 1);
        } else {
            setWorkoutActive(false);
            setShowCompletionModal(true);
        }
    };

    const handleGuidedSkip = () => {
        if (currentExerciseIndex < guidedExercises.length - 1) {
            setCurrentExerciseIndex(i => i + 1);
        } else {
            setWorkoutActive(false);
            setShowCompletionModal(true);
        }
    };

    // ── Exercise grid filter ─────────────────────────────────────────
    const filteredExercises = exercises.filter((ex) => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
            ex.muscles.some(m => m.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* ── REST TIMER FLOATING OVERLAY ─────── */}
            <AnimatePresence>
                {restTimerActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.8 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4"
                    >
                        <div className="relative w-14 h-14">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                <motion.circle
                                    cx="28" cy="28" r="24" fill="none"
                                    stroke="rgb(52 211 153)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 24}`}
                                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - restSecondsLeft / 60)}`}
                                    transition={{ duration: 1, ease: 'linear' }}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-400">{restSecondsLeft}s</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Rest Time</p>
                            <p className="text-xs text-muted-foreground">Get ready for the next set!</p>
                        </div>
                        <Button
                            size="sm" variant="ghost"
                            onClick={() => { setRestTimerActive(false); clearInterval(restIntervalRef.current!); }}
                            className="text-muted-foreground hover:text-white"
                        >
                            <X size={16} />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── GUIDED WORKOUT MODE OVERLAY ────── */}
            <AnimatePresence>
                {workoutActive && currentEx && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Exercise {currentExerciseIndex + 1} / {guidedExercises.length}</p>
                                    <h2 className="text-xl font-bold">{currentEx.name}</h2>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => setWorkoutActive(false)}><X size={18} /></Button>
                            </div>
                            <Progress value={((currentExerciseIndex) / guidedExercises.length) * 100} className="h-1.5 mb-5" />
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center mx-auto mb-4">
                                <currentEx.icon size={28} className="text-cyan-400" />
                            </div>
                            <div className="text-center mb-5">
                                <p className="text-2xl font-black">{currentEx.sets} sets × {currentEx.reps}</p>
                                <p className="text-sm text-muted-foreground">{currentEx.muscles.join(', ')}</p>
                                <Badge variant="secondary" className="mt-2 text-xs">{currentEx.difficulty}</Badge>
                            </div>
                            <div className="space-y-2">
                                {currentEx.instructions.slice(0, 2).map((step, i) => (
                                    <p key={i} className="text-xs text-muted-foreground"><span className="text-cyan-400 font-mono">{i + 1}.</span> {step}</p>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-5">
                                <Button variant="ghost" size="sm" onClick={handleGuidedSkip} className="flex-1 border border-white/10 text-muted-foreground">
                                    <SkipForward size={14} className="mr-1" /> Skip
                                </Button>
                                <Button size="sm" onClick={handleGuidedComplete} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30">
                                    <CheckCircle2 size={14} className="mr-1" /> Done! +15 XP
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── WORKOUT COMPLETION MODAL ─────── */}
            <AnimatePresence>
                {showCompletionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 30 }}
                            className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 w-full max-w-sm text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.6 }}
                                className="text-6xl mb-4 flex justify-center"
                            >
                                <Trophy className="w-16 h-16 text-yellow-400" />
                            </motion.div>
                            <h2 className="text-2xl font-black mb-1">Workout Complete!</h2>
                            <p className="text-muted-foreground text-sm mb-4">Crushing it! Your progress is updating.</p>
                            <div className="flex gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Exercises</p>
                                    <p className="text-lg font-bold text-emerald-400">{guidedExercises.length}</p>
                                </div>
                                <div className="flex-1 border-l border-white/10">
                                    <p className="text-xs text-muted-foreground">XP Earned</p>
                                    <p className="text-lg font-bold text-cyan-400">+{guidedExercises.length * 15}</p>
                                </div>
                                <div className="flex-1 border-l border-white/10">
                                    <p className="text-xs text-muted-foreground">Streak</p>
                                    <p className="text-lg font-bold text-orange-400 flex items-center justify-center gap-1"><Flame size={14} /> Keep it!</p>
                                </div>
                            </div>
                            <Button onClick={() => setShowCompletionModal(false)} className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30">
                                Awesome! 💪
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── PAGE HEADER ────────────────────── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Workouts</h1>
                <p className="text-sm text-muted-foreground">Build your body, one rep at a time.</p>
            </motion.div>

            <Tabs defaultValue="planner" className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
                    <TabsTrigger value="exercises">All Exercises</TabsTrigger>
                </TabsList>

                {/* Weekly Planner Tab */}
                <TabsContent value="planner" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {completedWorkouts}/6 workouts completed this week
                        </p>
                        <Button variant="outline" size="sm" onClick={resetWeek} className="text-xs border-white/10">
                            <RotateCcw size={14} className="mr-1" /> Reset Week
                        </Button>
                    </div>
                    <Progress value={(completedWorkouts / 6) * 100} className="h-2" />

                    <div className="space-y-3">
                        {weeklyPlan.map((day, dayIndex) => {
                            const isToday = dayIndex === todayIndex;
                            const completionPct = day.exercises.length > 0
                                ? (day.completedExercises.length / day.exercises.length) * 100
                                : 0;

                            return (
                                <motion.div key={day.day} custom={dayIndex} initial="hidden" animate="visible" variants={fadeUp}>
                                    <Card className={`glass-card border-white/5 ${isToday ? 'ring-1 ring-cyan-500/30' : ''}`}>
                                        <CardHeader className="pb-2 pt-4 px-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <CardTitle className="text-sm">{day.day}</CardTitle>
                                                    {isToday && (
                                                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">
                                                            Today
                                                        </Badge>
                                                    )}
                                                    {day.isRestDay && (
                                                        <Badge variant="secondary" className="text-[10px]">Rest Day 😴</Badge>
                                                    )}
                                                    {day.completed && (
                                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                                                            ✓ Complete
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!day.isRestDay && (
                                                        <>
                                                            <span className="text-xs text-muted-foreground">{Math.round(completionPct)}%</span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => startWorkout(dayIndex)}
                                                                className="text-[11px] h-7 px-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 flex items-center gap-1"
                                                            >
                                                                <Play size={11} /> Start
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            {day.isRestDay ? (
                                                <p className="text-xs text-muted-foreground py-2">Recovery day — rest and let your muscles recover.</p>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    {day.exercises.map((exId) => {
                                                        const ex = exercises.find(e => e.id === exId);
                                                        if (!ex) return null;
                                                        const isDone = day.completedExercises.includes(exId);
                                                        const justDone = justCompletedId === exId;
                                                        return (
                                                            <motion.button
                                                                key={exId}
                                                                onClick={() => handleToggleExercise(dayIndex, exId)}
                                                                whileTap={{ scale: 0.97 }}
                                                                animate={justDone ? { scale: [1, 1.04, 1], backgroundColor: ['rgba(52,211,153,0.1)', 'rgba(52,211,153,0.2)', 'rgba(52,211,153,0.1)'] } : {}}
                                                                className={`group w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${isDone
                                                                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                                                                    : 'bg-white/3 border border-white/5 hover:border-white/15'
                                                                    }`}
                                                            >
                                                                {isDone ? (
                                                                    <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                                                    </motion.div>
                                                                ) : (
                                                                    <motion.div key="undone" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                                        <Circle size={16} className="text-muted-foreground flex-shrink-0 transition-colors duration-200 group-hover:text-teal-400" />
                                                                    </motion.div>
                                                                )}
                                                                {(() => {
                                                                    const CatIcon = ex.icon;
                                                                    return (
                                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                                                            <CatIcon size={15} className="text-cyan-400" />
                                                                        </div>
                                                                    );
                                                                })()}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm ${isDone ? 'line-through text-muted-foreground' : ''}`}>{ex.name}</p>
                                                                    <p className="text-[10px] text-muted-foreground">{ex.sets} × {ex.reps}</p>
                                                                </div>
                                                                {justDone && (
                                                                    <motion.span
                                                                        initial={{ opacity: 0, y: -5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0 }}
                                                                        className="text-[10px] text-emerald-400 font-bold"
                                                                    >+15 XP</motion.span>
                                                                )}
                                                                <Badge variant="secondary" className="text-[10px]">{ex.difficulty}</Badge>
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Exercises Tab */}
                <TabsContent value="exercises" className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search exercises, muscles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-white/5 border-white/10"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <Button
                            variant={selectedCategory === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className="text-xs flex-shrink-0"
                        >
                            All
                        </Button>
                        {categories.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                                <Button
                                    key={cat.id}
                                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className="text-xs flex-shrink-0 border-white/10 flex items-center gap-1.5"
                                >
                                    <CatIcon size={12} />
                                    {cat.name}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Exercise Grid */}
                    <div className="grid sm:grid-cols-2 gap-3">
                        {filteredExercises.map((ex, i) => (
                            <motion.div key={ex.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                                <Card
                                    className="glass-card border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                                    onClick={() => setSelectedExercise(selectedExercise?.id === ex.id ? null : ex)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center flex-shrink-0">
                                                <ex.icon size={24} className="text-cyan-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm">{ex.name}</h3>
                                                <p className="text-xs text-muted-foreground">{ex.muscles.join(', ')}</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Badge variant="secondary" className="text-[10px]">{ex.difficulty}</Badge>
                                                    <span className="text-[10px] text-muted-foreground">{ex.sets} × {ex.reps}</span>
                                                    <span className="text-[10px] text-orange-400">🔥 {ex.calories} cal</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
                                        </div>

                                        {/* Expanded detail */}
                                        <AnimatePresence>
                                            {selectedExercise?.id === ex.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                                                        <div>
                                                            <h4 className="text-xs font-medium text-cyan-400 mb-1.5">Instructions</h4>
                                                            <ol className="space-y-1">
                                                                {ex.instructions.map((step, idx) => (
                                                                    <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                                                                        <span className="text-cyan-400/60 font-mono">{idx + 1}.</span>
                                                                        {step}
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-medium text-emerald-400 mb-1.5">Benefits</h4>
                                                            <ul className="space-y-1">
                                                                {ex.benefits.map((b, idx) => (
                                                                    <li key={idx} className="text-xs text-muted-foreground">✅ {b}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-medium text-red-400 mb-1.5">Common Mistakes</h4>
                                                            <ul className="space-y-1">
                                                                {ex.commonMistakes.map((m, idx) => (
                                                                    <li key={idx} className="text-xs text-muted-foreground">⚠️ {m}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
