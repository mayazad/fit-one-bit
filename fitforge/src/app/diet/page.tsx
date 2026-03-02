'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Clock, RefreshCw, X, ChevronDown, ChevronUp, ChefHat, Activity } from 'lucide-react';
import { ExerciseIcon } from '@/components/ExerciseIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { meals, mealTypes } from '@/data/meals';
import { useDietStore } from '@/stores/dietStore';
import { useGamificationStore } from '@/stores/gamificationStore';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4 },
    }),
};

export default function DietPage() {
    const { mealPlan, completion, toggleMeal, swapMeal } = useDietStore();
    const { addXp } = useGamificationStore();
    const todayName = days[new Date().getDay()];

    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [swapConfig, setSwapConfig] = useState<{ day: string; type: 'breakfast' | 'lunch' | 'snack' | 'dinner' } | null>(null);
    const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

    const DAILY_CALORIE_TARGET = 2200;

    const handleToggle = (day: string, mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
        const wasCompleted = completion[day]?.[mealType];
        toggleMeal(day, mealType);
        if (!wasCompleted) {
            addXp(10);
        }
    };

    const getTotalMacros = (day: string) => {
        const plan = mealPlan[day];
        if (!plan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
        const mealIds = [plan.breakfast, plan.lunch, plan.snack, plan.dinner];
        return mealIds.reduce(
            (acc, id) => {
                const meal = meals.find(m => m.id === id);
                if (meal) {
                    acc.calories += meal.calories;
                    acc.protein += meal.protein;
                    acc.carbs += meal.carbs;
                    acc.fat += meal.fat;
                }
                return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    };

    const weeklyTotals = useMemo(() => {
        return days.reduce((acc, day) => {
            const m = getTotalMacros(day);
            return {
                calories: acc.calories + m.calories,
                protein: acc.protein + m.protein,
                carbs: acc.carbs + m.carbs,
                fat: acc.fat + m.fat
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [mealPlan]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Diet Planner</h1>
                <p className="text-sm text-muted-foreground">Fuel your transformation with the right nutrition.</p>
            </motion.div>

            <Tabs defaultValue={todayName} className="space-y-4">
                <TabsList className="bg-zinc-900/50 border border-zinc-800/50 flex-wrap h-auto gap-1 p-1">
                    <TabsTrigger value="Weekly" className="text-xs bg-emerald-500/10 text-emerald-400 data-[state=active]:bg-emerald-500/20">
                        <Activity size={12} className="mr-1" /> Weekly
                    </TabsTrigger>
                    {days.filter(d => d !== 'Sunday').map((day) => (
                        <TabsTrigger key={day} value={day} className="text-xs">
                            {day.slice(0, 3)}
                            {day === todayName && ' •'}
                        </TabsTrigger>
                    ))}
                    <TabsTrigger value="Sunday" className="text-xs">Sun{todayName === 'Sunday' && ' •'}</TabsTrigger>
                </TabsList>

                {/* ── WEEKLY OVERVIEW TAB ──────────────────────────────────── */}
                <TabsContent value="Weekly" className="space-y-4">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <Card className="glass-card border-emerald-500/20">
                            <CardHeader className="pb-3 border-b border-zinc-800/50">
                                <CardTitle className="flex items-center gap-2 text-emerald-400">
                                    <Activity size={18} /> Weekly Nutrition Targets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Weekly Calories', value: weeklyTotals.calories, unit: 'kcal', color: 'text-orange-400' },
                                        { label: 'Weekly Protein', value: weeklyTotals.protein, unit: 'g', color: 'text-emerald-400' },
                                        { label: 'Weekly Carbs', value: weeklyTotals.carbs, unit: 'g', color: 'text-blue-400' },
                                        { label: 'Weekly Fat', value: weeklyTotals.fat, unit: 'g', color: 'text-amber-400' },
                                    ].map((macro) => (
                                        <div key={macro.label} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 text-center">
                                            <p className={`text-2xl font-bold ${macro.color}`}>{macro.value.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{macro.unit}</p>
                                            <p className="text-xs font-medium mt-1">{macro.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {days.map((day) => {
                    const plan = mealPlan[day];
                    const comp = completion[day] || { breakfast: false, lunch: false, snack: false, dinner: false };
                    const macros = getTotalMacros(day);
                    const mealsCompleted = Object.values(comp).filter(Boolean).length;
                    const dailyMacroPct = Math.min((macros.calories / DAILY_CALORIE_TARGET) * 100, 100);

                    return (
                        <TabsContent key={day} value={day} className="space-y-4">
                            {/* Macro Summary */}
                            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                                <Card className="bg-gradient-to-br from-emerald-500/10 to-orange-500/10 border-zinc-800/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Flame size={16} className="text-orange-400" />
                                                <span className="text-sm font-medium">Daily Summary</span>
                                            </div>
                                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                                {mealsCompleted}/4 meals tracked
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {[
                                                { label: 'Calories', value: macros.calories, unit: 'kcal', color: 'text-orange-400' },
                                                { label: 'Protein', value: macros.protein, unit: 'g', color: 'text-emerald-400' },
                                                { label: 'Carbs', value: macros.carbs, unit: 'g', color: 'text-blue-400' },
                                                { label: 'Fat', value: macros.fat, unit: 'g', color: 'text-orange-400' },
                                            ].map((macro) => (
                                                <div key={macro.label} className="text-center">
                                                    <p className={`text-lg font-bold ${macro.color}`}>{macro.value}</p>
                                                    <p className="text-[10px] text-muted-foreground">{macro.unit}</p>
                                                    <p className="text-[10px] text-muted-foreground">{macro.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3 mt-4">
                                            <div>
                                                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                    <span>Meals Completed</span>
                                                    <span>{mealsCompleted}/4</span>
                                                </div>
                                                <Progress value={(mealsCompleted / 4) * 100} className="h-1.5 [&>div]:bg-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                    <span>Daily Calorie Target</span>
                                                    <span>{macros.calories} / {DAILY_CALORIE_TARGET} kcal</span>
                                                </div>
                                                <Progress value={dailyMacroPct} className="h-1.5 [&>div]:bg-orange-500" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Meal Cards */}
                            {plan && (['breakfast', 'lunch', 'snack', 'dinner'] as const).map((mealType, i) => {
                                const mealId = plan[mealType];
                                const meal = meals.find(m => m.id === mealId);
                                const isDone = comp[mealType];
                                const typeInfo = mealTypes.find(t => t.id === mealType);

                                if (!meal) return null;

                                return (
                                    <motion.div key={mealType} custom={i + 1} initial="hidden" animate="visible" variants={fadeUp}>
                                        <Card className={`glass-card border-zinc-800/50 transition-all ${isDone ? 'ring-1 ring-emerald-500/30' : 'hover:border-zinc-800/50'}`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <button onClick={() => handleToggle(day, mealType)} className="mt-0.5 focus:outline-none">
                                                        {isDone ? (
                                                            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                                                        ) : (
                                                            <Circle size={20} className="text-muted-foreground flex-shrink-0 hover:text-emerald-400 transition-colors" />
                                                        )}
                                                    </button>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-md bg-zinc-900/50 flex items-center justify-center flex-shrink-0">
                                                                    <ExerciseIcon icon={typeInfo?.icon ?? 'sun'} size={14} className="text-orange-400" />
                                                                </div>
                                                                <h3 className="font-medium text-sm">{typeInfo?.name}</h3>
                                                                <span className="text-[10px] text-muted-foreground hidden sm:flex items-center gap-1">
                                                                    <Clock size={10} /> {typeInfo?.time}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => { setSwapConfig({ day, type: mealType }); setSwapModalOpen(true); }}
                                                                className="h-7 px-2 text-[10px] text-muted-foreground hover:text-orange-400 hover:bg-orange-500/10"
                                                            >
                                                                <RefreshCw size={12} className="mr-1" /> Swap
                                                            </Button>
                                                        </div>
                                                        <p className={`text-sm font-medium mb-1 ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                                                            {meal.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mb-2">
                                                            {meal.ingredients.join(' • ')}
                                                        </p>
                                                        <div className="flex items-center gap-3 flex-wrap mb-2">
                                                            <span className="text-[10px] text-orange-400 flex items-center gap-1"><Flame size={10} /> {meal.calories} kcal</span>
                                                            <span className="text-[10px] text-emerald-400">{meal.protein}g protein</span>
                                                            <span className="text-[10px] text-blue-400">{meal.carbs}g carbs</span>
                                                            <span className="text-[10px] text-orange-400">{meal.fat}g fat</span>
                                                        </div>

                                                        {/* Expandable Preparation Instructions */}
                                                        <div className="mt-3 pt-3 border-t border-zinc-800/50">
                                                            <button
                                                                onClick={() => setExpandedMealId(expandedMealId === meal.id ? null : meal.id)}
                                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-zinc-300 transition-colors focus:outline-none w-full"
                                                            >
                                                                <ChefHat size={14} className="text-orange-400" />
                                                                {expandedMealId === meal.id ? 'Hide Preparation' : 'Show Preparation'}
                                                                {expandedMealId === meal.id ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
                                                            </button>

                                                            <AnimatePresence>
                                                                {expandedMealId === meal.id && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="pt-3 pb-1">
                                                                            <p className="text-xs text-muted-foreground leading-relaxed pl-5 relative">
                                                                                <span className="absolute left-0 top-0.5 text-orange-400/50">1.</span>
                                                                                {meal.preparation}
                                                                            </p>
                                                                            {meal.isLocal && (
                                                                                <Badge variant="secondary" className="text-[10px] mt-3 ml-5 bg-orange-500/10 text-orange-400 border-orange-500/20">Local Favorite</Badge>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>

                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </TabsContent>
                    );
                })}
            </Tabs>

            {/* ── MEAL SWAP MODAL ─────────────────────────────────────── */}
            <AnimatePresence>
                {swapModalOpen && swapConfig && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
                        >
                            <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold capitalize">Swap {swapConfig.type}</h2>
                                    <p className="text-xs text-muted-foreground">Select a new meal for {swapConfig.day}</p>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => setSwapModalOpen(false)}>
                                    <X size={18} />
                                </Button>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1 space-y-3">
                                {meals.filter(m => m.type === swapConfig.type).map(meal => {
                                    const isCurrent = mealPlan[swapConfig.day]?.[swapConfig.type] === meal.id;
                                    return (
                                        <Card
                                            key={meal.id}
                                            onClick={() => {
                                                if (!isCurrent) {
                                                    swapMeal(swapConfig.day, swapConfig.type, meal.id);
                                                    setSwapModalOpen(false);
                                                }
                                            }}
                                            className={`glass-card transition-all cursor-pointer ${isCurrent ? 'border-orange-500/30 bg-orange-500/5 opacity-50' : 'border-zinc-800/50 hover:border-emerald-500/50'}`}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-semibold">{meal.name}</h4>
                                                    {isCurrent && <Badge variant="secondary" className="text-[10px]">Current</Badge>}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1">{meal.ingredients.join(', ')}</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] text-orange-400 font-medium">{meal.calories} kcal</span>
                                                    <span className="text-[10px] text-emerald-400">{meal.protein}g protein</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
