'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Check, X, Trash2, Settings2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHabitStore } from '@/stores/habitStore';
import * as LucideIcons from 'lucide-react';

const availableIcons = ['Droplets', 'Book', 'Moon', 'Sun', 'Coffee', 'Dumbbell', 'Apple', 'Zap', 'Target'];

export default function HabitsPage() {
    const { habits, addHabit, toggleHabit, deleteHabit, getStreak } = useHabitStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newIcon, setNewIcon] = useState('Target');

    // Get the last 7 days including today
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (6 - i));
        return {
            dateStr: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateNum: d.getDate(),
            isToday: i === 6
        };
    });

    const handleAdd = () => {
        if (!newTitle.trim()) return;
        addHabit(newTitle, newIcon);
        setNewTitle('');
        setIsAdding(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Habit Tracker</h1>
                    <p className="text-sm text-muted-foreground">Build consistency, one day at a time.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                >
                    <Plus size={16} /> <span className="hidden sm:inline">New Habit</span>
                </Button>
            </motion.div>

            {/* Add Habit Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="glass-card border-orange-500/30">
                            <CardContent className="p-4 sm:p-6 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-orange-400">Create New Habit</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-8 w-8 p-0"><X size={16} /></Button>
                                </div>

                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Habit Name</label>
                                    <Input
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="e.g. Read 10 Pages"
                                        className="bg-zinc-900/50"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-zinc-400 mb-2 block">Icon</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableIcons.map(icon => {
                                            const IconObj = LucideIcons[icon as keyof typeof LucideIcons] as any;
                                            return (
                                                <button
                                                    key={icon}
                                                    onClick={() => setNewIcon(icon)}
                                                    className={`p-3 rounded-xl border transition-all ${newIcon === icon
                                                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                                        }`}
                                                >
                                                    {IconObj && <IconObj size={20} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Button onClick={handleAdd} disabled={!newTitle.trim()} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                    Save Habit
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Card className="glass-card border-zinc-800/50">
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[600px]">
                        {/* Header Row */}
                        <div className="grid grid-cols-[200px_1fr] border-b border-zinc-800/50">
                            <div className="p-4 flex items-end">
                                <span className="text-sm font-medium text-zinc-400">Habits</span>
                            </div>
                            <div className="grid grid-cols-7">
                                {last7Days.map(day => (
                                    <div key={day.dateStr} className={`p-2 text-center flex flex-col items-center justify-end ${day.isToday ? 'bg-zinc-800/30' : ''}`}>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${day.isToday ? 'text-orange-400' : 'text-zinc-500'}`}>{day.dayName}</span>
                                        <span className={`text-sm font-medium ${day.isToday ? 'text-orange-400' : 'text-zinc-300'}`}>{day.dateNum}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Habits Rows */}
                        <div className="divide-y divide-zinc-800/50">
                            {habits.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500">
                                    No habits created yet. Click "New Habit" to start tracking!
                                </div>
                            ) : habits.map((habit, index) => {
                                const IconObj = LucideIcons[habit.icon as keyof typeof LucideIcons] as any || LucideIcons.Target;
                                const currentStreak = getStreak(habit.id);

                                return (
                                    <motion.div
                                        key={habit.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="grid grid-cols-[200px_1fr] group hover:bg-zinc-800/10 transition-colors"
                                    >
                                        <div className="p-4 flex items-center justify-between border-r border-zinc-800/50">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                                                    <IconObj size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-zinc-200 truncate pr-2">{habit.title}</h3>
                                                    <div className="flex items-center gap-1 text-[10px] text-orange-400/80 mt-0.5 font-medium">
                                                        <Flame size={10} /> {currentStreak} day streak
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => deleteHabit(habit.id)}
                                                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7">
                                            {last7Days.map(day => {
                                                const isCompleted = habit.completions.includes(day.dateStr);
                                                return (
                                                    <div key={day.dateStr} className={`p-2 flex items-center justify-center ${day.isToday ? 'bg-zinc-800/30' : ''}`}>
                                                        <button
                                                            onClick={() => toggleHabit(habit.id, day.dateStr)}
                                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isCompleted
                                                                ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                                : 'bg-zinc-900 border-2 border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
                                                                }`}
                                                        >
                                                            {isCompleted ? <Check size={20} className="drop-shadow-sm" /> : <div className="w-2 h-2 rounded-full bg-current opacity-20" />}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
