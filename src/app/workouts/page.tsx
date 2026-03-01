'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, CheckCircle2, Circle, Dumbbell, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { exercises, categories } from '@/data/exercises';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useGamificationStore } from '@/stores/gamificationStore';
import { Exercise, MuscleGroup } from '@/types';

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

    const filteredExercises = exercises.filter((ex) => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
            ex.muscles.some(m => m.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleToggleExercise = (dayIndex: number, exerciseId: string) => {
        const day = weeklyPlan[dayIndex];
        const wasCompleted = day.completedExercises.includes(exerciseId);
        toggleExercise(dayIndex, exerciseId);
        if (!wasCompleted) {
            addXp(15);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Workouts</h1>
                <p className="text-sm text-muted-foreground">Build your body, one rep at a time 💪</p>
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
                                                <div className="flex items-center gap-2">
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
                                                {!day.isRestDay && (
                                                    <span className="text-xs text-muted-foreground">{Math.round(completionPct)}%</span>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-3">
                                            {day.isRestDay ? (
                                                <p className="text-xs text-muted-foreground py-2">Recovery day — let your muscles grow! 💤</p>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    {day.exercises.map((exId) => {
                                                        const ex = exercises.find(e => e.id === exId);
                                                        if (!ex) return null;
                                                        const isDone = day.completedExercises.includes(exId);
                                                        return (
                                                            <button
                                                                key={exId}
                                                                onClick={() => handleToggleExercise(dayIndex, exId)}
                                                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${isDone
                                                                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                                                                        : 'bg-white/3 border border-white/5 hover:border-white/10'
                                                                    }`}
                                                            >
                                                                {isDone ? (
                                                                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                                                ) : (
                                                                    <Circle size={16} className="text-muted-foreground flex-shrink-0" />
                                                                )}
                                                                <span className="text-lg">{ex.icon}</span>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm ${isDone ? 'line-through text-muted-foreground' : ''}`}>{ex.name}</p>
                                                                    <p className="text-[10px] text-muted-foreground">{ex.sets} × {ex.reps}</p>
                                                                </div>
                                                                <Badge variant="secondary" className="text-[10px]">{ex.difficulty}</Badge>
                                                            </button>
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
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.id)}
                                className="text-xs flex-shrink-0 border-white/10"
                            >
                                {cat.icon} {cat.name}
                            </Button>
                        ))}
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
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center text-2xl flex-shrink-0">
                                                {ex.icon}
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
