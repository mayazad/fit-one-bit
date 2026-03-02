'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Flame, Dumbbell, Strikethrough, StretchHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { flexibilityRoutines, FlexibilityRoutine } from '@/data/flexibility';

export default function FlexibilityPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Fade up animation variant
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5 }
        })
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <StretchHorizontal className="text-orange-500" /> Flexibility & Posture
                </h1>
                <p className="text-muted-foreground mt-1">Enhance your mobility, relieve tension, and improve your daily posture.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flexibilityRoutines.map((routine, i) => (
                    <motion.div
                        key={routine.id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        whileHover={{ y: -5 }}
                        className="h-full"
                    >
                        <Card className="overflow-hidden glass-card border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 h-full flex flex-col group">
                            <div className="relative h-48 sm:h-56 w-full overflow-hidden shrink-0">
                                <img
                                    src={routine.image}
                                    alt={routine.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-orange-400 text-xs font-bold rounded-full border border-orange-500/20 shadow-lg">
                                        Mobility
                                    </span>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 text-left">
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{routine.title}</h3>
                                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-300">
                                        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                                            <Clock size={14} className="text-sky-400" /> {routine.duration}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                                            <Flame size={14} className="text-orange-500" /> {routine.calories} kcal
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-5 sm:p-6 flex-grow flex flex-col justify-between pt-6">
                                <div className="space-y-4 mb-6">
                                    {(expandedId === routine.id ? routine.exercises : routine.exercises.slice(0, 3)).map((ex: any, idx: number) => (
                                        <div key={ex.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="text-orange-500 font-bold opacity-50">{idx + 1}.</span>
                                                <span className="text-zinc-300 font-medium">{ex.name}</span>
                                            </div>
                                            <span className="text-zinc-500 font-mono text-xs bg-zinc-900/50 px-2 py-0.5 rounded">
                                                {ex.type === 'timed' ? ex.reps : `${ex.reps} reps`}
                                            </span>
                                        </div>
                                    ))}
                                    {routine.exercises.length > 3 && expandedId !== routine.id && (
                                        <p className="text-xs text-center text-zinc-500 font-medium pt-2 border-t border-zinc-800/50">
                                            + {routine.exercises.length - 3} more stretches
                                        </p>
                                    )}
                                </div>

                                <Button
                                    className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 font-bold h-12 rounded-xl transition-all"
                                    onClick={() => setExpandedId(expandedId === routine.id ? null : routine.id)}
                                >
                                    {expandedId === routine.id ? 'Show Less' : 'View Full Routine'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
