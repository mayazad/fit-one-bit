'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame, Shield, Wind, Zap, ChevronRight, ChevronLeft,
    Target, HeartPulse, Dumbbell, Move, Apple, Utensils,
    Leaf, DollarSign, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/* ───── animation variants ───── */
const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const TOTAL_STEPS = 5;

/* ───── data ───── */
const classes = [
    {
        id: 'striker',
        name: 'The Striker',
        goal: 'Lean out, lose fat',
        desc: 'High-intensity fat-burning routines with cardio and core emphasis. Built for rapid definition.',
        Icon: Flame,
        color: 'orange',
        iconWrap: 'bg-orange-500/10 border-orange-500/20',
        iconColor: 'text-orange-400',
        ring: 'ring-orange-400/60 bg-orange-400/10 border-orange-400/30',
    },
    {
        id: 'vanguard',
        name: 'The Vanguard',
        goal: 'Build muscle, wide chest',
        desc: 'Progressive-overload strength training targeting chest, shoulders, and arms for maximum mass.',
        Icon: Shield,
        color: 'violet',
        iconWrap: 'bg-violet-500/10 border-violet-500/20',
        iconColor: 'text-violet-400',
        ring: 'ring-violet-400/60 bg-violet-400/10 border-violet-400/30',
    },
    {
        id: 'ranger',
        name: 'The Ranger',
        goal: 'Stamina, posture, flexibility',
        desc: 'Balanced mobility work, posture correction, and endurance training for full-body resilience.',
        Icon: Wind,
        color: 'teal',
        iconWrap: 'bg-teal-500/10 border-teal-500/20',
        iconColor: 'text-teal-400',
        ring: 'ring-teal-400/60 bg-teal-400/10 border-teal-400/30',
    },
];

const weaknesses = [
    { id: 'posture', label: 'Posture Correction', Icon: Move, color: 'text-teal-400' },
    { id: 'chest', label: 'Chest Definition', Icon: Dumbbell, color: 'text-violet-400' },
    { id: 'belly', label: 'Belly Fat Reduction', Icon: Flame, color: 'text-orange-400' },
    { id: 'flexibility', label: 'Flexibility', Icon: Wind, color: 'text-cyan-400' },
    { id: 'endurance', label: 'Endurance', Icon: HeartPulse, color: 'text-rose-400' },
    { id: 'arms', label: 'Arm Strength', Icon: Dumbbell, color: 'text-amber-400' },
    { id: 'core', label: 'Core Stability', Icon: Target, color: 'text-purple-400' },
    { id: 'legs', label: 'Leg Power', Icon: Zap, color: 'text-blue-400' },
];

