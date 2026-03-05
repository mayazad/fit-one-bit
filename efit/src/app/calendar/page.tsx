'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dumbbell, UtensilsCrossed, Flame, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useDietStore } from '@/stores/dietStore';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const { completion: dietCompletion } = useDietStore();

    // Calendar Helper Functions
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Create an array of days for the grid
    const days = Array.from({ length: 42 }, (_, i) => {
        const dayNumber = i - firstDay + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

        let dateObj = null;
        if (isCurrentMonth) {
            dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        }

        // Mocking Data Integration:
        // In a real app we'd map history items by ISO string to dateObj.
        // For visual demonstration, we'll randomize data on odd/even days if empty, 
        // to make the calendar look active if they haven't used the app.

        // Real check (example based on existing stores):
        // const isWorkoutDone = dateObj && history.some(h => new Date(h.date).toDateString() === dateObj.toDateString());

        // Simulated activity purely for visual UI display of the component:
        const hasWorkoutMock = isCurrentMonth && dayNumber % 3 !== 0;
        const hasDietMock = isCurrentMonth && dayNumber % 2 !== 0;

        return {
            date: dateObj,
            isCurrentMonth,
            dayNumber,
            isToday: dateObj?.toDateString() === new Date().toDateString(),
            hasWorkout: hasWorkoutMock,
            hasDiet: hasDietMock
        };
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Calendar</h1>
                    <p className="text-sm text-muted-foreground">Your monthly activity snapshot.</p>
                </div>
            </motion.div>

            <Card className="glass-card border-zinc-800/50">
                <CardContent className="p-4 sm:p-6 space-y-6">
                    {/* Calendar Header Controls */}
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-zinc-800">
                            <ChevronLeft size={20} />
                        </Button>
                        <h2 className="text-lg font-bold text-zinc-100">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-zinc-800">
                            <ChevronRight size={20} />
                        </Button>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 text-xs text-zinc-400 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div> Workout
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Diet Goal
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {/* Day Headers */}
                        {dayNames.map(day => (
                            <div key={day} className="text-center p-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}

                        {/* Days */}
                        {days.map((day, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.01 }}
                                onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
                                disabled={!day.isCurrentMonth}
                                className={`
                                    relative p-2 sm:p-4 rounded-xl border flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px] transition-all
                                    ${day.isCurrentMonth ? 'bg-zinc-900 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 cursor-pointer' : 'bg-transparent border-transparent opacity-0 pointer-events-none'}
                                    ${day.isToday ? 'ring-2 ring-orange-500/50 bg-orange-500/5' : ''}
                                `}
                            >
                                {day.isCurrentMonth && (
                                    <>
                                        <span className={`text-sm sm:text-base font-bold ${day.isToday ? 'text-orange-400' : 'text-zinc-300'}`}>
                                            {day.dayNumber}
                                        </span>

                                        <div className="flex gap-1.5 mt-2">
                                            {day.hasWorkout && (
                                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                                            )}
                                            {day.hasDiet && (
                                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                            )}
                                        </div>
                                    </>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Day Detail Modal */}
            <AnimatePresence>
                {selectedDate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-100">
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                    </h3>
                                    <p className="text-sm text-zinc-500">
                                        {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)} className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white">
                                    <X size={16} />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                        <Dumbbell size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-200 text-sm">Workout Completed</h4>
                                        <p className="text-xs text-orange-400/80 mt-0.5">+150 XP Earned</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                        <UtensilsCrossed size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-200 text-sm">Diet Goal Met</h4>
                                        <p className="text-xs text-emerald-400/80 mt-0.5">2,400 kcal consumed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-end">
                                <Button onClick={() => setSelectedDate(null)} className="bg-zinc-800 hover:bg-zinc-700 text-white w-full">
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
