'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Apple, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    const { mealPlan, completion, toggleMeal } = useDietStore();
    const { addXp } = useGamificationStore();
    const todayName = days[new Date().getDay()];

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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Diet Planner</h1>
                <p className="text-sm text-muted-foreground">Fuel your transformation with the right nutrition 🍽️</p>
            </motion.div>

            <Tabs defaultValue={todayName} className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto gap-1 p-1">
                    {days.filter(d => d !== 'Sunday').map((day) => (
                        <TabsTrigger key={day} value={day} className="text-xs">
                            {day.slice(0, 3)}
                            {day === todayName && ' •'}
                        </TabsTrigger>
                    ))}
                    <TabsTrigger value="Sunday" className="text-xs">Sun{todayName === 'Sunday' && ' •'}</TabsTrigger>
                </TabsList>

                {days.map((day) => {
                    const plan = mealPlan[day];
                    const comp = completion[day] || { breakfast: false, lunch: false, snack: false, dinner: false };
                    const macros = getTotalMacros(day);
                    const mealsCompleted = Object.values(comp).filter(Boolean).length;

                    return (
                        <TabsContent key={day} value={day} className="space-y-4">
                            {/* Macro Summary */}
                            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                                <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-white/5">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Flame size={16} className="text-orange-400" />
                                                <span className="text-sm font-medium">Daily Summary</span>
                                            </div>
                                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                                                {mealsCompleted}/4 meals tracked
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {[
                                                { label: 'Calories', value: macros.calories, unit: 'kcal', color: 'text-orange-400' },
                                                { label: 'Protein', value: macros.protein, unit: 'g', color: 'text-emerald-400' },
                                                { label: 'Carbs', value: macros.carbs, unit: 'g', color: 'text-blue-400' },
                                                { label: 'Fat', value: macros.fat, unit: 'g', color: 'text-amber-400' },
                                            ].map((macro) => (
                                                <div key={macro.label} className="text-center">
                                                    <p className={`text-lg font-bold ${macro.color}`}>{macro.value}</p>
                                                    <p className="text-[10px] text-muted-foreground">{macro.unit}</p>
                                                    <p className="text-[10px] text-muted-foreground">{macro.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <Progress value={(mealsCompleted / 4) * 100} className="h-1.5 mt-3" />
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
                                        <Card
                                            className={`glass-card border-white/5 cursor-pointer transition-all ${isDone ? 'ring-1 ring-emerald-500/30' : 'hover:border-white/10'
                                                }`}
                                            onClick={() => handleToggle(day, mealType)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    {isDone ? (
                                                        <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                                    ) : (
                                                        <Circle size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-lg">{typeInfo?.icon}</span>
                                                            <h3 className="font-medium text-sm">{typeInfo?.name}</h3>
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <Clock size={10} /> {typeInfo?.time}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm font-medium mb-1 ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                                                            {meal.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mb-2">
                                                            {meal.ingredients.join(' • ')}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-orange-400">🔥 {meal.calories} kcal</span>
                                                            <span className="text-[10px] text-emerald-400">💪 {meal.protein}g protein</span>
                                                            <span className="text-[10px] text-blue-400">🌾 {meal.carbs}g carbs</span>
                                                            <span className="text-[10px] text-amber-400">🥑 {meal.fat}g fat</span>
                                                        </div>
                                                        {meal.isLocal && (
                                                            <Badge variant="secondary" className="text-[10px] mt-2">🇧🇩 Local</Badge>
                                                        )}
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
        </div>
    );
}