const dietOptions = [
    { id: 'balanced', label: 'Balanced & Healthy', desc: 'Well-rounded macros for steady progress', Icon: Utensils, color: 'text-emerald-400', ring: 'ring-emerald-400/60 bg-emerald-400/10 border-emerald-400/30' },
    { id: 'high-protein', label: 'High Protein', desc: 'Protein-focused meals for muscle gain', Icon: Dumbbell, color: 'text-violet-400', ring: 'ring-violet-400/60 bg-violet-400/10 border-violet-400/30' },
    { id: 'local-budget', label: 'Budget-Friendly / Local', desc: 'Affordable local ingredients, max nutrition', Icon: DollarSign, color: 'text-amber-400', ring: 'ring-amber-400/60 bg-amber-400/10 border-amber-400/30', featured: true },
    { id: 'clean', label: 'Clean Eating', desc: 'Whole foods, minimal processed items', Icon: Leaf, color: 'text-teal-400', ring: 'ring-teal-400/60 bg-teal-400/10 border-teal-400/30' },
];

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);

    /* form data */
    const [baseStats, setBaseStats] = useState({ age: '', height: '', weight: '' });
    const [primaryClass, setPrimaryClass] = useState('');
    const [focusAreas, setFocusAreas] = useState<string[]>([]);
    const [dietPref, setDietPref] = useState('');
    const [forging, setForging] = useState(false);

    const next = useCallback(() => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); }, []);
    const back = useCallback(() => { setDirection(-1); setStep(s => Math.max(s - 1, 1)); }, []);

    const toggleFocus = (id: string) => {
        setFocusAreas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleFinish = () => {
        setForging(true);
        setTimeout(() => router.push('/dashboard'), 2500);
    };

    const canAdvance = () => {
        switch (step) {
            case 1: return baseStats.age && baseStats.height && baseStats.weight;
            case 2: return !!primaryClass;
            case 3: return focusAreas.length > 0;
            case 4: return !!dietPref;
            default: return true;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* bg depth */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-teal-500/[0.06] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/[0.06] rounded-full blur-[120px]" />
            </div>

            {/* ── top bar ── */}
            <div className="relative z-10 px-6 pt-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                                <Zap size={16} className="text-teal-400" />
                            </div>
                            <span className="text-sm font-bold bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">
                                FitForge
                            </span>
                        </div>
                        <span className="text-xs text-white/30">Step {step} of {TOTAL_STEPS}</span>
                    </div>

                    {/* progress bar */}
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-violet-600"
                            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>

            {/* ── main content ── */}
            <div className="flex-1 flex items-center justify-center relative z-10 px-6 py-10">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait" custom={direction}>
                        {/* ═══ STEP 1: Base Stats ═══ */}
                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium mb-4">
                                        <Target size={12} /> Character Setup
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-black mb-2">Enter Your Base Stats</h1>
                                    <p className="text-sm text-white/40">Every hero needs a starting point. No judgment — only progress.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'age', label: 'Age', placeholder: '22', type: 'number', unit: 'years' },
                                        { key: 'height', label: 'Height', placeholder: '5\'7" or 170cm', type: 'text', unit: '' },
                                        { key: 'weight', label: 'Weight', placeholder: '56', type: 'number', unit: 'kg' },
                                    ].map(f => (
                                        <div key={f.key} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                            <label className="text-xs text-white/50 mb-1.5 block font-medium">{f.label}{f.unit && <span className="text-white/25 ml-1">({f.unit})</span>}</label>
                                            <Input
                                                type={f.type}
                                                placeholder={f.placeholder}
                                                value={baseStats[f.key as keyof typeof baseStats]}
                                                onChange={e => setBaseStats(prev => ({ ...prev, [f.key]: e.target.value }))}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 2: Choose Your Class ═══ */}
                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 font-medium mb-4">
                                        <Shield size={12} /> Choose Your Path
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-black mb-2">Choose Your Class</h1>
                                    <p className="text-sm text-white/40">Your primary goal shapes your entire training program.</p>
                                </div>

                                <div className="space-y-3">
                                    {classes.map(cls => {
                                        const selected = primaryClass === cls.id;
                                        return (
                                            <motion.button
                                                key={cls.id}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setPrimaryClass(cls.id)}
                                                className={`group w-full text-left p-5 rounded-2xl border transition-all duration-300 ${selected
                                                        ? `ring-2 ${cls.ring}`
                                                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${selected ? cls.iconWrap : 'bg-white/5'} border flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                                                        <cls.Icon size={22} className={selected ? cls.iconColor : 'text-white/40'} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h3 className="font-bold">{cls.name}</h3>
                                                            <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{cls.goal}</span>
                                                        </div>
                                                        <p className="text-xs text-white/40 leading-relaxed">{cls.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 3: Target Weaknesses ═══ */}
                        {step === 3 && (
                            <motion.div
                                key="step-3"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400 font-medium mb-4">
                                        <Target size={12} /> Focus Areas
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-black mb-2">Target Weaknesses</h1>
                                    <p className="text-sm text-white/40">Select all areas you want to improve. We&apos;ll prioritize them.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {weaknesses.map(w => {
                                        const selected = focusAreas.includes(w.id);
                                        return (
                                            <motion.button
                                                key={w.id}
                                                whileTap={{ scale: 0.96 }}
                                                onClick={() => toggleFocus(w.id)}
                                                className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left ${selected
                                                        ? 'ring-2 ring-teal-400/60 bg-teal-400/10 border-teal-400/30'
                                                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                                                    }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${selected ? 'bg-teal-500/20' : 'bg-white/5'
                                                    }`}>
                                                    <w.Icon size={16} className={selected ? 'text-teal-400' : w.color} />
                                                </div>
                                                <span className={`text-sm font-medium ${selected ? 'text-teal-300' : 'text-white/60'}`}>
                                                    {w.label}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 4: Diet Preference ═══ */}
                        {step === 4 && (
                            <motion.div
                                key="step-4"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium mb-4">
                                        <Apple size={12} /> Fuel Strategy
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-black mb-2">Diet &amp; Fuel</h1>
                                    <p className="text-sm text-white/40">How do you want to eat? Pick the style that fits your life.</p>
                                </div>

                                <div className="space-y-3">
                                    {dietOptions.map(d => {
                                        const selected = dietPref === d.id;
                                        return (
                                            <motion.button
                                                key={d.id}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setDietPref(d.id)}
                                                className={`group w-full text-left p-4 rounded-xl border transition-all duration-300 relative ${selected
                                                        ? `ring-2 ${d.ring}`
                                                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                                                    }`}
                                            >
                                                {d.featured && (
                                                    <span className="absolute top-2 right-3 text-[9px] uppercase tracking-wider text-amber-400/80 font-bold flex items-center gap-1">
                                                        <Sparkles size={9} /> Recommended
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${selected ? 'bg-white/10' : 'bg-white/5'
                                                        }`}>
                                                        <d.Icon size={18} className={selected ? d.color : 'text-white/40'} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold">{d.label}</h3>
                                                        <p className="text-[11px] text-white/35">{d.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ STEP 5: Forging / Reveal ═══ */}
                        {step === 5 && (
                            <motion.div
                                key="step-5"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35 }}
                                className="text-center py-12"
                            >
                                {!forging ? (
                                    <div>
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs text-teal-400 font-medium mb-4">
                                                <Sparkles size={12} /> Ready to Forge
                                            </div>
                                            <h1 className="text-2xl sm:text-3xl font-black mb-2">Your Character Awaits</h1>
                                            <p className="text-sm text-white/40 max-w-md mx-auto">
                                                We&apos;ll use your stats to create a personalized AI training plan, diet schedule, and your unique avatar evolution path.
                                            </p>
                                        </div>

                                        {/* summary */}
                                        <div className="grid grid-cols-2 gap-3 mb-8 text-left max-w-md mx-auto">
                                            {[
                                                { label: 'Class', value: classes.find(c => c.id === primaryClass)?.name ?? '—' },
                                                { label: 'Focus Areas', value: `${focusAreas.length} selected` },
                                                { label: 'Diet', value: dietOptions.find(d => d.id === dietPref)?.label ?? '—' },
                                                { label: 'Weight', value: baseStats.weight ? `${baseStats.weight} kg` : '—' },
                                            ].map(s => (
                                                <div key={s.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                                    <p className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</p>
                                                    <p className="text-sm font-bold text-white/80 mt-0.5">{s.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={handleFinish}
                                            className="bg-gradient-to-r from-teal-500 to-violet-600 text-white border-0 px-8 py-3 text-base font-bold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
                                        >
                                            <Sparkles size={16} className="mr-2" /> Forge My Avatar
                                        </Button>
                                    </div>
                                ) : (
                                    /* forging animation */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center gap-6 py-8"
                                    >
                                        {/* spinning glow */}
                                        <div className="relative">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                className="w-32 h-32 rounded-full border-2 border-dashed border-teal-500/30"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-violet-600/20 flex items-center justify-center">
                                                    <Zap size={32} className="text-teal-400" />
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div>
                                            <motion.h2
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                className="text-xl font-black"
                                            >
                                                Forging your avatar...
                                            </motion.h2>
                                            <p className="text-xs text-white/30 mt-2">Building your personalized training path</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── bottom nav buttons ── */}
            {!forging && (
                <div className="relative z-10 px-6 pb-8">
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        {step > 1 ? (
                            <Button
                                variant="ghost"
                                onClick={back}
                                className="text-white/50 hover:text-white hover:bg-white/5 gap-1.5"
                            >
                                <ChevronLeft size={16} /> Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        {step < 5 ? (
                            <Button
                                onClick={next}
                                disabled={!canAdvance()}
                                className="bg-gradient-to-r from-teal-500 to-violet-600 text-white border-0 px-6 gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-teal-500/20 transition-all"
                            >
                                Next <ChevronRight size={16} />
                            </Button>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
